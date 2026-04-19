# AINative: The AI-Driven Interface Framework

**AINative is a domain-specific micro-framework** (rather than just a traditional library) designed to standardize and simplify the process of building AI/LLM-driven full-stack applications.

## What Is It?
Instead of manually wiring together generic UI frameworks, backend routing, and complex text streaming protocols, AINative offers an end-to-end architecture (React on the frontend and an Express/FastAPI adapter on the backend) tailored specifically for LLM streaming, multimodal inputs, and prompt UI states.

## Why Is It Helpful?
Building an AI application typically involves repetitive tasks such as maintaining chat state histories perfectly in sync with the backend memory, parsing chunked data streams in React, updating loading states gracefully, handling errors natively mid-stream, and invoking system tools.
AINative simplifies this by providing ready-made client-side runtimes, components, and server-side routes that natively understand AI interactions, freeing you to focus only on building your domain tools and prompts.

## How Does It Work?
AINative embraces "Inversion of Control". You inject the `<AIApp>` provider into your React application and set up an `AINativeServer` on your backend. When components trigger user prompts (eg: `<AIInput>`), the system takes over. The data is securely ferried backwards via the server adapter to the given AI model. The response payload is then streamed down to the `<AIStream>` components natively, parsing functions and text outputs synchronously into your view tree.

---

## What is in this repo

- `packages/client`: runtime, components, multimodal helpers, and client-side tests
- `packages/server-node`: Express-based AI server with provider adapters and tool routing
- `packages/server-python`: FastAPI-based server adapter
- `packages/cli`: project scaffolding and developer commands
- `examples/basic-chat`: end-to-end example used by Playwright
- `examples/streaming-demo`: local streaming demo
- `docs`: framework and package documentation

## Current provider support

- OpenAI
- Anthropic
- Ollama

The example apps also support a local fallback response path so they can run without external API keys.

## Quick start

### Requirements

- Node.js 18+
- pnpm 8+
- Python 3.10+

### Install

```bash
corepack pnpm install
```

### Build everything

```bash
corepack pnpm run build
```

### Run tests

```bash
corepack pnpm test
corepack pnpm run test:e2e
```

## Run the example

### Basic chat

Terminal 1:

```bash
corepack pnpm run server:basic-chat
```

Terminal 2:

```bash
corepack pnpm run dev:basic-chat
```

Then open `http://127.0.0.1:5173`.

## CLI

The CLI currently supports:

- `ainative init`
- `ainative dev`
- `ainative build`
- `ainative preview`
- `ainative doctor`
- `ainative add-provider`

Install the CLI after publish:

```bash
npm install -g @hari7261/ainative-cli
```

Smoke check:

```bash
corepack pnpm --dir packages/cli exec node dist/index.js --help
```

## Repo validation status

The repo has been validated locally with:

- monorepo build
- client unit tests
- Node server tests
- Python server smoke test
- Playwright end-to-end tests for `basic-chat`
- CLI help and doctor smoke checks

## Documentation

- [Getting Started](./docs/getting-started.md)
- [Installation](./docs/installation.md)
- [Architecture](./docs/architecture.md)
- [Runtime](./docs/runtime.md)
- [Component API](./docs/component-api.md)
- [Server API](./docs/server-api.md)
- [Streaming](./docs/streaming.md)
- [Providers](./docs/providers.md)
- [Tools and Actions](./docs/tools-and-actions.md)
- [CLI](./docs/cli.md)
- [Publishing](./docs/publishing.md)
- [Contributing](./docs/contributing.md)

## Notes

- `PROJECT-PROMPT.md` is kept as a repo-local specification/reference file.
- Python tests may still show third-party dependency warnings on some machines, but the server test itself passes.
