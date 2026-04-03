/**
 * AIPane Component
 * Container for AI interactions with built-in layout
 */

import React from 'react';
import { AIState } from '../runtime/state';
import { AIStreamList } from './AIStream';
import { AIInput } from './AIInput';

export interface AIPaneProps {
  state: AIState;
  onSendMessage: (message: string, attachments?: any[]) => void;
  title?: string;
  subtitle?: string;
  showMetadata?: boolean;
  enableAudio?: boolean;
  enableImage?: boolean;
  enableFile?: boolean;
  className?: string;
  renderHeader?: () => React.ReactNode;
  renderFooter?: () => React.ReactNode;
}

export const AIPane: React.FC<AIPaneProps> = ({
  state,
  onSendMessage,
  title = 'AI Assistant',
  subtitle,
  showMetadata = false,
  enableAudio = true,
  enableImage = true,
  enableFile = true,
  className = '',
  renderHeader,
  renderFooter,
}) => {
  return (
    <div className={`ai-pane ${className}`}>
      {renderHeader ? (
        renderHeader()
      ) : (
        <div className="ai-pane-header">
          <h2 className="ai-pane-title">{title}</h2>
          {subtitle && <p className="ai-pane-subtitle">{subtitle}</p>}
          {state.streaming && (
            <div className="ai-pane-status">
              <span className="ai-pane-streaming-indicator">●</span> Streaming...
            </div>
          )}
        </div>
      )}

      <div className="ai-pane-content">
        {state.error && (
          <div className="ai-pane-error">
            <strong>Error:</strong> {state.error.message}
          </div>
        )}

        <AIStreamList
          messages={state.messages}
          showMetadata={showMetadata}
          className="ai-pane-messages"
        />

        {state.messages.length === 0 && (
          <div className="ai-pane-empty">
            <p>Start a conversation with the AI assistant</p>
          </div>
        )}
      </div>

      <div className="ai-pane-input">
        <AIInput
          onSubmit={onSendMessage}
          disabled={state.streaming}
          enableAudio={enableAudio}
          enableImage={enableImage}
          enableFile={enableFile}
        />
      </div>

      {renderFooter && <div className="ai-pane-footer">{renderFooter()}</div>}
    </div>
  );
};
