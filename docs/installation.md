# Installation

## Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0 or pnpm >= 8.0.0
- (Optional) Python >= 3.10 for Python server adapter

## Install CLI

Recommended:

```bash
npx @hari7261/ainative-cli init my-app
```

Optional global install:

```bash
npm install -g @hari7261/ainative-cli
```

## Create New Project

```bash
ainative init my-app
cd my-app
```

If you used `npx`, the full command is:

```bash
npx @hari7261/ainative-cli init my-app
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

If you are using `npx` instead of a global install:

```bash
npx @hari7261/ainative-cli doctor
```

## Windows global install troubleshooting

If you see an error like:

```text
EPERM: operation not permitted, mkdir 'C:\Program Files\nodejs\node_modules\@hari7261'
```

that means npm is trying to install the global package into a protected system directory without Administrator access.

Use one of these fixes:

1. Use `npx` and skip global install entirely:

```bash
npx @hari7261/ainative-cli init my-app
```

2. Run PowerShell as Administrator, then install globally:

```bash
npm install -g @hari7261/ainative-cli
```

3. Move npm global installs to your user directory:

```bash
npm config set prefix "$env:APPDATA\\npm"
npm install -g @hari7261/ainative-cli
```

Then make sure this directory is on your `PATH`:

```text
C:\Users\<your-user>\AppData\Roaming\npm
```

## Next Steps

- [Getting Started Guide](./getting-started.md)
- [Architecture Overview](./architecture.md)
- [Basic Example](../examples/basic-chat/)
