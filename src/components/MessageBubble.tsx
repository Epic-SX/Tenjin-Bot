import React, { useMemo, useRef, useState } from 'react';
import type { Message } from '../types';
import { CaretDown, Dots, Pin } from './Icons';
import { GoReply } from "react-icons/go";
import { IoShareOutline, IoReload } from "react-icons/io5";
import { GoCopy } from "react-icons/go";
import { BsPin } from "react-icons/bs";

interface Props {
  message: Message;
  indexNumber: number; // show 8., 9., ...
  onToggleExpand: (id: string) => void;
  onTogglePin: (id: string) => void;
  onCopy: (id: string) => void;
  onReply: (id: string) => void;
  onShare: (id: string) => void;
  onRetry: (id: string) => void;
}

const MessageBubble: React.FC<Props> = ({
  message, indexNumber, onToggleExpand, onTogglePin, onCopy, onReply, onShare, onRetry
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isAI = message.author === 'ai';
  const badge = useMemo(() => `${indexNumber}.`, [indexNumber]);

  return (
    <div 
      className="msg-row" 
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="msg-index">{badge}</div>

      <div className={`bubble ${isAI ? 'ai' : 'user'} ${message.expanded ? 'expanded' : 'clamped'} ${message.hasError ? 'error' : ''}`}>
        <div className="bubble-header">
          {/* expand caret only when clamped */}
          <button className="icon-btn caret" onClick={() => onToggleExpand(message.id)} title="Expand/Collapse">
            <CaretDown className={`caret-icon ${message.expanded ? 'rotated' : ''}`} />
          </button>
          <div className="spacer" />
          {/* Show retry icon on hover for error messages */}
          {message.hasError && isHovered && (
            <button
              className="icon-btn retry"
              onClick={() => onRetry(message.id)}
              title="Retry"
            >
              <IoReload />
            </button>
          )}
          {message.pinned && (
            <button
              className="icon-btn pin active"
              onClick={() => onTogglePin(message.id)}
              title="Unpin"
            >
              <Pin filled={true} />
            </button>
          )}
          <button className="icon-btn" onClick={() => setMenuOpen((v) => !v)} title="More">
            <Dots />
          </button>
          {menuOpen && (
            <div className="menu" onMouseLeave={() => setMenuOpen(false)}>
              <button onClick={() => { onReply(message.id); setMenuOpen(false); }} title="Reply">
                <GoReply />
              </button>
              <button onClick={() => { onShare(message.id); setMenuOpen(false); }} title="Share">
                <IoShareOutline />
              </button>
              <button onClick={() => { onCopy(message.id); setMenuOpen(false); }} title="Copy">
                <GoCopy />
              </button>
              <button onClick={() => { onTogglePin(message.id); setMenuOpen(false); }} title={message.pinned ? 'Unpin' : 'Pin'}>
                <BsPin />
              </button>
            </div>
          )}
        </div>

        <div className="bubble-text">{message.text}</div>
      </div>
      
    </div>
  );
};

export default MessageBubble;
