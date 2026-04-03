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
                <span className="starter-badge">Example App</span>
                <h1>Responsive AI chat with streaming built in.</h1>
                <p>
                  This example shows the published AINative packages in a polished interface with
                  a local fallback server and modern responsive styling.
                </p>
              </div>

              <div className="starter-feature-grid">
                <article>
                  <span>Responsive</span>
                  <strong>Comfortable desktop layout and clean mobile chat flow</strong>
                </article>
                <article>
                  <span>Streaming</span>
                  <strong>Assistant responses update token by token</strong>
                </article>
                <article>
                  <span>Multimodal</span>
                  <strong>Audio, image, and file affordances are already wired in</strong>
                </article>
              </div>

              <div className="starter-tips">
                <p>Prompt ideas</p>
                <ul>
                  <li>Draft a product launch plan for a solo founder.</li>
                  <li>Summarize a meeting into crisp action items.</li>
                  <li>Design a feature list for an AI note-taking app.</li>
                </ul>
              </div>
            </section>

            <section className="starter-chat-panel">
              <AIPane
                state={state}
                className="starter-pane"
                onSendMessage={(msg) => {
                  app.sendMessage(msg, { stream: true });
                }}
                title="Basic Chat Example"
                subtitle="Powered by AINative"
                enableAudio={true}
                enableImage={true}
                enableFile={true}
                renderHeader={() => (
                  <div className="starter-pane-header">
                    <div>
                      <span className="starter-pane-kicker">DEMO MODE</span>
                      <h2 className="starter-pane-title">Basic Chat Example</h2>
                      <p className="starter-pane-subtitle">
                        A modern responsive chat workspace powered by the AINative runtime.
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
                    <span>Local fallback works without API keys.</span>
                    <span>Add `OPENAI_API_KEY` for real model responses.</span>
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
