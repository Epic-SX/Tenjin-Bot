import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initialMessages, initialQuestions } from '../data';
import type { Message, QuestionItem } from '../types';
import SidebarLeft from '../components/SidebarLeft';
import SidebarChatbot from '../components/SidebarChatbot';
import ChatArea from '../components/ChatArea';
import SidebarRight from '../components/SidebarRight';
import PinBoard from '../components/PinBoard';

const MainApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(
    initialMessages.map((m) => ({ ...m, pinned: false, expanded: false }))
  );
  const [questions, setQuestions] = useState<QuestionItem[]>(initialQuestions);
  const [folders, setFolders] = useState<string[]>(['General', 'Follow-ups', 'Notes']);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isNewChatMode, setIsNewChatMode] = useState(true); // Start with blank chat area
  const [activeFolder, setActiveFolder] = useState<string>('General'); // Track the active folder for new conversations
  const navigate = useNavigate();

  // Filter messages based on selection
  const displayedMessages = isNewChatMode
    ? [] // Show empty chat area when in new chat mode
    : currentConversationId
    ? messages.filter((m) => m.conversationId === currentConversationId) // Show all messages in this conversation
    : messages;

  const jumpToMessage = (id: string) => {
    // crude jump by scrolling to element index
    const idx = messages.findIndex((m) => m.id === id);
    const el = document.querySelectorAll('.msg-row')[idx] as HTMLElement | undefined;
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const quoteSelection = (text: string) => {
    alert(`Create a follow-up question about:\n\n"${text}"`);
  };

  const handleNewQuestionAnswer = (userMessageId: string, questionText: string): string => {
    // Exit new chat mode and select this message to show only this conversation
    setIsNewChatMode(false);
    
    // If there's an active conversation, return the existing conversation ID
    if (currentConversationId) {
      return currentConversationId; // Already have a conversation item for this session
    }

    // Create a new question item and add it to the questions list
    const newQuestionId = `q${Date.now()}`;
    const newQuestion: QuestionItem = {
      id: newQuestionId,
      title: questionText.slice(0, 80) + (questionText.length > 80 ? '...' : ''),
      folder: activeFolder, // Use the active folder instead of hardcoded 'General'
      messageId: userMessageId
    };
    
    setQuestions((prev) => [...prev, newQuestion]);
    setCurrentConversationId(newQuestionId); // Mark this as the active conversation
    
    return newQuestionId;
  };

  const handleNewChat = () => {
    // Enter new chat mode - shows blank chat area but preserves all message history
    // Users can still access old messages via conversation selection
    setCurrentConversationId(null); // Reset conversation tracking so next question creates new item
    setIsNewChatMode(true); // Show empty chat area
  };

  const handleSelectMessage = (messageId: string) => {
    // Select message to show only this specific conversation
    setIsNewChatMode(false); // Exit new chat mode to show history
    
    // Find the conversation (question) that corresponds to this message
    const conversation = questions.find((q) => q.messageId === messageId);
    if (conversation) {
      // Set this as the active conversation so new messages are added to it
      setCurrentConversationId(conversation.id);
      // Also set the active folder to match this conversation's folder
      if (conversation.folder) {
        setActiveFolder(conversation.folder);
      }
    }
  };

  const handleCreateProject = (projectName: string) => {
    // Add the new project/folder to the folders list if it doesn't exist
    if (!folders.includes(projectName)) {
      setFolders((prev) => [...prev, projectName]);
    }
    
    // Set this as the active folder and start a new chat
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
    // If deleting the current conversation, reset it
    if (currentConversationId === questionId) {
      setCurrentConversationId(null);
    }
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

