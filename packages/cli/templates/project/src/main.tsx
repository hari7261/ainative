import React from 'react';
import ReactDOM from 'react-dom/client';
import { AIAppComponent, AIInput, AIStreamList } from '@hari7261/ainative-client';
import './style.css';

function App() {
  const config = {
    apiUrl: 'http://localhost:3001',
    streamMethod: 'SSE' as const,
    debug: true,
  };

  return (
    <AIAppComponent config={config}>
      {(state, app) => (
        <div className="starter-shell">
          <header className="starter-header">
            <span className="starter-product">AINative</span>
          </header>

          <main className="starter-main">
            <div className="starter-stage">
              {state.messages.length > 0 ? (
                <section className="starter-messages">
                  <AIStreamList messages={state.messages} className="starter-stream-list" />
                </section>
              ) : null}

              {state.error ? (
                <div className="starter-error">
                  <strong>Error:</strong> {state.error.message}
                </div>
              ) : null}

              <section className="starter-composer">
                <AIInput
                  className="starter-input"
                  placeholder="Type your message here..."
                  disabled={state.streaming}
                  enableAudio={true}
                  enableFile={true}
                  footerHint=""
                  onSubmit={(message, attachments, meta) => {
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
                />
              </section>
            </div>
          </main>
        </div>
      )}
    </AIAppComponent>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
