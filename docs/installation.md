# Installation

## Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0 or pnpm >= 8.0.0
- (Optional) Python >= 3.10 for Python server adapter

## Install CLI

```bash
npm install -g @hari7261/ainative-cli
```

## Create New Project

```bash
ainative init my-app
cd my-app
```

## Install Dependencies

```bash
npm install
# or
pnpm install
```

## Set Up Environment Variables

Create a `.env` file in your project root:

```bash
# OpenAI
OPENAI_API_KEY=sk-...

# Anthropic (optional)
ANTHROPIC_API_KEY=sk-ant-...

# Server port
PORT=3001
```

## Start Development

```bash
# Terminal 1: Start AI server
npm run server

# Terminal 2: Start dev server
npm run dev
```

## Manual Installation

If you prefer to set up manually:

### Client

```bash
npm install @hari7261/ainative-client react react-dom
```

### Node Server

```bash
npm install @hari7261/ainative-server-node express cors
```

### Python Server

```bash
pip install ainative-server
```

## Verify Installation

```bash
ainative doctor
```

This will check that all required dependencies are installed.

## Next Steps

- [Getting Started Guide](./getting-started.md)
- [Architecture Overview](./architecture.md)
- [Basic Example](../examples/basic-chat/)
