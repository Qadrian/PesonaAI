import { useState } from 'react';

export default function Toast({ message, type = 'info', onClose }) {
  if (!message) return null;
  return (
    <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg ${type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
      {message}
      <button className="ml-4" onClick={onClose}>✕</button>
    </div>
  );
} 