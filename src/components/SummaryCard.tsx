import React, { useMemo } from 'react';
import type { Message } from '../types';

type Props = {
  messages: Message[];
  onJump: (messageId: string) => void;
};

const SummaryCard: React.FC<Props> = ({ messages, onJump }) => {
  const aiList = useMemo(
    () => messages
      .map((m, i) => ({ ...m, number: 8 + i }))
      .filter((m) => m.author === 'ai'),
    [messages]
  );

  if (aiList.length === 0) return null;

  return (
    <aside className="summary-card">
      <div className="summary-title">AIによる回答リストの要約</div>
      <ol className="summary-list">
        {aiList.map((m) => (
          <li key={m.id}>
            <button className="summary-row" onClick={() => onJump(m.id)} title="Jump to this message">
              <span className="sum-num">{m.number}.</span>
              <span className="sum-text">
                {m.text.length > 120 ? `${m.text.slice(0, 120)}…` : m.text}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </aside>
  );
};

export default SummaryCard;
