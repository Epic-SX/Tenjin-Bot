import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initialMessages, initialQuestions } from '../data';
import type { Message, QuestionItem } from '../types';
import SidebarLeft from '../components/SidebarLeft';
import SidebarChatbot from '../components/SidebarChatbot';
import ChatArea from '../components/ChatArea';
import SidebarRight from '../components/SidebarRight';
import PinBoard from '../components/PinBoard';
import { logout } from '../services/api';

const MainApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(
    initialMessages.map((m) => ({ ...m, pinned: false, expanded: false }))
  );
  const [questions, setQuestions] = useState<QuestionItem[]>(initialQuestions);
  const [folders, setFolders] = useState<string[]>(['General', 'Follow-ups', 'Notes']);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isNewChatMode, setIsNewChatMode] = useState(true);
  const [activeFolder, setActiveFolder] = useState<string>('General');
  const navigate = useNavigate();

  const displayedMessages = isNewChatMode
    ? []
    : currentConversationId
    ? messages.filter((m) => m.conversationId === currentConversationId)
    : messages;

  const jumpToMessage = (id: string) => {
    const idx = messages.findIndex((m) => m.id === id);
    const el = document.querySelectorAll('.msg-row')[idx] as HTMLElement | undefined;
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const quoteSelection = (text: string) => {
    alert(`Create a follow-up question about:\n\n"${text}"`);
  };

  const handleNewQuestionAnswer = (userMessageId: string, questionText: string): string => {
    setIsNewChatMode(false);
    
    if (currentConversationId) {
      return currentConversationId;
    }

    const newQuestionId = `q${Date.now()}`;
    const newQuestion: QuestionItem = {
      id: newQuestionId,
      title: questionText.slice(0, 80) + (questionText.length > 80 ? '...' : ''),
      folder: activeFolder,
      messageId: userMessageId
    };
    
    setQuestions((prev) => [...prev, newQuestion]);
    setCurrentConversationId(newQuestionId);
    
    return newQuestionId;
  };

  const handleNewChat = () => {
    setCurrentConversationId(null);
    setIsNewChatMode(true);
  };

  const handleSelectMessage = (messageId: string) => {
    setIsNewChatMode(false);
    
    const conversation = questions.find((q) => q.messageId === messageId);
    if (conversation) {
      setCurrentConversationId(conversation.id);
      if (conversation.folder) {
        setActiveFolder(conversation.folder);
      }
    }
  };

  const handleCreateProject = (projectName: string) => {
    if (!folders.includes(projectName)) {
      setFolders((prev) => [...prev, projectName]);
    }
    
    setActiveFolder(projectName);
    handleNewChat();
  };

  const handleRenameQuestion = (questionId: string, newTitle: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, title: newTitle } : q))
    );
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
    if (currentConversationId === questionId) {
      setCurrentConversationId(null);
    }
  };

  const handleLogout = () => {
    logout(); // Clear auth and session data
    navigate('/login');
  };

  return (
    <div className={`app ${leftCollapsed ? 'left-collapsed' : ''}`}>
      <button className="logout-button" onClick={handleLogout} title="Logout">
        Logout
      </button>

      <SidebarLeft
        items={questions}
        collapsed={leftCollapsed}
        onCollapseToggle={() => setLeftCollapsed((v) => !v)}
        onOpenMessage={handleSelectMessage}
        onNewChat={handleNewChat}
        onCreateProject={handleCreateProject}
        onRenameQuestion={handleRenameQuestion}
        onDeleteQuestion={handleDeleteQuestion}
        folders={folders}
      />

      <SidebarChatbot messages={displayedMessages} onJump={jumpToMessage} />

      <ChatArea
        messages={displayedMessages}
        setMessages={(u) => setMessages((prev) => u(prev))}
        onPinBoardOpen={() => setPinOpen(true)}
        onQuoteFromSelection={quoteSelection}
        onJump={jumpToMessage}
        onNewQuestionAnswer={handleNewQuestionAnswer}
        currentConversationId={currentConversationId}
      />

      <SidebarRight messages={displayedMessages} onJump={jumpToMessage} />

      <PinBoard open={pinOpen} onClose={() => setPinOpen(false)} messages={messages} onJump={jumpToMessage} />
    </div>
  );
};

export default MainApp;
