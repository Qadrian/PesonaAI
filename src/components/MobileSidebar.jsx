import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import { Button } from './ui/button';
import { X } from 'lucide-react';

export default function MobileSidebar({ open, onClose }) {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${open ? 'visible' : 'invisible'}`}
      style={{ pointerEvents: open ? 'auto' : 'none' }}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      {/* Sidebar */}
      <aside
        className={`absolute right-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg p-6 flex flex-col gap-6 transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ color: isDarkMode ? 'white' : '#1f2937' }}
      >
        <div className="flex justify-end">
          <button onClick={onClose} aria-label="Close sidebar">
            <X className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} />
          </button>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <ThemeToggle />
          <a href="https://qadrian.com/" target="_blank" rel="noopener noreferrer">
            <Button className="w-full">About Us</Button>
          </a>
          <div className="flex items-center gap-3 mt-8">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 dark:border-white shadow"
            />
            <div>
              <div className="font-semibold">User</div>
              <div className="text-xs text-gray-500 dark:text-gray-300">user@email.com</div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
} 