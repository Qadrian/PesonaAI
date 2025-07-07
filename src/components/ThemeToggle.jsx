import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className={`rounded-full p-2 transition-all duration-200 ${
        isDarkMode 
          ? 'bg-white/10 text-white border-white/20 hover:bg-white/20' 
          : 'bg-gray-800/10 text-gray-800 border-gray-800/20 hover:bg-gray-800/20'
      }`}
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDarkMode ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
} 