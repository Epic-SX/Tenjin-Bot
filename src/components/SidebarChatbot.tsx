import React, { useMemo, useState } from 'react';
import type { Message } from '../types';
import Modal from './Modal';
import { BsFillPinAngleFill } from "react-icons/bs";

interface Props {
  messages: Message[];
  onJump: (messageId: string) => void;
}

const SidebarChatbot: React.FC<Props> = ({ messages, onJump }) => {
  const [preview, setPreview] = useState<{ open: boolean; messageId?: string }>({ open: false });
  const aiSummary = useMemo(
    () => messages.filter((m) => m.author === 'ai').slice(0, 4),
    [messages]
  );

  return (
    <aside className="chatbot-sidebar">
      <div className="chatbot-header">
        <div className="avatar">🤖</div>
        <div className="who">TENJIN</div>
      </div>
      <div className="chatbot-list">
        {aiSummary.map((m, i) => (
          <button
            key={m.id}
            className="chatbot-item"
            onClick={() => setPreview({ open: true, messageId: m.id })}
            onDoubleClick={() => onJump(m.id)}
            title="Click: preview / Double‑click: jump to message"
          >
            <div className="chatbot-number">{8 + messages.indexOf(m)}.</div>
            <div className="chatbot-text">{m.text.slice(0, 80)}{m.text.length > 80 ? '…' : ''}</div>
          </button>
        ))}
      </div>

      <Modal
        open={preview.open}
        onClose={() => setPreview({ open: false })}
        title="AI Chatbotの回答リスト／質問者の質問側から開く"
        width={720}
      >
        <div className="preview-hint">部分的にテキスト選択して、さらに質問可能。</div>
        <div className="preview-block">
          <b>11.</b> Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna.
        </div>
        <div className="preview-block">
          <b>11.1.</b> Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus.
        </div>
      </Modal>

      <div className="pin-button-container">
        <button className="pin-button" title="Pin sidebar">
          <BsFillPinAngleFill />
        </button>
      </div>
    </aside>
  );
};

export default SidebarChatbot;
