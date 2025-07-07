import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function Logo() {
  const { isDarkMode } = useTheme();
  
  return (
    <div 
      className="font-bold text-2xl"
      style={{
        fontFamily: 'Poppins, Montserrat, Arial, sans-serif',
        fontWeight: 700,
        color: isDarkMode ? 'white' : '#1f2937'
      }}
    >
      PesonaAI
    </div>
  )
} 