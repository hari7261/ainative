/**
 * AIStream Component
 * Displays streaming AI responses with token-by-token rendering
 */

import React, { useEffect, useState, useRef } from 'react';
import { Message } from '../runtime/state';

export interface AIStreamProps {
  message: Message;
  showMetadata?: boolean;
  className?: string;
  renderContent?: (content: string) => React.ReactNode;
}

export const AIStream: React.FC<AIStreamProps> = ({
  message,
  showMetadata = false,
  className = '',
  renderContent,
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDisplayedContent(message.content);

    // Auto-scroll to bottom when new content arrives
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [message.content]);

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const getRoleColor = (role: string): string => {
    switch (role) {
      case 'user':
        return 'ai-stream-user';
      case 'assistant':
        return 'ai-stream-assistant';
      case 'system':
        return 'ai-stream-system';
      case 'tool':
        return 'ai-stream-tool';
      default:
        return '';
    }
  };

  return (
    <div className={`ai-stream-message ${getRoleColor(message.role)} ${className}`} ref={contentRef}>
      <div className="ai-stream-header">
        <span className="ai-stream-role">{message.role}</span>
        <span className="ai-stream-time">{formatTimestamp(message.timestamp)}</span>
      </div>

      <div className="ai-stream-content">
        {renderContent ? renderContent(displayedContent) : displayedContent}
      </div>

      {showMetadata && message.metadata && (
        <div className="ai-stream-metadata">
          <details>
            <summary>Metadata</summary>
            <pre>{JSON.stringify(message.metadata, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
};

export interface AIStreamListProps {
  messages: Message[];
  showMetadata?: boolean;
  className?: string;
  renderContent?: (content: string) => React.ReactNode;
}

export const AIStreamList: React.FC<AIStreamListProps> = ({
  messages,
  showMetadata = false,
  className = '',
  renderContent,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={`ai-stream-list ${className}`} ref={containerRef}>
      {messages.map((message) => (
        <AIStream
          key={message.id}
          message={message}
          showMetadata={showMetadata}
          renderContent={renderContent}
        />
      ))}
    </div>
  );
};
