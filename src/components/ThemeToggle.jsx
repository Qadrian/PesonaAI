import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div
      className={`relative flex items-center w-14 h-8 cursor-pointer select-none transition-all`}
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDarkMode}
      tabIndex={0}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && toggleTheme()}
    >
      {/* Track */}
      <div
        className={`absolute left-0 top-0 w-14 h-8 rounded-full transition-colors duration-300 ${
          isDarkMode ? 'bg-[#0d1a2f]' : 'bg-[#ede9fe]'
        }`}
      />
      {/* Thumb */}
      <div
        className={`z-10 flex items-center justify-center w-8 h-8 rounded-full shadow transition-all duration-300 transform ${
          isDarkMode
            ? 'translate-x-0 bg-[#0d1a2f] text-white'
            : 'translate-x-6 bg-white text-[#7c3aed] border border-[#ede9fe]'
        }`}
      >
        {isDarkMode ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </div>
    </div>
  );
} 