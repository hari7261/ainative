import React from 'react';
import ReactDOM from 'react-dom/client';
import { AIAppComponent } from '@hari7261/ainative-client';
import { PromptInputBox } from './PromptInputBox';
import './style.css';

function App() {
  const [input, setInput] = React.useState('');

  const config = {
    apiUrl: 'http://localhost:3001',
    streamMethod: 'SSE' as const,
    debug: true,
  };

  return (
    <div className="starter-app-shell">
      <div className="starter-glow starter-glow-one" />
      <div className="starter-glow starter-glow-two" />

      <AIAppComponent config={config}>
        {(state, app) => (
          <main className="starter-layout">
            <section className="starter-sidebar">
              <div className="starter-brand">
                <span className="starter-badge">AINative Starter</span>
                <h1>Beautiful AI chat with advanced prompts.</h1>
                <p>
                  This template features a modern AI prompt box with image uploads, voice recording,
                  and special modes (Search, Think, Canvas) powered by AINative.
                </p>
              </div>

              <div className="starter-feature-grid">
                <article>
                  <span>Multi-Modal</span>
                  <strong>Images, voice, and text input</strong>
                </article>
                <article>
                  <span>Smart Modes</span>
                  <strong>Search, Think, and Canvas capabilities</strong>
                </article>
                <article>
                  <span>Modern UI</span>
                  <strong>Radix UI components with smooth animations</strong>
                </article>
              </div>

              <div className="starter-tips">
                <p>Features:</p>
                <ul>
                  <li>Drag & drop or paste images directly</li>
                  <li>Voice recording with one click</li>
                  <li>Search, Think, and Canvas modes for specialized queries</li>
                </ul>
              </div>
            </section>

            <section className="starter-chat-panel">
              <div className="starter-pane ai-pane">
                {/* Header */}
                <div className="ai-pane-header">
                  <div className="starter-pane-header">
                    <div>
                      <span className="starter-pane-kicker">ADVANCED TEMPLATE</span>
                      <h2 className="starter-pane-title">AI Workspace</h2>
                      <p className="starter-pane-subtitle">
                        Advanced prompt box with image uploads, voice recording, and special modes.
                      </p>
                    </div>
                    <div className="starter-pane-pills">
                      <span>{state.messages.length} messages</span>
                      <span>{state.streaming ? 'Streaming' : 'Ready'}</span>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="ai-pane-content" style={{ flex: 1, overflowY: 'auto' }}>
                  {state.messages.length === 0 ? (
                    <div className="ai-pane-empty">
                      <p>Start a conversation by typing a message below.</p>
                      <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                        Try using Search mode, Think mode, or attach an image!
                      </p>
                    </div>
                  ) : (
                    <div className="ai-stream-list" style={{ display: 'flex', flexDirection: 'column' }}>
                      {state.messages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`ai-stream-message ${
                            msg.role === 'user' ? 'ai-stream-user' : 'ai-stream-assistant'
                          }`}
                        >
                          <div className="ai-stream-header">
                            <span className="ai-stream-role">
                              {msg.role === 'user' ? 'You' : 'Assistant'}
                            </span>
                          </div>
                          <div className="ai-stream-content">{msg.content}</div>
                        </div>
                      ))}
                      {state.streaming && (
                        <div className="ai-stream-message ai-stream-assistant">
                          <div className="ai-stream-header">
                            <span className="ai-stream-role">Assistant</span>
                          </div>
                          <div className="ai-stream-content">
                            {state.buffer || 'Thinking...'}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Input */}
                <PromptInputBox
                  input={input}
                  setInput={setInput}
                  onSend={(message, files) => {
                    app.sendMessage(message, { stream: true });
                    setInput('');
                  }}
                  placeholder="Type your message... (Shift+Enter for new line)"
                  disabled={state.streaming}
                />

                {/* Footer */}
                <div className="starter-pane-footer">
                  <span>Built with @hari7261/ainative-client</span>
                  <span>Add OPENAI_API_KEY to use a real model</span>
                </div>
              </div>
            </section>
          </main>
        )}
      </AIAppComponent>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
