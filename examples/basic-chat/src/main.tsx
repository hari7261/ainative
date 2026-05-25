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
      <AIAppComponent config={config}>
        {(state, app) => (
          <main className="starter-layout">
            <section className="starter-sidebar">
              <div className="starter-brand">
                <span className="starter-badge">AINative Example</span>
                <h1>Professional AI chat, packaged like a real framework.</h1>
                <p>
                  This example is the reference workspace for the new AINative chat surface. It
                  shows streaming, mode-aware prompts, file attachments, and request diagnostics in
                  one clean deployable layout.
                </p>
              </div>

              <div className="starter-feature-grid">
                <article>
                  <span>Studio flow</span>
                  <strong>One place to test prompts, states, and runtime behavior</strong>
                </article>
                <article>
                  <span>Light UI</span>
                  <strong>Clean professional styling with no gradients or decorative motion</strong>
                </article>
                <article>
                  <span>Package-ready</span>
                  <strong>Matches the components shipped by the client package and CLI starter</strong>
                </article>
              </div>

              <div className="starter-tips">
                <p>Prompt ideas</p>
                <ul>
                  <li>Use Search mode to compare two AI app ideas.</li>
                  <li>Use Think mode to break down a launch roadmap.</li>
                  <li>Attach a screenshot or PDF and ask for feedback.</li>
                </ul>
              </div>
            </section>

            <section className="starter-chat-panel">
              <AIPane
                state={state}
                className="starter-pane"
                onSendMessage={(message, attachments, meta) => {
                  const attachmentCount = attachments?.length ?? 0;
                  const suffix =
                    attachmentCount > 0
                      ? `\n\nAttachments: ${attachmentCount} item${attachmentCount === 1 ? '' : 's'}`
                      : '';
                  app.sendMessage(`${message}${suffix}`, {
                    stream: true,
                    context: {
                      mode: meta?.mode ?? 'default',
                    },
                  });
                }}
                title="AINative Studio Chat"
                subtitle="Streaming, attachments, and event visibility in one light-weight framework surface."
                enableAudio={true}
                enableFile={true}
                renderHeader={() => (
                  <div className="ain-header ai-pane-header">
                    <div>
                      <span className="ain-kicker">Demo workspace</span>
                      <h2 className="ain-title starter-pane-title">AINative Studio Chat</h2>
                      <p className="ain-subtitle starter-pane-subtitle">
                        Validate the new framework UI, then publish the same experience through the
                        client package and generated starter app.
                      </p>
                    </div>
                    <div className="ain-status-row starter-pane-pills">
                      <span className="ain-status-pill" data-state={state.streaming ? 'active' : 'idle'}>
                        {state.streaming ? 'Streaming' : 'Ready'}
                      </span>
                      <span className="ain-metric">{state.messages.length} messages</span>
                      <span className="ain-metric">
                        {typeof state.metadata?.requestCount === 'number' ? state.metadata.requestCount : 0} requests
                      </span>
                    </div>
                  </div>
                )}
                renderFooter={() => (
                  <div className="ain-footer starter-pane-footer">
                    <span>Local fallback works without API keys.</span>
                    <span>Add `OPENAI_API_KEY` for production model responses.</span>
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
