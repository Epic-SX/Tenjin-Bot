import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Message } from '../types';
import MessageBubble from './MessageBubble';
import { HiOutlineMicrophone } from "react-icons/hi2";
import { CgAttachment } from "react-icons/cg";
import { GoPlus } from "react-icons/go";
import { AiOutlineSend } from "react-icons/ai";

interface Props {
  messages: Message[];
  setMessages: (updater: (prev: Message[]) => Message[]) => void;
  onPinBoardOpen: () => void;
  onQuoteFromSelection: (selection: string) => void;
  onJump: (messageId: string) => void;   // <-- NEW
}

const ChatArea: React.FC<Props> = ({ messages, setMessages, onPinBoardOpen, onQuoteFromSelection, onJump }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectionInfo, setSelectionInfo] = useState<{ text: string; x: number; y: number } | null>(null);

  const indexed = useMemo(() => messages.map((m, i) => ({ ...m, number: 8 + i })), [messages]);

  const toggleExpand = (id: string) => {
    setMessages((prev) => prev.map(m => m.id === id ? { ...m, expanded: !m.expanded } : m));
  };
  const togglePin = (id: string) => {
    setMessages((prev) => prev.map(m => m.id === id ? { ...m, pinned: !m.pinned } : m));
  };
  const copy = async (id: string) => {
    const msg = messages.find(m => m.id === id);
    if (!msg) return;
    try { await navigator.clipboard.writeText(msg.text); } catch {}
  };
  const reply = (id: string) => {
    const msg = messages.find(m => m.id === id);
    if (!msg) return;
    alert(`Replying to #${indexed.find(x => x.id === id)?.number}\n\n"${msg.text}"`);
  };
  const share = (id: string) => {
    const msg = messages.find(m => m.id === id);
    if (!msg) return;
    if (navigator.share) navigator.share({ text: msg.text }).catch(() => {});
    else alert('Web Share API not available.');
  };

  // Selection popover
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const onMouseUp = () => {
      const sel = window.getSelection();
      const text = sel?.toString()?.trim();
      if (text) {
        const range = sel!.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const rootRect = root.getBoundingClientRect();
        setSelectionInfo({ text, x: rect.left - rootRect.left + rect.width / 2, y: rect.top - rootRect.top });
      } else {
        setSelectionInfo(null);
      }
    };
    root.addEventListener('mouseup', onMouseUp);
    return () => root.removeEventListener('mouseup', onMouseUp);
  }, []);

  return (
    <div className="chat-root">
      <div className="chat-header">
        <div className="chat-title">TENJIN</div>       
      </div>

      <div className="chat-scroll" ref={scrollRef}>
        {indexed.map((m) => (
          <MessageBubble
            key={m.id}
            message={m}
            indexNumber={m.number}
            onToggleExpand={toggleExpand}
            onTogglePin={togglePin}
            onCopy={copy}
            onReply={reply}
            onShare={share}
          />
        ))}
      </div>

      <div className="chat-input">
        <div className="input-left">
          <button className="circle-btn" title="Attach"><CgAttachment /></button>
          <button className="circle-btn" title="Voice"><HiOutlineMicrophone /></button>
        </div>
        <div className="text-input-wrapper">
          <button 
            className="input-icon-btn" 
            title="More"
            onMouseDown={(e) => e.preventDefault()}
          >
            <GoPlus />
          </button>
          <input className="text-input" placeholder="Type your message…" />
          <button 
            className="send-btn" 
            title="Send"
            onMouseDown={(e) => e.preventDefault()}
          >
            <AiOutlineSend />
          </button>
        </div>
      </div>

      {selectionInfo && (
        <div className="selection-popover" style={{ left: selectionInfo.x, top: selectionInfo.y }}>
          <button
            className="selection-action"
            onClick={() => {
              onQuoteFromSelection(selectionInfo.text);
              setSelectionInfo(null);
            }}
          >
            Ask about selection
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatArea;
