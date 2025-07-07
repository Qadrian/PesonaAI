import { useState } from 'react';
import { apiFetch } from '../api/api';
import { useAuth } from '../contexts/AuthContext';
import Toast from './Toast';

export default function ProfileForm({ onClose }) {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState(null);

  const handleUpdate = async e => {
    e.preventDefault();
    try {
      await apiFetch('/auth/profile', { method: 'PUT', body: JSON.stringify({ name, email, password: password || undefined }) });
      setToast({ message: 'Profile updated', type: 'success' });
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account?')) return;
    await apiFetch('/auth/profile', { method: 'DELETE' });
    logout();
  };

  return (
    <form onSubmit={handleUpdate} className="max-w-sm mx-auto mt-16 p-6 bg-white rounded shadow">
      <h2 className="text-2xl mb-4">Profile</h2>
      <input className="w-full mb-2 p-2 border rounded" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input className="w-full mb-2 p-2 border rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="w-full mb-4 p-2 border rounded" type="password" placeholder="New Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="w-full bg-blue-600 text-white py-2 rounded" type="submit">Update</button>
      <button className="w-full bg-red-600 text-white py-2 rounded mt-2" type="button" onClick={handleDelete}>Delete Account</button>
      <button className="w-full bg-gray-400 text-white py-2 rounded mt-2" type="button" onClick={onClose}>Close</button>
      <Toast {...toast} onClose={() => setToast(null)} />
    </form>
  );
} 