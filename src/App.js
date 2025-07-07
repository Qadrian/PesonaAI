import React, { useState, useRef, useEffect } from "react";
import Logo from "./components/Logo"
import { Button } from "./components/ui/button"
import { Send, ArrowUp } from "lucide-react"
import { useTheme } from "./contexts/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";
import MobileSidebar from "./components/MobileSidebar";
import './styles/theme.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Sidebar from './components/Sidebar';
import ChatBox from './components/ChatBox';
import ProfileForm from './components/ProfileForm';

function MainApp() {
  const { user, logout } = useAuth();
  const [showSignup, setShowSignup] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);

  if (!user) {
    return showSignup
      ? <SignupForm onSwitch={() => setShowSignup(false)} />
      : <LoginForm onSwitch={() => setShowSignup(true)} />;
  }

  return (
    <div className="flex h-screen">
      <Sidebar
        onSelectTopic={setSelectedTopic}
        selectedTopicId={selectedTopic?.id}
        onLogout={logout}
        onProfile={() => setShowProfile(true)}
      />
      <div className="flex-1 flex flex-col">
        {showProfile
          ? <ProfileForm onClose={() => setShowProfile(false)} />
          : <ChatBox topic={selectedTopic} />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
