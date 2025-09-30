import React, { useMemo, useRef, useState } from 'react';
import type { Message } from '../types';
import { CaretDown, Dots, Pin } from './Icons';

interface Props {
  message: Message;
  indexNumber: number; // show 8., 9., ...
  onToggleExpand: (id: string) => void;
  onTogglePin: (id: string) => void;
  onCopy: (id: string) => void;
  onReply: (id: string) => void;
  onShare: (id: string) => void;
}

const MessageBubble: React.FC<Props> = ({
  message, indexNumber, onToggleExpand, onTogglePin, onCopy, onReply, onShare
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isAI = message.author === 'ai';
  const badge = useMemo(() => `${indexNumber}.`, [indexNumber]);

  return (
    <div className="msg-row" ref={containerRef}>
      <div className="msg-index">{badge}</div>

      <div className={`bubble ${isAI ? 'ai' : 'user'} ${message.expanded ? 'expanded' : 'clamped'}`}>
        <div className="bubble-header">
          {/* expand caret only when clamped */}
          <button className="icon-btn caret" onClick={() => onToggleExpand(message.id)} title="Expand/Collapse">
            <CaretDown className={`caret-icon ${message.expanded ? 'rotated' : ''}`} />
          </button>
          <div className="spacer" />
          <button
            className={`icon-btn pin ${message.pinned ? 'active' : ''}`}
            onClick={() => onTogglePin(message.id)}
            title={message.pinned ? 'Unpin' : 'Pin'}
          >
            <Pin filled={message.pinned} />
          </button>
          <button className="icon-btn" onClick={() => setMenuOpen((v) => !v)} title="More">
            <Dots />
          </button>
          {menuOpen && (
            <div className="menu" onMouseLeave={() => setMenuOpen(false)}>
              <button onClick={() => { onReply(message.id); setMenuOpen(false); }}>Reply</button>
              <button onClick={() => { onShare(message.id); setMenuOpen(false); }}>Share</button>
              <button onClick={() => { onCopy(message.id); setMenuOpen(false); }}>Copy</button>
              <button onClick={() => { onTogglePin(message.id); setMenuOpen(false); }}>
                {message.pinned ? 'Unpin' : 'Pin'}
              </button>
            </div>
          )}
        </div>

        <div className="bubble-text">{message.text}</div>
      </div>
      <div className="msg-ellipsis">…</div>
    </div>
  );
};

export default MessageBubble;
