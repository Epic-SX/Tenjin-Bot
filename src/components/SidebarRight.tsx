import React, { useMemo, useState, useRef, useEffect } from 'react';
import type { Message } from '../types';
import Modal from './Modal';
import { BsFillPinAngleFill } from "react-icons/bs";
import { IoPlayForward, IoClose } from "react-icons/io5";
import { GoReply } from "react-icons/go";
import { HiOutlineMicrophone } from "react-icons/hi2";
import { CgAttachment } from "react-icons/cg";
import { GoPlus } from "react-icons/go";
import { AiOutlineSend } from "react-icons/ai";

interface Props {
  messages: Message[];
  onJump: (messageId: string) => void;
}

const SidebarRight: React.FC<Props> = ({ messages, onJump }) => {
  const [preview, setPreview] = useState<{ open: boolean; messageId?: string }>({ open: false });
  const [detailView, setDetailView] = useState<{ open: boolean; messageId?: string }>({ open: false });
  const [pinnedOpen, setPinnedOpen] = useState(false);
  const [detailInput, setDetailInput] = useState('');
  const [replyingToSubIndex, setReplyingToSubIndex] = useState<number | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const pressTimer = useRef<number | null>(null);
  const recordingTimerRef = useRef<number | null>(null);
  
  const summary = useMemo(
    () => messages.filter((m) => m.author === 'user').slice(0, 4),
    [messages]
  );

  const pinnedUserMessages = useMemo(
    () => messages.filter((m) => m.author === 'user' && m.pinned),
    [messages]
  );

  const getMessageNumber = (messageId: string) => {
    return 1 + messages.findIndex((m) => m.id === messageId);
  };

  const handlePressStart = (messageId: string) => {
    pressTimer.current = setTimeout(() => {
      setPreview({ open: true, messageId });
    }, 500); // 500ms for long press
  };

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  // Clear input when detail view changes to a different message
  useEffect(() => {
    setDetailInput('');
    setReplyingToSubIndex(null);
    setAttachedFiles([]);
    // Stop recording if active
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setIsRecording(false);
    setRecordingTime(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailView.messageId]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  const replyToSubMessage = (text: string, index: number) => {
    setDetailInput(`"${text}"`);
    setReplyingToSubIndex(index);
  };

  const handleSendReply = () => {
    if (!detailInput.trim() || !detailView.messageId || replyingToSubIndex === null) return;
    
    // This is a demo - in a real app, you would send this to your backend
    console.log('Sending reply:', {
      messageId: detailView.messageId,
      subMessageIndex: replyingToSubIndex,
      reply: detailInput
    });
    
    // Clear input and reset reply state
    setDetailInput('');
    setReplyingToSubIndex(null);
  };

  const handleAttachment = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*,video/*,audio/*,.pdf,.doc,.docx,.txt';
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        setAttachedFiles(prev => [...prev, ...Array.from(files)]);
      }
    };
    input.click();
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFilePreview = (file: File): string | null => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  const getFileIcon = (file: File): string => {
    if (file.type.startsWith('image/')) return '🖼️';
    if (file.type.startsWith('video/')) return '🎥';
    if (file.type.startsWith('audio/')) return '🎵';
    if (file.type.includes('pdf')) return '📄';
    if (file.type.includes('word') || file.type.includes('document')) return '📝';
    return '📎';
  };

  const handleVoice = () => {
    if (isRecording) {
      // Stop recording
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      setIsRecording(false);
      console.log(`Recording stopped after ${recordingTime} seconds`);
      setRecordingTime(0);
    } else {
      // Start recording
      setIsRecording(true);
      setRecordingTime(0);
      console.log('Voice recording started');
      
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  };

  const previewMessage = preview.messageId ? messages.find(m => m.id === preview.messageId) : null;
  const detailMessage = detailView.messageId ? messages.find(m => m.id === detailView.messageId) : null;

  return (
    <aside className="rightbar">
      <div className="rightbar-header">
        <div className="avatar">👩‍💻</div>
        <div className="who">JUNKO</div>
      </div>

      <div className="rightbar-list">
        {summary.map((m) => (
          <button
            key={m.id}
            className="right-item"
            onMouseDown={() => handlePressStart(m.id)}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onTouchStart={() => handlePressStart(m.id)}
            onTouchEnd={handlePressEnd}
            onDoubleClick={() => onJump(m.id)}
            title="Press and hold: preview / Double‑click: jump to message"
          >
            <div className="right-number">{getMessageNumber(m.id)}.</div>
            <div className="right-text">{m.text.slice(0, 80)}{m.text.length > 80 ? '…' : ''}</div>
          </button>
        ))}
      </div>

      <Modal
        open={preview.open}
        onClose={() => setPreview({ open: false })}
        title={previewMessage ? `Q${getMessageNumber(previewMessage.id)}. User Question` : 'Preview'}
        width={480}
      >
        {previewMessage && (
          <div className="preview-modal-content">
            <div className="preview-scrollable">
              <div className="preview-text">{previewMessage.text}</div>
              {previewMessage.subMessages && previewMessage.subMessages.length > 0 && (
                <div className="preview-sub-messages">
                  {previewMessage.subMessages.map((subMsg, index) => (
                    <div key={index} className="preview-sub-message">
                      <span className="preview-sub-number">{index + 1}.</span>
                      <span className="preview-sub-text">{subMsg}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button 
              className="preview-new-window-btn"
              onClick={() => {
                if (preview.messageId) {
                  setDetailView({ open: true, messageId: preview.messageId });
                  setPreview({ open: false });
                }
              }}
              title="Open detailed view"
            >
              <IoPlayForward />
            </button>
          </div>
        )}
      </Modal>

      <Modal
        open={detailView.open}
        onClose={() => setDetailView({ open: false })}
        title={detailMessage ? `${getMessageNumber(detailMessage.id)}. User Question` : 'Detail View'}
        width={480}
      >
        {detailMessage && (
          <div className="detail-modal-wrapper">
            <div className="detail-modal-content">
              <div className="detail-scrollable">
                <div className="detail-main-text">{detailMessage.text}</div>
                {detailMessage.subMessages && detailMessage.subMessages.length > 0 && (
                  <div className="detail-sub-messages">
                    {detailMessage.subMessages.map((subMsg, index) => (
                      <div key={index} className="detail-sub-thread">
                        <div className="detail-sub-item">
                          <div className="detail-sub-number">{index + 1}.</div>
                          <div className="detail-sub-content">
                            <div className="detail-sub-text">{subMsg}</div>
                            <button
                              className="detail-reply-btn"
                              onClick={() => replyToSubMessage(subMsg, index)}
                              title="Reply"
                            >
                              <GoReply />
                            </button>
                          </div>
                        </div>
                        {detailMessage.subMessageReplies?.[index] && detailMessage.subMessageReplies[index].length > 0 && (
                          <div className="detail-thread-replies">
                            {detailMessage.subMessageReplies[index].map((reply, replyIdx) => (
                              <div 
                                key={reply.id} 
                                className={`detail-thread-reply ${reply.author === 'ai' ? 'ai-reply' : 'user-reply'}`}
                              >
                                <div className="detail-thread-number">
                                  {getMessageNumber(detailMessage.id)}_{index + 1}.{replyIdx + 1}.
                                </div>
                                <div className="detail-thread-text">{reply.text}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="detail-input-area">
              <div className="detail-input-left">
                <button 
                  className="detail-circle-btn" 
                  title="Attach" 
                  onClick={handleAttachment}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <CgAttachment />
                </button>
                <button 
                  className={`detail-circle-btn ${isRecording ? 'recording-active' : ''}`} 
                  title={isRecording ? "Stop recording" : "Start voice recording"} 
                  onClick={handleVoice}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <HiOutlineMicrophone />
                </button>
              </div>
              <div className="detail-text-input-wrapper">
                {isRecording && (
                  <div className="recording-indicator">
                    <div className="recording-pulse"></div>
                    <span className="recording-text">Recording...</span>
                    <span className="recording-time">{Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}</span>
                    <button className="recording-stop" onClick={handleVoice} title="Stop recording">
                      Stop
                    </button>
                  </div>
                )}
                {attachedFiles.length > 0 && (
                  <div className="file-previews">
                    {attachedFiles.map((file, index) => {
                      const preview = getFilePreview(file);
                      return (
                        <div key={index} className="file-preview-item">
                          {preview ? (
                            <img src={preview} alt={file.name} className="file-preview-image" />
                          ) : (
                            <div className="file-preview-icon">{getFileIcon(file)}</div>
                          )}
                          <button
                            className="file-preview-remove"
                            onClick={() => removeFile(index)}
                            title="Remove file"
                          >
                            <IoClose />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="detail-text-input-row">
                  <button className="detail-icon-btn" title="More" onMouseDown={(e) => e.preventDefault()}>
                    <GoPlus />
                  </button>
                  <input
                    className="detail-text-input"
                    placeholder="Ask about this question..."
                    value={detailInput}
                    onChange={(e) => setDetailInput(e.target.value)}
                  />
                  <button 
                    className="detail-send-btn" 
                    title="Send" 
                    onClick={handleSendReply}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <AiOutlineSend />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <div className="pin-button-container">
        {!pinnedOpen && (
          <button 
            className={`pin-button ${pinnedOpen ? 'rotating' : ''}`}
            title="View pinned questions" 
            onClick={() => setPinnedOpen(true)}
          >
            <BsFillPinAngleFill />
          </button>
        )}
        
        {pinnedOpen && (
          <div className="pinned-toggle">
            <div className="pinned-toggle-header">
              <button 
                className="pinned-toggle-close"
                onClick={() => setPinnedOpen(false)}
                title="Close"
              >
                <BsFillPinAngleFill />
              </button>
            </div>
            <div className="pinned-toggle-body">
              {pinnedUserMessages.length === 0 ? (
                <div className="pinned-empty">No pinned questions yet</div>
              ) : (
                <div className="pinned-list">
                  {pinnedUserMessages.map((m) => (
                    <div key={m.id} className="pinned-card" onClick={() => { onJump(m.id); setPinnedOpen(false); }}>
                      <div className="pinned-card-header">
                        <BsFillPinAngleFill className="pinned-card-icon" />
                        <span className="pinned-card-number">Q{getMessageNumber(m.id)}.</span>
                      </div>
                      <div className="pinned-card-text">
                        {m.text.slice(0, 100)}{m.text.length > 100 ? '...' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default SidebarRight;
