import { useEffect, useRef, useState } from 'react';
import { apiFetch } from '../api/api';

export default function ChatBox({ topic }) {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState('');
  const chatRef = useRef();

  useEffect(() => {
    if (topic) {
      apiFetch(`/chats/${topic.id}`).then(setChats);
    }
  }, [topic]);

  const sendMessage = async e => {
    e.preventDefault();
    if (!message) return;
    await apiFetch(`/chats/${topic.id}`, { method: 'POST', body: JSON.stringify({ sender: 'user', message }) });
    setChats([...chats, { sender: 'user', message }]);
    setMessage('');
    // Simulasi balasan bot
    setTimeout(() => {
      setChats(c => [...c, { sender: 'bot', message: 'Bot response...' }]);
    }, 1000);
  };

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chats]);

  if (!topic) return <div className="flex-1 flex items-center justify-center text-gray-400">Pilih topik untuk mulai chat</div>;

  return (
    <div className="flex-1 flex flex-col">
      <div ref={chatRef} className="flex-1 overflow-y-auto p-4">
        {chats.map((c, i) => (
          <div key={i} className={`mb-2 ${c.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block px-3 py-2 rounded ${c.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>{c.message}</span>
          </div>
        ))}
      </div>
      <form className="flex p-4 border-t" onSubmit={sendMessage}>
        <input className="flex-1 p-2 rounded border" value={message} onChange={e => setMessage(e.target.value)} placeholder="Type a message..." />
        <button className="ml-2 bg-blue-600 text-white px-4 py-2 rounded" type="submit">Send</button>
      </form>
    </div>
  );
} 