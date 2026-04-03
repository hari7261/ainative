import React from 'react';
import ReactDOM from 'react-dom/client';
import { AIAppComponent, AIPane } from '@ainative/client';

function App() {
  const config = {
    apiUrl: 'http://localhost:3001',
    streamMethod: 'SSE' as const,
  };

  return (
    <AIAppComponent config={config}>
      {(state, app) => (
        <AIPane
          state={state}
          onSendMessage={(message) => app.sendMessage(message, { stream: true })}
          title="AINative Starter"
          subtitle="Start building your AI-native app"
        />
      )}
    </AIAppComponent>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
