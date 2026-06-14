'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, Smile, MoreVertical, Check, CheckCheck } from 'lucide-react';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'text' | 'file' | 'image' | 'voice' | 'video';
  timestamp: number;
  attachments?: Attachment[];
  status: 'sent' | 'delivered' | 'read';
}

export interface Attachment {
  id: string;
  type: 'file' | 'image' | 'audio' | 'video';
  filename: string;
  size: number;
  url?: string;
  yandexDiskPath?: string;
}

export interface MessageThreadProps {
  chatId: string;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string, attachments?: Attachment[]) => void;
  onFileAttach?: () => void;
  isLoading?: boolean;
  className?: string;
}

export function MessageThread({
  chatId,
  messages,
  currentUserId,
  onSendMessage,
  onFileAttach,
  isLoading = false,
  className = ''
}: MessageThreadProps) {
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const content = inputValue.trim();
    if (!content || isLoading) return;

    onSendMessage(content);
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString('ru-RU');
    }
  };

  const MessageStatus = ({ status }: { status: Message['status'] }) => {
    if (status === 'sent') {
      return <Check size={14} className="message-status" />;
    } else if (status === 'delivered') {
      return <Check size={14} className="message-status delivered" />;
    } else {
      return <CheckCheck size={14} className="message-status read" />;
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((acc, msg) => {
    const date = formatDate(msg.timestamp);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(msg);
    return acc;
  }, {} as Record<string, Message[]>);

  return (
    <div className={`message-thread ${className}`}>
      {/* Messages */}
      <div className="messages-container">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <React.Fragment key={date}>
            <div className="message-date-separator">{date}</div>
            {dateMessages.map((message) => {
              const isOwn = message.senderId === currentUserId;

              return (
                <div
                  key={message.id}
                  className={`message ${isOwn ? 'message-own' : 'message-other'}`}
                >
                  {!isOwn && (
                    <div className="message-avatar">
                      {message.senderName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="message-content">
                    {!isOwn && (
                      <div className="message-sender">{message.senderName}</div>
                    )}

                    <div className="message-body">
                      {/* Attachments */}
                      {message.attachments?.map((attachment) => (
                        <div key={attachment.id} className="message-attachment">
                          {attachment.type === 'image' ? (
                            <img
                              src={attachment.url}
                              alt={attachment.filename}
                              className="attachment-image"
                            />
                          ) : (
                            <div className="attachment-file">
                              <Paperclip size={16} />
                              <span>{attachment.filename}</span>
                              <span className="attachment-size">
                                {(attachment.size / 1024).toFixed(1)} KB
                              </span>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Text content */}
                      {message.content && (
                        <div className="message-text">{message.content}</div>
                      )}

                      {/* Time and status */}
                      <div className="message-meta">
                        <span className="message-time">{formatTime(message.timestamp)}</span>
                        {isOwn && <MessageStatus status={message.status} />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="message-input-area">
        {/* Attach button */}
        {onFileAttach && (
          <button
            className="message-input-btn"
            onClick={onFileAttach}
            title="Прикрепить файл"
          >
            <Paperclip size={20} />
          </button>
        )}

        {/* Text input */}
        <textarea
          ref={inputRef}
          className="message-input"
          placeholder="Напишите сообщение..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isLoading}
        />

        {/* Emoji button */}
        <button className="message-input-btn" title="Эмодзи">
          <Smile size={20} />
        </button>

        {/* Voice button */}
        <button
          className={`message-input-btn ${isRecording ? 'recording' : ''}`}
          onClick={() => setIsRecording(!isRecording)}
          title="Голосовое сообщение"
        >
          <Mic size={20} />
        </button>

        {/* Send button */}
        <button
          className="message-send-btn"
          onClick={handleSend}
          disabled={!inputValue.trim() || isLoading}
        >
          <Send size={20} />
        </button>
      </div>

      {/* Recording indicator */}
      {isRecording && (
        <div className="recording-indicator">
          <div className="recording-dot"></div>
          <span>Запись голоса... 0:00</span>
          <button onClick={() => setIsRecording(false)}>Отмена</button>
        </div>
      )}
    </div>
  );
}
