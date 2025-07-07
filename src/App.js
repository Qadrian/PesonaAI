import React, { useState, useRef, useEffect } from "react";
import Logo from "./components/Logo"
import { Button } from "./components/ui/button"
import { Send } from "lucide-react"

export default function App() {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]); // [{user: '', skaila: ''}]
  const [loading, setLoading] = useState(false);
  const chatBoxRef = useRef(null);

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
    // Tambahkan pertanyaan user ke chatHistory, respons Skaila menyusul
    setChatHistory(prev => [...prev, { user: question, skaila: null }]);
    try {
      const res = await query({ question });
      setChatHistory(prev => {
        // Update respons Skaila pada chat terakhir
        const updated = [...prev];
        updated[updated.length - 1] = { ...updated[updated.length - 1], skaila: res.text || JSON.stringify(res) };
        return updated;
      });
      setQuestion(""); // reset input setelah respons
    } catch (err) {
      setChatHistory(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...updated[updated.length - 1], skaila: "Terjadi kesalahan. Silakan coba lagi." };
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
    ? "Tanyakan pada Skaila!"
    : "";

  const showHeading = chatHistory.length === 0 && !loading;

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-[#15305c] via-[#18376b] to-[#0e2148] relative overflow-hidden">
      {/* Vignette effect */}
      <div className="pointer-events-none absolute inset-0 z-0" style={{background: "radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, rgba(14,33,72,0.95) 70%)"}} />
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between w-full px-12 pt-10">
        <Logo />
        <div className="flex items-center space-x-4">
          <a
            href="https://www.aeccglobal.co.id"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              className="bg-white text-[#0e2148] border-white hover:bg-white/90 rounded-full px-6 font-semibold shadow"
            >
              About Us
            </Button>
          </a>
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Profile"
            className="w-9 h-9 rounded-full object-cover border-2 border-white shadow"
          />
        </div>
      </header>
      
      {/* Fixed Chat Container */}
      <div className="flex-1 flex flex-col relative z-10 px-4 md:px-8 lg:px-12">
        {/* Welcome Message - only show when no chat history */}
          {showHeading && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-center mb-8">
              <span className="text-white font-normal">Halo </span>
              <span className="font-extrabold bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 bg-clip-text text-transparent">Masyarakat!</span>
            </h1>
                         {/* Input positioned below welcome text when no chat */}
             <div className="w-full max-w-4xl">
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
                   <Button
                     size="sm"
                     type="submit"
                     className="ml-2 h-9 w-9 md:h-10 md:w-10 rounded-full bg-white hover:bg-white/90 p-0 flex items-center justify-center shadow"
                     disabled={loading}
                   >
                     <Send className="h-4 w-4 text-[#0e2148]" />
                     <span className="sr-only">Send</span>
                   </Button>
                 </div>
               </form>
             </div>
          </div>
        )}
        
        {/* Chat History Container - Fixed height with scroll */}
          {(chatHistory.length > 0 || loading) && (
          <div className="flex-1 flex flex-col justify-end mb-4">
            <div
              ref={chatBoxRef}
              className="w-full max-w-4xl mx-auto text-white text-lg flex flex-col gap-3 overflow-y-auto"
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
                  <div className="flex justify-end">
                    <div className="bg-blue-500/80 text-white rounded-xl px-4 py-3 max-w-[80%] text-right shadow break-words whitespace-pre-wrap">
                      {chat.user}
                    </div>
                  </div>
                  {/* Skaila chat kiri */}
                  {chat.skaila && (
                    <div className="flex justify-start">
                      <div className="bg-white/10 backdrop-blur-sm text-white rounded-xl px-4 py-3 max-w-[80%] text-left shadow-sm break-words whitespace-pre-wrap leading-relaxed">
                        <div className="space-y-2">
                          {chat.skaila.split('\n').map((paragraph, pIdx) => (
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
                  <div className="bg-white/10 backdrop-blur-sm italic text-white/80 rounded-xl px-4 py-3 max-w-[80%] shadow-sm">
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
            <Button
              size="sm"
              type="submit"
                  className="ml-2 h-9 w-9 md:h-10 md:w-10 rounded-full bg-white hover:bg-white/90 p-0 flex items-center justify-center shadow"
              disabled={loading}
            >
              <Send className="h-4 w-4 text-[#0e2148]" />
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
