import React from 'react';
import ReactDOM from 'react-dom/client';
import { AIAppComponent, AIPane } from '@ainative/client';

function App() {
  return (
    <AIAppComponent
      config={{
        apiUrl: 'http://localhost:3002',
        streamMethod: 'SSE',
        debug: true,
      }}
    >
      {(state, app) => (
        <AIPane
          state={state}
          onSendMessage={(message) => app.sendMessage(`stream:${message}`, { stream: true })}
          title="Streaming Demo"
          subtitle="Token-by-token local streaming"
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
