You are an expert senior architect and full-stack/AI systems engineer.
Your task is to generate a complete, production-ready AI-native frontend framework from scratch, including full source code, tests, documentation, build pipelines, examples, adapters, CLI tools, release setup, and GitHub-ready structure.

This framework will be called AINative (you may rename it if necessary for clarity).

Your output MUST include everything needed to clone, install, build, test, publish, and deploy the framework exactly like how mature frameworks such as Next.js, Astro, SvelteKit, and Bun structure their repositories.

Be exhaustive.
Be explicit.
Do not skip any file.
Do not handwave “placeholder code.”
Generate real, running code.

🔥 0. PROJECT GOAL (YOU MUST IMPLEMENT THIS EXACTLY)

Build a React-compatible AI-driven frontend framework where:

LLMs control the UI state
components re-render based on model output
token-streaming is natively supported
backend actions follow a standard contract
multimodal input is built-in (text, audio, image)
developers write less imperative logic
the framework is backend-agnostic
DX is fast, simple, modern (Vite/Esbuild dev server)

The framework includes:

Client Runtime
Component System
AI-State Reconciler
Streaming Engine (SSE + WS fallback)
Server Adapters (Node + Python)
Model Provider Layer
Tool/Action Execution Protocol
CLI
Examples
Tests
Documentation
Release Config
GitHub Repo Structure

You must output real, working, connected code.

📂 1. GENERATE COMPLETE MONOREPO STRUCTURE

Output this EXACT structure and fill EVERY SINGLE FILE with real content:

ainative/
  package.json
  tsconfig.json
  README.md
  LICENSE
  CHANGELOG.md
  CONTRIBUTING.md

  packages/
    client/
      package.json
      tsconfig.json
      src/
        index.ts
        runtime/
          app.ts
          renderer.ts
          reconciler.ts
          streaming.ts
          events.ts
          state.ts
          errors.ts
        components/
          AIApp.tsx
          AIInput.tsx
          AIStream.tsx
          AIPane.tsx
        multimodal/
          audio.ts
          image.ts
          file.ts
      tests/
        runtime.spec.ts
        streaming.spec.ts

    server-node/
      package.json
      tsconfig.json
      src/
        index.ts
        adapters/openai.ts
        adapters/anthropic.ts
        adapters/ollama.ts
        stream.ts
        router.ts
        tools.ts
        server.ts
      tests/
        server.spec.ts

    server-python/
      pyproject.toml
      ainative/
        __init__.py
        server.py
        tools.py
        providers/
          openai_provider.py
          ollama_provider.py
        streaming.py
      tests/
        test_server.py

    cli/
      package.json
      tsconfig.json
      src/
        index.ts
        commands/init.ts
        commands/dev.ts
        commands/build.ts
        commands/doctor.ts
        runner.ts
      templates/
        project/
          package.json
          tsconfig.json
          src/main.tsx

  docs/
    getting-started.md
    installation.md
    architecture.md
    runtime.md
    component-api.md
    server-api.md
    streaming.md
    providers.md
    tools-and-actions.md
    cli.md
    contributing.md
    publishing.md

  examples/
    basic-chat/
      package.json
      src/
        main.tsx
        server.ts
    streaming-demo/
      package.json
      src/
        main.tsx
        server.ts

  scripts/
    build-all.ts
    test-all.ts
    release.ts

  tests/
    e2e/
      playwright.config.ts
      test-basic-chat.spec.ts
⚙️ 2. IMPLEMENT CLIENT RUNTIME (FULL CODE)

Provide full TypeScript implementation of:

2.1 Runtime Core
createAIApp()
lifecycle management
hydration + rendering
deterministic state updates
2.2 Reconciler
diff algorithm
patch application
async-safe updates
2.3 Streaming Engine

Supports:

SSE
WebSockets fallback
token event parsing
abort + cancellation
backpressure
2.4 Event System

Handles:

component events
user→action calls
event serialization/deserialization
2.5 Multimodal

Full implementations:

audio recorder
image handler
file uploader
base64/capture utilities
2.6 Built-in Components

Real, complete implementations:

AIApp
AIInput
AIStream
AIPane

These must render UI reactively based on model state.

🖥️ 3. SERVER ADAPTERS (FULL CODE)

Implement complete working code for:

3.1 Node Server (Express or Fastify)

Endpoints:

POST /ai/action
POST /ai/stream
POST /ai/tool

Features:

streaming response generator
LLM providers
tool execution registry
JSON schema input validation
state merging logic

Providers:

OpenAI
Anthropic
Google Gemini
Ollama (local)
vLLM
3.2 Python Server (FastAPI)

Mirror Node features:

async streaming via yield
provider layer
tool execution
unified response protocol
🧠 4. MODEL PROVIDER LAYER

Implement unified API:

const model = provider("openai:gpt-4o");
model.generate({ prompt, stream: true });

Provider features:

retries
timeouts
cancellations
token yield interface
error normalization
🔧 5. ACTIONS / TOOLS SYSTEM

Define and implement:

JSON schema for tool calls
server-side tool registry
client-to-server tool events
state injection after tool result
streaming interplay
🧪 6. TESTING (FULL IMPLEMENTATION)

Generate:

6.1 Unit Tests

For:

runtime
streaming engine
reconciler
providers
6.2 Integration Tests

Node + Python servers tested against mock models.

6.3 E2E Tests (Playwright)

Full token-streaming validation.

Include:

server spin-up
client dev server
test harness scripts
🛠️ 7. CLI TOOL (FULL IMPLEMENTATION)

Commands:

ainative init <project>
ainative dev
ainative build
ainative preview
ainative doctor
ainative add-provider <name>

CLI must include:

template generator
dev server proxy
bundling commands (Vite or Esbuild)
validation output
pretty errors
📘 8. DOCUMENTATION (FULL CONTENT REQUIRED)

Write full documentation for:

Framework overview
Architecture
AI Components
Actions + Tools
Streaming Protocol
Model Providers
Deployment
Troubleshooting
Performance tuning
Examples explained

Docs MUST be complete and written like official framework docs.

🧪 9. EXAMPLE APPS (COMPLETE CODE)
9.1 basic-chat

Minimal example of:

UI
streaming
fast responses
state handling
9.2 streaming-demo

Demonstrates:

token flow
server actions
tools

Both examples must run end-to-end.

📦 10. RELEASE + PUBLISHING SETUP

Provide:

npm publish instructions
PyPI publish instructions
GitHub Actions CI/CD for:
build
lint
tests
publish on tag
versioning rules
tagging scheme
changelog generation
✔️ 11. FINAL REQUIREMENTS

Your output must:

include every file
include every line of code
produce valid, runnable TypeScript/Python
include instructions to install, build, test, and publish
look like a real large open-source framework repo
be ready to upload directly to GitHub
include no placeholders
generate no pseudo-code
include real implementations only

MASTER PROMPT ENDs