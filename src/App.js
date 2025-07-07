import React, { useState, useRef, useEffect } from "react";
import Logo from "./components/Logo"
import { Button } from "./components/ui/button"
import { Send, SendHorizonal } from "lucide-react"
import { useTheme } from "./contexts/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";
import MobileSidebar from "./components/MobileSidebar";
import './styles/theme.css';

export default function App() {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]); // [{user: '', skaila: ''}]
  const [loading, setLoading] = useState(false);
  const chatBoxRef = useRef(null);
  const { isDarkMode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function query(data) {
    const response = await fetch(
       `${process.env.REACT_APP_API_URL}/ask`,
      //"https://raihan.soljum.com/api/v1/prediction/bb31b748-3d0d-44a3-8e65-8cc5619bac39",
      // "http://localhost:3000/api/v1/prediction/a7da07f2-0d4d-4836-a134-01503ba75fde",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }
    );
    const result = await response.json();
    return result;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    // Tambahkan pertanyaan user ke chatHistory, respons PesonaAI menyusul
    setChatHistory(prev => [...prev, { user: question, pesonaAI: null }]);
    try {
      const res = await query({ question });
      setChatHistory(prev => {
        // Update respons PesonaAI pada chat terakhir
        const updated = [...prev];
        updated[updated.length - 1] = { ...updated[updated.length - 1], pesonaAI: res.text || JSON.stringify(res) };
        return updated;
      });
      setQuestion(""); // reset input setelah respons
    } catch (err) {
      setChatHistory(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...updated[updated.length - 1], pesonaAI: "Terjadi kesalahan. Silakan coba lagi." };
        return updated;
      });
      setQuestion("");
    }
    setLoading(false);
  };

  // Scroll ke bawah setiap ada respons baru
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory, loading]);

  // Placeholder dinamis
  const placeholder = chatHistory.length === 0 && !loading
    ? "Tanyakan pada PesonaAI!"
    : "";

  const showHeading = chatHistory.length === 0 && !loading;

  return (
    <div className={`min-h-screen w-full flex flex-col relative overflow-hidden transition-colors duration-300 ${
      isDarkMode ? 'bg-dark-main' : 'bg-gray-50'
    }`}>
      {/* Vignette effect */}
      <div className={`pointer-events-none absolute inset-0 z-0 ${isDarkMode ? 'vignette-dark' : 'vignette-light'}`} />
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between w-full px-4 md:px-12 pt-6 md:pt-10">
        <Logo />
        {/* Desktop actions */}
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Profile"
            className={`w-9 h-9 rounded-full object-cover border-2 shadow transition-colors duration-200 ${
              isDarkMode ? 'border-white' : 'border-gray-800'
            }`}
          />
        </div>
        {/* Mobile hamburger */}
        <button
          className="md:hidden flex items-center justify-center ml-2 rounded-full p-2 bg-white/10 hover:bg-white/20 text-white"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </header>
      
      {/* Chat History Container - Fixed height with scroll */}
      <div className="flex-1 flex flex-col relative z-10 px-4 md:px-8 lg:px-12 pt-6 overflow-y-auto" style={{maxHeight: 'calc(100vh - 120px)'}}>
        {(chatHistory.length > 0 || loading) && (
          <div className="flex-1 flex flex-col justify-end mb-4">
            <div
              ref={chatBoxRef}
              className={`w-full max-w-4xl mx-auto text-lg flex flex-col gap-3 overflow-y-auto ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}
              style={{ 
                minHeight: '200px',
                scrollbarWidth: 'thin',
                msOverflowStyle: 'none'
              }}
            >
              {chatHistory.map((chat, idx) => (
                <React.Fragment key={idx}>
                  {/* User chat kanan */}
                  <div className="flex justify-end">
                    <div className={`${isDarkMode ? 'bg-[#40414f] text-white' : 'bg-blue-500/80 text-white'} rounded-xl px-4 py-3 max-w-[80%] text-right shadow break-words whitespace-pre-wrap`}>
                      {chat.user}
                    </div>
                  </div>
                  {/* PesonaAI chat kiri */}
                  {chat.pesonaAI && (
                    <div className="flex justify-start">
                      <div className={`backdrop-blur-sm rounded-xl px-4 py-3 max-w-[80%] text-left shadow-sm break-words whitespace-pre-wrap leading-relaxed ${
                        isDarkMode 
                          ? 'bg-[#40414f] text-white' 
                          : 'bg-gray-800/10 text-gray-800'
                      }`}>
                        <div className="space-y-2">
                          {chat.pesonaAI.split('\n').map((paragraph, pIdx) => (
                            <p key={pIdx} className={pIdx > 0 ? 'mt-3' : ''}>
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className={`backdrop-blur-sm italic rounded-xl px-4 py-3 max-w-[80%] shadow-sm ${
                    isDarkMode 
                      ? 'bg-[#40414f] text-white/80' 
                      : 'bg-gray-800/10 text-gray-600'
                  }`}>
                    hmm.. <span className="inline-block animate-bounce">🤔</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Fixed Input Container at Bottom - only show when there's chat history */}
      {(chatHistory.length > 0 || loading) && (
        <div className="w-full max-w-4xl mx-auto pb-6 sticky bottom-0 bg-transparent z-20">
          <form className="w-full flex items-center justify-center" onSubmit={handleSubmit}>
            <div className="flex items-center w-full bg-white rounded-[50px] shadow-md focus-within:ring-2 focus-within:ring-white/20 pr-4">
              <textarea
                placeholder={placeholder}
                className="flex-1 min-h-[48px] md:min-h-[56px] max-h-32 pl-6 py-3 text-gray-600 placeholder:text-gray-400 bg-transparent border-0 rounded-[50px] text-lg resize-none overflow-hidden focus:outline-none"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                disabled={loading}
                autoFocus
                rows={1}
              />
              <button
                type="submit"
                className="ml-2 h-10 w-10 rounded-full border border-gray-300 flex items-center justify-center bg-white hover:bg-gray-100 transition-colors duration-150"
                disabled={loading}
                style={{ borderWidth: 2 }}
              >
                <SendHorizonal className="h-5 w-5 text-[#2563eb]" />
                <span className="sr-only">Send</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
