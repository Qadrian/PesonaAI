import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Settings } from 'lucide-react';
import '../styles/theme.css';

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div
      className="flex items-center cursor-pointer select-none"
      onClick={toggleTheme}
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      style={{ minWidth: 48 }}
    >
      {/* Track */}
      <div
        className={`w-12 h-7 rounded-full flex items-center transition-colors duration-200 px-1 ${
          isDarkMode ? 'bg-[#23304d]' : 'bg-[#ede9fe]'
        }`}
      >
        {/* Thumb */}
        <div
          className={`w-7 h-7 rounded-full shadow flex items-center justify-center transition-all duration-200 ${
            isDarkMode
              ? 'translate-x-0 bg-[#0d1a2f] text-white'
              : 'translate-x-5 bg-white text-[#7c3aed]'
          }`}
          style={{ position: 'relative', zIndex: 2 }}
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Settings className="w-5 h-5" />
          )}
        </div>
      </div>
    </div>
  );
} 