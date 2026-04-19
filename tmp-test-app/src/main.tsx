import React from 'react';
import ReactDOM from 'react-dom/client';
import { AIAppComponent, AIPane } from '@hari7261/ainative-client';

function App() {
  const config = {
    apiUrl: 'http://localhost:3001',
    streamMethod: 'SSE' as const,
    debug: true,
  };

  return (
    <AIAppComponent config={config}>
      {(state, app) => (
        <AIPane
          state={state}
          onSendMessage={(msg) => app.sendMessage(msg)}
          title="AI Assistant"
        />
      )}
    </AIAppComponent>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
