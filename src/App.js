import React, { useState, useRef, useEffect } from "react";
import Logo from "./components/Logo"
import { Button } from "./components/ui/button"
import { Send, ArrowUp } from "lucide-react"
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
  const [typedHeading, setTypedHeading] = useState("");
  const fullHeading = "Meet PesonaAI!";
  const [showSubtext, setShowSubtext] = useState(false);

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

  // Typing effect for heading
  useEffect(() => {
    if (showHeading) {
      setTypedHeading("");
      setShowSubtext(false);
      let i = 0;
      const interval = setInterval(() => {
        setTypedHeading(fullHeading.slice(0, i + 1));
        i++;
        if (i === fullHeading.length) {
          clearInterval(interval);
          setTimeout(() => setShowSubtext(true), 400);
        }
      }, 70);
      return () => clearInterval(interval);
    }
  }, [showHeading]);

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
          <Button
            className={`px-6 py-2 rounded-md font-semibold shadow-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#232325] text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-[#333] transition-colors duration-200`}
            style={{ borderRadius: '8px' }}
          >
            Login
          </Button>
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
      
      {/* Fixed Chat Container */}
      <div className="flex-1 flex flex-col relative z-10 px-4 md:px-8 lg:px-12">
        {/* Welcome Message - only show when no chat history */}
          {showHeading && (
          <div className="flex flex-col items-center justify-start pt-16 md:pt-24">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-center mb-2 select-none">
              <span className={`font-normal ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{typedHeading.replace(/PesonaAI!?$/, "")}</span>
              <span className="font-extrabold text-gradient-blue">{typedHeading.endsWith("PesonaAI!") || typedHeading.endsWith("PesonaAI") ? "PesonaAI" : ""}</span>
            </h1>
            {showSubtext && (
              <div className={`text-base md:text-lg mt-2 mb-8 text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                style={{ transition: 'color 0.3s' }}>
                More than just an AI agent, it's your personal assistant
              </div>
            )}
            {/* Input positioned below welcome text when no chat */}
            <div className="w-full max-w-4xl mt-6">
              <form className="w-full flex items-center justify-center" onSubmit={handleSubmit}>
                <div className={`flex items-end w-full bg-white dark:bg-[#232325] rounded-2xl shadow-lg px-6 py-2 md:py-3 focus-within:ring-2 focus-within:ring-blue-400 transition-all duration-200 border border-gray-200 dark:border-[#333]`}>
                  <textarea
                    placeholder={placeholder}
                    className="flex-1 min-h-[44px] max-h-40 md:min-h-[56px] px-3 py-2 md:px-4 md:py-3 text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-transparent border-0 rounded-2xl text-base md:text-lg resize-none focus:outline-none scrollbar-hide"
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    onInput={e => {
                      e.target.style.height = 'auto';
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                    disabled={loading}
                    autoFocus
                    rows={1}
                    style={{overflowY: 'auto'}}
                  />
                  <Button
                    size="icon"
                    type="submit"
                    className={`ml-2 rounded-full h-11 w-11 flex items-center justify-center shadow-md transition-colors duration-200 border ${isDarkMode ? 'bg-[#232325] hover:bg-[#333] text-white border-white' : 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500'}`}
                    disabled={loading}
                  >
                    <ArrowUp className="h-5 w-5" />
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Chat History Container - Fixed height with scroll */}
          {(chatHistory.length > 0 || loading) && (
          <div className="flex-1 flex flex-col justify-start items-center mt-12 mb-4">
            <div
              ref={chatBoxRef}
              className={`w-full max-w-4xl mx-auto text-lg flex flex-col gap-3 overflow-y-auto ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}
              style={{ 
                maxHeight: 'calc(100vh - 200px)',
                minHeight: '200px',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {chatHistory.map((chat, idx) => (
                <React.Fragment key={idx}>
                  {/* User chat kanan */}
                  <div className="flex justify-end w-full">
                    <div className={`${isDarkMode ? 'bg-[#40414f] text-white' : 'bg-blue-500/80 text-white'} rounded-xl px-4 py-3 max-w-[80%] text-right shadow break-words whitespace-pre-wrap ml-auto`}>
                      {chat.user}
                    </div>
                  </div>
                  {/* PesonaAI chat kiri */}
                  {chat.pesonaAI && (
                    <div className="flex justify-start w-full">
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
                <div className="flex justify-start w-full">
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
        
        {/* Fixed Input Container at Bottom - only show when there's chat history */}
        {(chatHistory.length > 0 || loading) && (
          <div className="w-full max-w-4xl mx-auto pb-6">
            <form className="w-full flex items-center justify-center" onSubmit={handleSubmit}>
              <div className={`flex items-end w-full bg-white dark:bg-[#232325] rounded-2xl shadow-lg px-6 py-2 md:py-3 focus-within:ring-2 focus-within:ring-blue-400 transition-all duration-200 border border-gray-200 dark:border-[#333]`}>
                <textarea
                  placeholder={placeholder}
                  className="flex-1 min-h-[44px] max-h-40 md:min-h-[56px] px-3 py-2 md:px-4 md:py-3 text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-transparent border-0 rounded-2xl text-base md:text-lg resize-none focus:outline-none scrollbar-hide"
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  onInput={e => {
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  disabled={loading}
                  autoFocus
                  rows={1}
                  style={{overflowY: 'auto'}}
                />
                <Button
                  size="icon"
                  type="submit"
                  className={`ml-2 rounded-full h-11 w-11 flex items-center justify-center shadow-md transition-colors duration-200 border ${isDarkMode ? 'bg-[#232325] hover:bg-[#333] text-white border-white' : 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500'}`}
                  disabled={loading}
                >
                  <ArrowUp className="h-5 w-5" />
                  <span className="sr-only">Send</span>
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
