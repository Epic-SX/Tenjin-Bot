import React, { useMemo, useState } from 'react';
import type { Message } from '../types';
import Modal from './Modal';
import { BsFillPinAngleFill } from "react-icons/bs";

interface Props {
  messages: Message[];
  onJump: (messageId: string) => void;
}

const SidebarRight: React.FC<Props> = ({ messages, onJump }) => {
  const [preview, setPreview] = useState<{ open: boolean; messageId?: string }>({ open: false });
  const summary = useMemo(
    () => messages.filter((m) => m.author === 'user').slice(0, 4),
    [messages]
  );

  return (
    <aside className="rightbar">
      <div className="rightbar-header">
        <div className="avatar">👩‍💻</div>
        <div className="who">JUNKO</div>
      </div>

      <div className="rightbar-list">
        {summary.map((m, i) => (
          <button
            key={m.id}
            className="right-item"
            onClick={() => setPreview({ open: true, messageId: m.id })}
            onDoubleClick={() => onJump(m.id)}
            title="Click: preview / Double‑click: jump to message"
          >
            <div className="right-number">{8 + messages.indexOf(m)}.</div>
            <div className="right-text">{m.text.slice(0, 80)}{m.text.length > 80 ? '…' : ''}</div>
          </button>
        ))}
      </div>

      <Modal
        open={preview.open}
        onClose={() => setPreview({ open: false })}
        title="質問者エリアの要約から開くポップアップ"
        width={520}
      >
        <div className="preview-block">
          Etiam rhoncus. Maecenas tempus. Adipiscing sem neque sed ipsum
        </div>
        <div className="preview-block">
          Ut wisi enim ad minim veniam. Nam quam nunc, blandit vel, luctus pulvinar,
        </div>
        <div className="preview-block">
          Etiam sit amet orci eget eros faucibus
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

export default SidebarRight;
