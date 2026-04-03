import React from 'react';
import ReactDOM from 'react-dom/client';
import { AIAppComponent, AIPane } from '@ainative/client';
import './style.css';

function App() {
  const config = {
    apiUrl: 'http://localhost:3001',
    streamMethod: 'SSE' as const,
    debug: true,
  };

  return (
    <div className="app-container">
      <AIAppComponent config={config}>
        {(state, app) => (
          <AIPane
            state={state}
            onSendMessage={(msg, attachments) => {
              app.sendMessage(msg, { stream: true });
            }}
            title="Basic Chat Example"
            subtitle="Powered by AINative"
            enableAudio={true}
            enableImage={true}
            enableFile={true}
          />
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
