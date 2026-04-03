# AINative 🤖

> A React-compatible AI-native frontend framework where LLMs control the UI.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![npm version](https://badge.fury.io/js/@ainative%2Fclient.svg)](https://www.npmjs.com/package/@ainative/client)

## Overview

AINative is a complete, production-ready framework for building AI-driven applications. Instead of writing imperative UI logic, you let language models control your application state while you focus on the user experience.

### Key Features

- 🤖 **AI-Driven State** - LLMs directly control application state
- 🌊 **Native Streaming** - Token-by-token updates with SSE and WebSocket support
- ⚛️ **React Compatible** - Familiar React component model
- 🔌 **Backend Agnostic** - Works with OpenAI, Anthropic, Ollama, and more
- 🎬 **Multimodal** - Built-in support for text, audio, images, and files
- ⚡ **Fast DX** - Powered by Vite for instant feedback
- 🛠️ **Tool System** - Let LLMs execute functions and interact with systems
- 📦 **Monorepo** - Client, servers, and CLI in one place

## Quick Start

### Installation

```bash
npm install -g @ainative/cli
```

### Create Project

```bash
ainative init my-app
cd my-app
npm install
```

### Configure

Create `.env`:

```bash
OPENAI_API_KEY=sk-your-key-here
```

### Run

```bash
# Terminal 1: Start AI server
npm run server

# Terminal 2: Start dev server
npm run dev
```

Visit `http://localhost:5173`!

## Example

```tsx
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
          onSendMessage={(msg) => app.sendMessage(msg)}
          title="AI Assistant"
        />
      )}
    </AIAppComponent>
  );
}
```

## Architecture

```
┌─────────────────────────────────────┐
│   Browser (React + AINative)        │
│   - Components                      │
│   - Streaming Engine                │
│   - State Reconciler                │
└──────────────┬──────────────────────┘
               │ HTTP/SSE/WS
┌──────────────▼──────────────────────┐
│   Server (Node.js or Python)        │
│   - Provider Adapters               │
│   - Tool Registry                   │
│   - Streaming Manager               │
└──────────────┬──────────────────────┘
               │ API
┌──────────────▼──────────────────────┐
│   LLM Providers                     │
│   OpenAI │ Anthropic │ Ollama      │
└─────────────────────────────────────┘
```

## Packages

- **[@ainative/client](./packages/client)** - React runtime and components
- **[@ainative/server-node](./packages/server-node)** - Node.js server adapter
- **[@ainative/server-python](./packages/server-python)** - Python server adapter
- **[@ainative/cli](./packages/cli)** - Command-line tool

## Documentation

- [Getting Started](./docs/getting-started.md)
- [Installation](./docs/installation.md)
- [Architecture](./docs/architecture.md)
- [Component API](./docs/component-api.md)
- [Server API](./docs/server-api.md)
- [Streaming](./docs/streaming.md)
- [Tools and Actions](./docs/tools-and-actions.md)
- [CLI Reference](./docs/cli.md)

## Examples

- [Basic Chat](./examples/basic-chat) - Simple chat interface
- [Streaming Demo](./examples/streaming-demo) - Advanced streaming features

## Development

### Setup

```bash
git clone https://github.com/hari7261/ainative.git
cd ainative
pnpm install
```

### Build

```bash
pnpm build
```

### Test

```bash
pnpm test
```

### Run Example

```bash
cd examples/basic-chat
pnpm install
pnpm run server  # Terminal 1
pnpm run dev     # Terminal 2
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT © [AINative Contributors](./LICENSE)

## Community

- [GitHub Issues](https://github.com/hari7261/ainative/issues)
- [Discussions](https://github.com/hari7261/ainative/discussions)

---

**Built with ❤️ by the AINative community**
