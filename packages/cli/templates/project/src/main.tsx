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
                <span className="starter-badge">AINative Starter</span>
                <h1>Ship a clean AI workspace from minute one.</h1>
                <p>
                  This starter keeps the focus on product work: a professional light UI, streaming
                  chat, mode-aware prompts, and framework diagnostics already wired in.
                </p>
              </div>

              <div className="starter-feature-grid">
                <article>
                  <span>Framework first</span>
                  <strong>Uses the same shipped client components your app will depend on</strong>
                </article>
                <article>
                  <span>Operator friendly</span>
                  <strong>Request counts, events, and streaming status are visible from the start</strong>
                </article>
                <article>
                  <span>Multimodal</span>
                  <strong>Files and voice notes are built into the prompt flow</strong>
                </article>
              </div>

              <div className="starter-tips">
                <p>Try first</p>
                <ul>
                  <li>Ask Search mode for a current market scan.</li>
                  <li>Use Think mode for a product architecture decision.</li>
                  <li>Attach a file and ask for structured feedback.</li>
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
                title="Starter Workspace"
                subtitle="A clean AI-native interface ready for your product logic, provider config, and npm deploy flow."
                enableAudio={true}
                enableFile={true}
                renderHeader={() => (
                  <div className="ain-header ai-pane-header">
                    <div>
                      <span className="ain-kicker">Starter workspace</span>
                      <h2 className="ain-title starter-pane-title">Starter Workspace</h2>
                      <p className="ain-subtitle starter-pane-subtitle">
                        The same chat surface shipped by the framework, ready for your domain logic.
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
                    <span>Built with `@hari7261/ainative-client`.</span>
                    <span>Add `OPENAI_API_KEY` to move from fallback to hosted responses.</span>
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
