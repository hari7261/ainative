# Getting Started with AINative

## What is AINative?

AINative is a React-compatible, AI-native frontend framework where LLMs control UI state, components re-render based on model output, and token streaming is natively supported.

## Features

- 🤖 **AI-Driven State**: LLMs directly control application state
- 🌊 **Native Streaming**: Token-by-token streaming with SSE and WebSocket support
- 🎯 **React Compatible**: Familiar React component model
- 🔌 **Backend Agnostic**: Works with any LLM provider
- 📹 **Multimodal**: Built-in support for text, audio, images, and files
- ⚡ **Fast DX**: Powered by Vite/ESBuild for instant feedback
- 🛠️ **Tool System**: Execute functions from LLM output
- 📦 **Monorepo**: Client, server adapters, and CLI in one place

## Quick Start

### Installation

```bash
npm install -g @hari7261/ainative-cli
```

### Create a New Project

```bash
ainative init my-app
cd my-app
npm install
```

### Set Up Environment

Create a `.env` file:

```bash
OPENAI_API_KEY=your-api-key-here
```

### Start Development

```bash
# Terminal 1: Start the AI server
npm run server

# Terminal 2: Start the dev server
npm run dev
```

Visit `http://localhost:5173` to see your app!

## Basic Example

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AIAppComponent } from '@hari7261/ainative-client';
import { PromptInputBox } from './PromptInputBox';

function App() {
  const [input, setInput] = React.useState('');

  const config = {
    apiUrl: 'http://localhost:3001',
    streamMethod: 'SSE' as const,
  };

  return (
    <AIAppComponent config={config}>
      {(state, app) => (
        <div>
          {/* Display messages */}
          {state.messages.map((msg, idx) => (
            <div key={idx}>
              <strong>{msg.role}:</strong> {msg.content}
            </div>
          ))}

          {/* Advanced prompt input with multi-modal support */}
          <PromptInputBox
            input={input}
            setInput={setInput}
            onSend={(message, files) => {
              app.sendMessage(message, { stream: true });
              setInput('');
            }}
            placeholder="Type your message..."
            disabled={state.streaming}
          />
        </div>
      )}
    </AIAppComponent>
  );
}
```

The `ainative init` command creates a fully-featured template with:
- Advanced prompt input box with image uploads
- Voice recording capabilities
- Search, Think, and Canvas modes
- Drag & drop and paste support for images
- Modern UI with Radix UI and Framer Motion

## Next Steps

- [Installation Guide](./installation.md)
- [Architecture Overview](./architecture.md)
- [Component API](./component-api.md)
- [Server Setup](./server-api.md)
- [Examples](../examples/)
