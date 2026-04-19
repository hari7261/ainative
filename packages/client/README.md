# @hari7261/ainative-client

**AINative** is a domain-specific micro-framework built for React. It is designed to take the pain out of building AI-driven user interfaces. 

## What is it?
This is the client runtime of the **AINative Framework**. Rather than just providing an API wrapper library, AINative offers a full React-based architecture that tightly integrates with your AI backend (Node.js or Python) to manage the entire lifecycle of LLM interactions.

## Why is it helpful?
Building AI chat interfaces requires dealing with complex state management, text streaming, UI reconciliation, and multimodal inputs (images, audio). AINative handles all of this out-of-the-box. 

It provides:
- **Automatic stream parsing:** Connects to the server and parses LLM text chunks as they arrive.
- **AI UI State Management:** Handles loading states, errors, tool calls, and conversation history automatically.
- **Multimodal support:** Built-in hooks and components for handling file/image/audio attachments.
- **Ready-to-use hooks & components:** Like `<AIApp>`, `<AIStream>`, and `useAIState()` so you focus on UI design, not network protocols.

## How it works
Inversion of Control: AINative's `<AIApp>` context acts as the central brain of your frontend. It maintains the message history and streaming reconciler. When a user sends a prompt via an AINative input component, the runtime automatically streams the request to your configured AINative server router, reconciling the live text stream back into the React component tree synchronously.

## Installation

```bash
npm install @hari7261/ainative-client
```

*(Note: Usually you will scaffold a full AINative app using our CLI: `npx @hari7261/ainative-cli init`)*

## Basic Usage

```tsx
import { AIApp, AIStream, AIInput } from '@hari7261/ainative-client/components';

export default function ChatApp() {
  return (
    <AIApp serverUrl="/api/chat">
      <div className="chat-container">
        <AIStream />
        <AIInput placeholder="Ask the AI something..." />
      </div>
    </AIApp>
  );
}
```

For full documentation, visit the [main AINative repository](https://github.com/hari7261/ainative).