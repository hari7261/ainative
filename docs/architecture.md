# AINative Architecture

## Overview

AINative is built as a monorepo with multiple packages working together to provide a complete AI-native development experience.

## System Architecture

```
┌─────────────────────────────────────────────────┐
│                   Browser                        │
│  ┌──────────────────────────────────────────┐  │
│  │     @hari7261/ainative-client             │  │
│  │  ┌────────────────────────────────────┐  │  │
│  │  │  React Components                   │  │  │
│  │  │  (AIApp, AIInput, AIStream)         │  │  │
│  │  └────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────┐  │  │
│  │  │  Runtime                            │  │  │
│  │  │  - State Manager                    │  │  │
│  │  │  - Event Bus                        │  │  │
│  │  │  - Streaming Engine                 │  │  │
│  │  │  - Reconciler                       │  │  │
│  │  └────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                      ↕ HTTP/SSE/WS
┌─────────────────────────────────────────────────┐
│                   Server                         │
│  ┌──────────────────────────────────────────┐  │
│  │ @hari7261/ainative-server-node OR        │  │
│  │    Python server adapter                 │  │
│  │  ┌────────────────────────────────────┐  │  │
│  │  │  API Endpoints                      │  │  │
│  │  │  /ai/action, /ai/stream, /ai/tool   │  │  │
│  │  └────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────┐  │  │
│  │  │  Provider Layer                     │  │  │
│  │  │  - OpenAI                           │  │  │
│  │  │  - Anthropic                        │  │  │
│  │  │  - Ollama                           │  │  │
│  │  └────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────┐  │  │
│  │  │  Tool Registry                      │  │  │
│  │  └────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                      ↕ API
┌─────────────────────────────────────────────────┐
│                LLM Providers                     │
│  OpenAI | Anthropic | Ollama | Google          │
└─────────────────────────────────────────────────┘
```

## Core Concepts

### 1. Client Runtime

The client runtime manages the entire application lifecycle:

- **State Manager**: Maintains AI-driven state with history
- **Event Bus**: Pub/sub system for component communication
- **Streaming Engine**: Handles SSE/WebSocket connections
- **Reconciler**: Applies AI model updates to state
- **Renderer**: React integration layer

### 2. Component System

React components that react to AI state changes:

- `AIApp`: Root application wrapper
- `AIInput`: Enhanced input with multimodal support
- `AIStream`: Displays streaming responses
- `AIPane`: Complete chat interface

### 3. Server Adapters

Backend implementations supporting multiple runtimes:

- **Node.js**: Express-based server
- **Python**: FastAPI-based server

### 4. Provider Layer

Unified interface for LLM providers:

- Streaming and non-streaming modes
- Error normalization
- Retry logic
- Token yield interface

### 5. Tool System

Execute functions from LLM output:

- JSON schema definitions
- Server-side registry
- Client-to-server communication
- State injection after execution

## Data Flow

### Message Flow

1. User types message in `AIInput`
2. Client sends to `/ai/stream` endpoint
3. Server forwards to LLM provider
4. Provider streams tokens back
5. Streaming engine receives tokens
6. Reconciler updates state
7. React components re-render

### State Updates

1. AI model generates state update
2. Reconciler receives update
3. Patches are validated
4. State manager applies changes
5. Listeners are notified
6. Components re-render

## Package Structure

```
packages/
├── client/           # React runtime and components
│   ├── runtime/      # Core runtime logic
│   ├── components/   # React components
│   └── multimodal/   # Audio, image, file handlers
├── server-node/      # Node.js server
│   ├── adapters/     # LLM provider adapters
│   └── router.ts     # API endpoints
├── server-python/    # Python server
│   └── ainative/     # FastAPI implementation
└── cli/              # Command-line tool
    └── commands/     # CLI commands
```

## Design Principles

1. **AI-First**: State is driven by AI, not imperative code
2. **Streaming Native**: Token-by-token updates are first-class
3. **Backend Agnostic**: Works with any LLM provider
4. **Developer Experience**: Fast, simple, modern tooling
5. **Progressive Enhancement**: Start simple, add complexity as needed
