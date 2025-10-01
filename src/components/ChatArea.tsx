import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Message } from '../types';
import MessageBubble from './MessageBubble';
import { HiOutlineMicrophone } from "react-icons/hi2";
import { CgAttachment } from "react-icons/cg";
import { GoPlus } from "react-icons/go";
import { AiOutlineSend } from "react-icons/ai";
import { GoReply } from "react-icons/go";
import { IoClose } from "react-icons/io5";

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
  const [inputValue, setInputValue] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: string; text: string; number: number } | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingTimerRef = useRef<number | null>(null);

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
    const msgIndex = indexed.find(x => x.id === id);
    if (!msg || !msgIndex) return;
    setReplyingTo({ id: msg.id, text: msg.text, number: msgIndex.number });
    setInputValue(`"${msg.text}"`);
  };
  const share = (id: string) => {
    const msg = messages.find(m => m.id === id);
    if (!msg) return;
    if (navigator.share) navigator.share({ text: msg.text }).catch(() => {});
    else alert('Web Share API not available.');
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
      // In a real app, you would save the audio here
      setRecordingTime(0);
    } else {
      // Start recording
      setIsRecording(true);
      setRecordingTime(0);
      console.log('Voice recording started');
      
      // In a real app, you would start the MediaRecorder API here
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

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
          <button 
            className="circle-btn" 
            title="Attach" 
            onClick={handleAttachment}
            onMouseDown={(e) => e.preventDefault()}
          >
            <CgAttachment />
          </button>
          <button 
            className={`circle-btn ${isRecording ? 'recording-active' : ''}`} 
            title={isRecording ? "Stop recording" : "Start voice recording"} 
            onClick={handleVoice}
            onMouseDown={(e) => e.preventDefault()}
          >
            <HiOutlineMicrophone />
          </button>
        </div>
        <div className="text-input-wrapper">
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
          <div className="text-input-row">
            <button 
              className="input-icon-btn" 
              title={replyingTo ? `Replying to #${replyingTo.number}` : "More"}
              onMouseDown={(e) => e.preventDefault()}
            >
              {replyingTo ? <GoReply /> : <GoPlus />}
            </button>
            <textarea 
              className="text-input" 
              placeholder="Type your message…"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              rows={1}
            />
            {replyingTo && (
              <button 
                className="input-icon-btn close-reply" 
                title="Cancel reply"
                onClick={() => { setReplyingTo(null); setInputValue(''); }}
                onMouseDown={(e) => e.preventDefault()}
              >
                <IoClose />
              </button>
            )}
            <button 
              className="send-btn" 
              title="Send"
              onMouseDown={(e) => e.preventDefault()}
            >
              <AiOutlineSend />
            </button>
          </div>
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
