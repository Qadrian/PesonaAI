import { useState } from 'react';
import { apiFetch } from '../api/api';
import { useAuth } from '../contexts/AuthContext';
import Toast from './Toast';

export default function SignupForm({ onSwitch }) {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { user, token } = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      login(user, token);
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-16 p-6 bg-white rounded shadow">
      <h2 className="text-2xl mb-4">Sign Up</h2>
      <input className="w-full mb-2 p-2 border rounded" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input className="w-full mb-2 p-2 border rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="w-full mb-4 p-2 border rounded" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="w-full bg-blue-600 text-white py-2 rounded" type="submit">Sign Up</button>
      <div className="mt-4 text-center">
        Sudah punya akun? <button type="button" className="text-blue-600 underline" onClick={onSwitch}>Login</button>
      </div>
      <Toast {...toast} onClose={() => setToast(null)} />
    </form>
  );
} 