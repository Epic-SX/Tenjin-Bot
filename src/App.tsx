import React, { useMemo, useRef, useState } from 'react';
import { initialMessages, initialQuestions } from './data';
import type { Message } from './types';
import SidebarLeft from './components/SidebarLeft';
import ChatArea from './components/ChatArea';
import SidebarRight from './components/SidebarRight';
import PinBoard from './components/PinBoard';
import './styles.css';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(
    initialMessages.map((m) => ({ ...m, pinned: false, expanded: false }))
  );
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const centerScroll = useRef<HTMLDivElement>(null);

  const byId = useMemo(() => new Map(messages.map(m => [m.id, m])), [messages]);

  const jumpToMessage = (id: string) => {
    // crude jump by scrolling to element index
    const idx = messages.findIndex((m) => m.id === id);
    const el = document.querySelectorAll('.msg-row')[idx] as HTMLElement | undefined;
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const quoteSelection = (text: string) => {
    alert(`Create a follow-up question about:\n\n“${text}”`);
  };

  return (
    <div className={`app ${leftCollapsed ? 'left-collapsed' : ''}`}>
      <SidebarLeft
        items={initialQuestions}
        collapsed={leftCollapsed}
        onCollapseToggle={() => setLeftCollapsed((v) => !v)}
        onOpenMessage={jumpToMessage}
      />

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

export default App;
