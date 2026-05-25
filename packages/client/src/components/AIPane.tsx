import React from 'react';
import { AIState } from '../runtime/state';
import { AIStreamList } from './AIStream';
import { AIInput, AIInputAttachment, AIInputSubmitMeta } from './AIInput';
import { ensureAINativeComponentStyles } from './styles';

export interface AIPaneProps {
  state: AIState;
  onSendMessage: (
    message: string,
    attachments?: AIInputAttachment[],
    meta?: AIInputSubmitMeta
  ) => void;
  title?: string;
  subtitle?: string;
  showMetadata?: boolean;
  enableAudio?: boolean;
  enableFile?: boolean;
  className?: string;
  renderHeader?: () => React.ReactNode;
  renderFooter?: () => React.ReactNode;
}

interface PaneEvent {
  id: string;
  type: string;
  timestamp: number;
  summary: string;
}

function getPaneEvents(state: AIState): PaneEvent[] {
  if (!Array.isArray(state.metadata?.recentEvents)) {
    return [];
  }

  return state.metadata.recentEvents
    .filter((event: any) => event && typeof event.id === 'string')
    .slice(-6)
    .reverse();
}

function formatEventTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getModeSummary(state: AIState): string {
  const mode = state.metadata?.lastMode;
  if (mode === 'search') {
    return 'Search mode enabled for the last request.';
  }
  if (mode === 'think') {
    return 'Think mode was used for deeper reasoning.';
  }
  if (mode === 'canvas') {
    return 'Canvas mode was used for structured output.';
  }
  return 'Standard chat mode is active.';
}

export const AIPane: React.FC<AIPaneProps> = ({
  state,
  onSendMessage,
  title = 'AINative Studio',
  subtitle = 'A clean AI-native chat workspace with streaming, attachments, and mode-aware prompts.',
  showMetadata = false,
  enableAudio = true,
  enableFile = true,
  className = '',
  renderHeader,
  renderFooter,
}) => {
  ensureAINativeComponentStyles();

  const eventCount = Array.isArray(state.metadata?.recentEvents)
    ? state.metadata.recentEvents.length
    : 0;
  const requestCount = typeof state.metadata?.requestCount === 'number' ? state.metadata.requestCount : 0;
  const tokenCount = typeof state.metadata?.streamTokenCount === 'number'
    ? state.metadata.streamTokenCount
    : 0;
  const recentEvents = getPaneEvents(state);

  return (
    <div className={`ain-shell ain-pane ai-pane ${className}`}>
      <section className="ain-pane-main">
        {renderHeader ? (
          renderHeader()
        ) : (
          <header className="ain-header ai-pane-header">
            <div className="ain-header-copy">
              <span className="ain-kicker">Studio Chat</span>
              <h2 className="ain-title ai-pane-title">{title}</h2>
              <p className="ain-subtitle ai-pane-subtitle">{subtitle}</p>
            </div>

            <div className="ain-status-row">
              <span className="ain-status-pill" data-state={state.streaming ? 'active' : 'idle'}>
                {state.streaming ? 'Streaming' : 'Ready'}
              </span>
              <span className="ain-metric">{state.messages.length} messages</span>
              <span className="ain-metric">{requestCount} requests</span>
            </div>
          </header>
        )}

        <div className="ain-content ai-pane-content">
          {state.error ? (
            <div className="ain-error ai-pane-error">
              <strong>Error:</strong> {state.error.message}
            </div>
          ) : null}

          {state.messages.length === 0 ? (
            <div className="ain-empty ai-pane-empty">
              <div className="ain-empty-copy">
                <h3>Start with a mode-aware prompt.</h3>
                <p>
                  Use Search for fresh answers, Think for reasoning-heavy tasks, or Canvas when you
                  want structured output. Attach an image or PDF to test multimodal flows.
                </p>
              </div>

              <div className="ain-metrics">
                <span className="ain-chip">Streaming-ready</span>
                <span className="ain-chip">File attachments</span>
                <span className="ain-chip">Voice notes</span>
              </div>
            </div>
          ) : (
            <AIStreamList
              messages={state.messages}
              showMetadata={showMetadata}
              className="ai-pane-messages"
            />
          )}
        </div>

        <div className="ain-input-section ai-pane-input">
          <AIInput
            onSubmit={onSendMessage}
            disabled={state.streaming}
            enableAudio={enableAudio}
            enableFile={enableFile}
            footerHint={state.streaming ? 'Response in progress' : 'Shift+Enter for a new line'}
          />
        </div>

        {renderFooter ? (
          <div>{renderFooter()}</div>
        ) : (
          <footer className="ain-footer ai-pane-footer">
            <span>{getModeSummary(state)}</span>
            <span>{tokenCount} streamed tokens in this session.</span>
          </footer>
        )}
      </section>

      <aside className="ain-pane-side">
        <section className="ain-side-panel">
          <h3 className="ain-panel-title">Workspace status</h3>
          <div className="ain-panel-copy">
            <p>Track request flow and mode usage while you validate the framework experience.</p>
          </div>
          <div className="ain-metrics" style={{ marginTop: '0.85rem' }}>
            <span className="ain-chip">{eventCount} recent events</span>
            <span className="ain-chip">{state.streaming ? 'Live stream' : 'Idle stream'}</span>
          </div>
        </section>

        <section className="ain-side-panel">
          <h3 className="ain-panel-title">Capabilities</h3>
          <ul className="ain-side-list">
            <li>
              <strong>Provider-ready</strong>
              <p>Works with the local fallback path now and hosted models when keys are present.</p>
            </li>
            <li>
              <strong>Mode-aware prompts</strong>
              <p>Search, Think, and Canvas travel through the chat flow as first-class intent.</p>
            </li>
            <li>
              <strong>Multimodal input</strong>
              <p>Attach images, text files, PDFs, or record a short voice note.</p>
            </li>
          </ul>
        </section>

        <section className="ain-side-panel">
          <h3 className="ain-panel-title">Recent events</h3>
          {recentEvents.length === 0 ? (
            <div className="ain-panel-copy">
              <p>Event history will appear here after the first request.</p>
            </div>
          ) : (
            <ul className="ain-event-list">
              {recentEvents.map((event) => (
                <li key={event.id} className="ain-event-item">
                  <strong>{event.summary}</strong>
                  <time dateTime={new Date(event.timestamp).toISOString()}>
                    {formatEventTime(event.timestamp)}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </section>
      </aside>
    </div>
  );
};
