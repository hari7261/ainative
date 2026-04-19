# @hari7261/ainative-server-node

**AINative** is a domain-specific micro-framework designed to streamline the creation of AI/LLM-driven interfaces. 

## What is it?
This is the Node.js Server Adapter for the **AINative Framework**. It acts as the backend bridge that connects your AI UI (built with `@hari7261/ainative-client`) to major LLM providers (OpenAI, Anthropic, Ollama, etc.).

## Why is it helpful?
When building an AI app, securely managing API keys, standardizing tool/function execution, and handling chunked streaming over HTTP can be incredibly tedious. This package takes care of the backend heavy lifting:
- **Unified Provider API:** Swap between OpenAI, Anthropic, or local Ollama models with configuration changes instead of code rewrites.
- **Automated Streaming:** Standardizes server-sent events (SSE) so the frontend client can parse tokens perfectly.
- **Tool/Action Execution:** Securely routes LLM tool execution requests to your local backend functions.

## How it works
You define an `AINativeServer` instance and attach it to your existing Express codebase. This router registers the necessary endpoints that the AINative React client talks to. When the client sends a prompt, this server invokes the targeted LLM, processes the stream, and pipes it back to the client perfectly formatted for React UI reconciliation.

## Installation

```bash
npm install @hari7261/ainative-server-node
```

## Basic Usage (Express)

```typescript
import express from 'express';
import { AINativeServer } from '@hari7261/ainative-server-node';
import { OpenAIAdapter } from '@hari7261/ainative-server-node/adapters';

const app = express();

const aiServer = new AINativeServer({
  adapter: new OpenAIAdapter({ apiKey: process.env.OPENAI_API_KEY }),
  tools: [] // Register your backend functions here
});

app.use('/api/chat', aiServer.getRouter());

app.listen(3000, () => console.log('AINative backend running on port 3000'));
```

For full documentation, visit the [main AINative repository](https://github.com/hari7261/ainative).