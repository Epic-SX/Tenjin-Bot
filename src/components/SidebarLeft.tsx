import React, { useMemo, useState } from 'react';
import type { QuestionItem } from '../types';
import { SearchIcon, ArrowCollapse, DocumentIcon } from './Icons';
import Modal from './Modal';

interface Props {
  items: QuestionItem[];
  onCollapseToggle: () => void;
  collapsed: boolean;
  onOpenMessage: (messageId: string) => void;
}

const SidebarLeft: React.FC<Props> = ({ items, collapsed, onCollapseToggle, onOpenMessage }) => {
  const [q, setQ] = useState('');
  const [preview, setPreview] = useState<{ open: boolean; messageId?: string }>({ open: false });

  const filtered = useMemo(() => {
    const t = q.toLowerCase();
    return items.filter(i => i.title.toLowerCase().includes(t));
  }, [q, items]);

  const groups = useMemo(() => {
    const m = new Map<string, QuestionItem[]>();
    filtered.forEach((it) => {
      const k = it.folder ?? 'Ungrouped';
      if (!m.has(k)) m.set(k, []);
      m.get(k)!.push(it);
    });
    return Array.from(m.entries());
  }, [filtered]);

  // numbering across each group
  const numberInGroup = (groupItems: QuestionItem[], id: string) =>
    groupItems.findIndex((g) => g.id === id) + 1;

  return (
    <aside className={`leftbar ${collapsed ? 'collapsed' : ''}`}>
      <div className="leftbar-header">
        <div className="brand">TENJIN</div>
        <button className="collapse-btn" onClick={onCollapseToggle} title="Collapse left panel">
          <ArrowCollapse />
        </button>
      </div>

      <div className="search">
        <SearchIcon />
        <input
          placeholder="Search questions…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="leftbar-list">
        {groups.map(([group, arr]) => (
          <div className="group" key={group}>
            <div className="group-header">
              <DocumentIcon className="document-icon" />
              <span className="group-title">{group}</span>
            </div>

            <ol className="group-list">
              {arr.map((it) => (
                <li key={it.id} className="question-item">
                  <div className="num">{numberInGroup(arr, it.id)}.</div>
                  <label className="checkbox">
                    <input type="checkbox" defaultChecked={!!it.checked} />
                    <span />
                  </label>
                  <button
                    className="question-title"
                    onClick={() => setPreview({ open: true, messageId: it.messageId })}
                    onDoubleClick={() => it.messageId && onOpenMessage(it.messageId!)}
                    title="Click: preview / Double‑click: jump to message"
                  >
                    {it.title}
                  </button>
                </li>
              ))}
            </ol>
          </div>
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
    </aside>
  );
};

export default SidebarLeft;
