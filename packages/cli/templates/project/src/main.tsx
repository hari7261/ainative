import React from 'react';
import ReactDOM from 'react-dom/client';
import { AIAppComponent, AIPane } from '@hari7261/ainative-client';
import './style.css';

function App() {
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
                <h1>Launch a beautiful AI chat experience in minutes.</h1>
                <p>
                  This template ships with streaming chat, a local fallback response mode, and
                  a responsive interface built on the published AINative packages.
                </p>
              </div>

              <div className="starter-feature-grid">
                <article>
                  <span>Streaming</span>
                  <strong>Token-first conversation flow</strong>
                </article>
                <article>
                  <span>Responsive</span>
                  <strong>Desktop shell, mobile-first chat pane</strong>
                </article>
                <article>
                  <span>Portable</span>
                  <strong>Swap local fallback for OpenAI whenever ready</strong>
                </article>
              </div>

              <div className="starter-tips">
                <p>Try asking:</p>
                <ul>
                  <li>Plan a 3-day launch roadmap for my product.</li>
                  <li>Write a friendly follow-up email to a client.</li>
                  <li>Brainstorm features for a student productivity app.</li>
                </ul>
              </div>
            </section>

            <section className="starter-chat-panel">
              <AIPane
                state={state}
                className="starter-pane"
                onSendMessage={(message) => app.sendMessage(message, { stream: true })}
                title="Modern AI Workspace"
                subtitle="Responsive chat template powered by @hari7261/ainative-client"
                enableAudio={true}
                enableImage={true}
                enableFile={true}
                renderHeader={() => (
                  <div className="starter-pane-header">
                    <div>
                      <span className="starter-pane-kicker">LIVE TEMPLATE</span>
                      <h2 className="starter-pane-title">Modern AI Workspace</h2>
                      <p className="starter-pane-subtitle">
                        Streaming chat UI with a local fallback mode for instant setup.
                      </p>
                    </div>
                    <div className="starter-pane-pills">
                      <span>{state.messages.length} messages</span>
                      <span>{state.streaming ? 'Streaming' : 'Ready'}</span>
                    </div>
                  </div>
                )}
                renderFooter={() => (
                  <div className="starter-pane-footer">
                    <span>Built with @hari7261/ainative-client</span>
                    <span>Add `OPENAI_API_KEY` to switch to a hosted model.</span>
                  </div>
                )}
              />
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
