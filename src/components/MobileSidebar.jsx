import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import '../styles/theme.css';

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
        className={`absolute right-0 top-0 h-full w-64 shadow-lg p-6 flex flex-col gap-6 transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'} ${isDarkMode ? 'bg-dark-sidebar' : ''}`}
        style={{
          background: isDarkMode ? undefined : '#fff',
          color: isDarkMode ? 'white' : '#1f2937',
        }}
      >
        <div className="flex justify-end">
          <button onClick={onClose} aria-label="Close sidebar">
            <X className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} />
          </button>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <ThemeToggle />
          <Button
            className={`w-full mt-8 px-0 py-2 rounded-md font-semibold shadow-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#232325] text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-[#333] transition-colors duration-200`}
            style={{ borderRadius: '8px' }}
          >
            Login
          </Button>
        </div>
      </aside>
    </div>
  );
} 