import { useEffect, useState } from 'react';
import { apiFetch } from '../api/api';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar({ onSelectTopic, selectedTopicId, onLogout, onProfile }) {
  const { user } = useAuth();
  const [topics, setTopics] = useState([]);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    apiFetch('/topics').then(setTopics).catch(() => {});
  }, [user]);

  const addTopic = async () => {
    if (!newTitle) return;
    const topic = await apiFetch('/topics', { method: 'POST', body: JSON.stringify({ title: newTitle }) });
    setTopics([topic, ...topics]);
    setNewTitle('');
  };

  return (
    <aside className="w-64 bg-gray-900 text-white h-full flex flex-col p-4">
      <div className="mb-4 font-bold text-xl">Hi, {user.name}</div>
      <div className="flex mb-4">
        <input className="flex-1 p-2 rounded text-black" placeholder="New topic" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
        <button className="ml-2 bg-blue-600 px-3 py-1 rounded" onClick={addTopic}>Add</button>
      </div>
      <ul className="flex-1 overflow-y-auto">
        {topics.map(t => (
          <li key={t.id} className={`p-2 rounded cursor-pointer ${selectedTopicId === t.id ? 'bg-blue-700' : 'hover:bg-gray-700'}`} onClick={() => onSelectTopic(t)}>
            {t.title}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-col gap-2">
        <button className="bg-gray-700 py-2 rounded" onClick={onProfile}>Profile</button>
        <button className="bg-red-600 py-2 rounded" onClick={onLogout}>Logout</button>
      </div>
    </aside>
  );
} 