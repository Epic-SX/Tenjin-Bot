import React from 'react';
import type { Message } from '../types';
import Modal from './Modal';

interface Props {
  messages: Message[];
  open: boolean;
  onClose: () => void;
  onJump: (messageId: string) => void;
}

const PinBoard: React.FC<Props> = ({ messages, open, onClose, onJump }) => {
  const pinned = messages.filter((m) => m.pinned);
  return (
    <Modal open={open} onClose={onClose} title="Pinned comments" width={520}>
      {pinned.length === 0 ? (
        <div className="empty">No pinned messages yet.</div>
      ) : (
        <ul className="pin-list">
          {pinned.map((m) => (
            <li key={m.id}>
              <button className="pin-jump" onClick={() => onJump(m.id)}>
                #{m.id} — {m.text}
              </button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
};

export default PinBoard;
