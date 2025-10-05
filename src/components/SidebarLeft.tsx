import React, { useMemo, useState, useRef, useEffect } from 'react';
import type { QuestionItem } from '../types';
import { SearchIcon, ArrowCollapse } from './Icons';
import Modal from './Modal';
import { CiFolderOn } from "react-icons/ci";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { BsFolderPlus } from "react-icons/bs";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { IoMdTrash } from "react-icons/io";
import { HiDotsVertical } from "react-icons/hi";

interface Props {
  items: QuestionItem[];
  onCollapseToggle: () => void;
  collapsed: boolean;
  onOpenMessage: (messageId: string) => void;
  onNewChat: () => void;
  onCreateProject: (projectName: string) => void;
  onRenameQuestion: (questionId: string, newTitle: string) => void;
  onDeleteQuestion: (questionId: string) => void;
  folders: string[];
}

const SidebarLeft: React.FC<Props> = ({ items, collapsed, onCollapseToggle, onOpenMessage, onNewChat, onCreateProject, onRenameQuestion, onDeleteQuestion, folders }) => {
  const [q, setQ] = useState('');
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({}); // accordion state
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [renamingItem, setRenamingItem] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const toggleGroup = (g: string) => setOpenGroups((prev) => ({ ...prev, [g]: !prev[g] }));

  // Close dropdown when hovering away from an item
  useEffect(() => {
    if (hoveredItem !== openDropdown) {
      setOpenDropdown(null);
    }
  }, [hoveredItem, openDropdown]);

  const handleCreateProject = () => {
    if (projectName.trim()) {
      onCreateProject(projectName.trim());
      setProjectName('');
      setProjectModalOpen(false);
    }
  };

  const handleProjectKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCreateProject();
    }
  };

  const handleStartRename = (item: QuestionItem) => {
    setRenamingItem(item.id);
    setRenameValue(item.title);
  };

  const handleConfirmRename = (questionId: string) => {
    if (renameValue.trim()) {
      onRenameQuestion(questionId, renameValue.trim());
    }
    setRenamingItem(null);
    setRenameValue('');
  };

  const handleCancelRename = () => {
    setRenamingItem(null);
    setRenameValue('');
  };

  const handleRenameKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, questionId: string) => {
    if (e.key === 'Enter') {
      handleConfirmRename(questionId);
    } else if (e.key === 'Escape') {
      handleCancelRename();
    }
  };

  const handleDelete = (questionId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      onDeleteQuestion(questionId);
      setOpenDropdown(null);
    }
  };

  const toggleDropdown = (questionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdown((prev) => (prev === questionId ? null : questionId));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <aside className={`leftbar ${collapsed ? 'collapsed' : ''}`}>
      <div className="leftbar-header">
        <div className="brand">TENJIN</div>
        <div className="brand-logo">T</div>
        <button className="collapse-btn" onClick={onCollapseToggle} title="Collapse left panel">
          <ArrowCollapse />
        </button>
      </div>

      <div className="sidebar-actions">
        <button className="sidebar-action-btn" onClick={onNewChat} title="New chat">
          <HiOutlinePencilAlt className="action-icon" />
          <span className="action-text">New chat</span>
        </button>
        <button className="sidebar-action-btn" onClick={() => setProjectModalOpen(true)} title="Projects">
          <BsFolderPlus className="action-icon" />
          <span className="action-text">Projects</span>
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
        {groups.map(([group, arr]) => {
          const open = openGroups[group] ?? true;
          return (
            <div className={`group ${open ? 'open' : 'closed'}`} key={group}>
              <button 
                className="group-header"
                onClick={() => toggleGroup(group)}
                title="Click to expand/collapse this category"
              >
                <CiFolderOn className="document-icon" />
                <span className="group-title">{group}</span>
              </button>

              <ol className="group-list">
                {open &&
                  arr.map((it) => (
                    <li 
                      key={it.id} 
                      className="question-item"
                      onMouseEnter={() => setHoveredItem(it.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <div className="num">{numberInGroup(arr, it.id)}.</div>
                      {renamingItem === it.id ? (
                        <input
                          type="text"
                          className="rename-input"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onKeyDown={(e) => handleRenameKeyPress(e, it.id)}
                          onBlur={() => handleConfirmRename(it.id)}
                          autoFocus
                        />
                      ) : (
                        <div className="question-content-wrapper">
                          <button
                            className="question-title"
                            onClick={() => it.messageId && onOpenMessage(it.messageId!)}
                            title={it.title}
                          >
                            <span className="question-title-text">{it.title}</span>
                          </button>
                          {hoveredItem === it.id && (
                            <div className="question-menu-container" ref={openDropdown === it.id ? dropdownRef : null}>
                              <button
                                className="dots-menu-btn"
                                onClick={(e) => toggleDropdown(it.id, e)}
                                title="More options"
                              >
                                <HiDotsVertical />
                              </button>
                              {openDropdown === it.id && (
                                <div className="question-dropdown-menu">
                                  <button
                                    className="dropdown-menu-item"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStartRename(it);
                                      setOpenDropdown(null);
                                    }}
                                  >
                                    <MdDriveFileRenameOutline />
                                    <span>Rename</span>
                                  </button>
                                  <button
                                    className="dropdown-menu-item delete-item"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(it.id);
                                    }}
                                  >
                                    <IoMdTrash />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
              </ol>
            </div>
          );
        })}
      </div>

      <Modal
        open={projectModalOpen}
        onClose={() => {
          setProjectModalOpen(false);
          setProjectName('');
        }}
        title="Project name"
        width={580}
      >
        <div className="project-modal-content">
          <div className="project-input-wrapper">
            <input
              type="text"
              className="project-name-input"
              placeholder="bid"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyPress={handleProjectKeyPress}
              autoFocus
            />
          </div>

          <div className="project-categories">
            {folders.map((folder) => (
              <button
                key={folder}
                className="project-category-btn"
                onClick={() => setProjectName(folder)}
              >
                {folder === 'General' && '💵'}
                {folder === 'Follow-ups' && '🎓'}
                {folder === 'Notes' && '✍️'}
                {folder !== 'General' && folder !== 'Follow-ups' && folder !== 'Notes' && '📁'}
                <span>{folder}</span>
              </button>
            ))}
          </div>

          <div className="project-description">
            <p>Projects keep chats, files, and custom instructions in one place. Use them for ongoing work, or just to keep things tidy.</p>
          </div>

          <div className="project-modal-footer">
            <button 
              className="create-project-btn"
              onClick={handleCreateProject}
              disabled={!projectName.trim()}
            >
              Create project
            </button>
          </div>
        </div>
      </Modal>
    </aside>
  );
};

export default SidebarLeft;
