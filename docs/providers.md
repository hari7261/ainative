# Providers

AINative currently ships adapters for these Node server providers:

- OpenAI
- Anthropic
- Ollama

## Choosing a provider

- Use OpenAI when you want hosted multimodal models and production APIs.
- Use Anthropic when your workload favors Claude models.
- Use Ollama for local development and offline-compatible demos.

## Example configuration

```ts
import { createServer } from '@hari7261/ainative-server-node';

const server = createServer({
  openai: {
    apiKey: process.env.OPENAI_API_KEY!,
    model: 'gpt-4o',
  },
  defaultProvider: 'openai',
});
```

## No-key local mode

If you do not provide a hosted model configuration, the example servers can use a local fallback responder so the UI and streaming pipeline remain testable without external credentials.
