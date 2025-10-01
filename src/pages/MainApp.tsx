import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initialMessages, initialQuestions } from '../data';
import type { Message } from '../types';
import SidebarLeft from '../components/SidebarLeft';
import SidebarChatbot from '../components/SidebarChatbot';
import ChatArea from '../components/ChatArea';
import SidebarRight from '../components/SidebarRight';
import PinBoard from '../components/PinBoard';

const MainApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(
    initialMessages.map((m) => ({ ...m, pinned: false, expanded: false }))
  );
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const navigate = useNavigate();

  const jumpToMessage = (id: string) => {
    // crude jump by scrolling to element index
    const idx = messages.findIndex((m) => m.id === id);
    const el = document.querySelectorAll('.msg-row')[idx] as HTMLElement | undefined;
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const quoteSelection = (text: string) => {
    alert(`Create a follow-up question about:\n\n"${text}"`);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div className={`app ${leftCollapsed ? 'left-collapsed' : ''}`}>
      <button className="logout-button" onClick={handleLogout} title="Logout">
        Logout
      </button>

      <SidebarLeft
        items={initialQuestions}
        collapsed={leftCollapsed}
        onCollapseToggle={() => setLeftCollapsed((v) => !v)}
        onOpenMessage={jumpToMessage}
      />

      <SidebarChatbot messages={messages} onJump={jumpToMessage} />

      <ChatArea
        messages={messages}
        setMessages={(u) => setMessages((prev) => u(prev))}
        onPinBoardOpen={() => setPinOpen(true)}
        onQuoteFromSelection={quoteSelection}
        onJump={jumpToMessage}           
      />

      <SidebarRight messages={messages} onJump={jumpToMessage} />

      <PinBoard open={pinOpen} onClose={() => setPinOpen(false)} messages={messages} onJump={jumpToMessage} />
    </div>
  );
};

export default MainApp;

