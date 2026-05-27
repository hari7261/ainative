# CLI

AINative ships a lightweight CLI in `packages/cli`.

## Install and run

Recommended:

```bash
npx @hari7261/ainative-cli init my-app
```

Optional global install:

```bash
npm install -g @hari7261/ainative-cli
```

Windows note: if global install fails with `EPERM` in `C:\Program Files\nodejs\node_modules`, use `npx`, run your shell as Administrator, or set npm's global prefix to a user-writable location such as `%APPDATA%\\npm`.

## Commands

### `ainative init [name]`

Creates a starter project from the bundled template.

Options:

- `-t, --template <template>`: currently kept for compatibility, defaults to `basic`

### `ainative dev`

Runs the current project's dev script.

Options:

- `-p, --port <port>`: accepted by the command surface, though the current implementation delegates to the project script

### `ainative build`

Runs the current project's build script.

Options:

- `-o, --output <dir>`: accepted by the command surface, though the current implementation delegates to the project script

### `ainative preview`

Runs the current project's preview script.

Options:

- `-p, --port <port>`: forwards `--port` to the preview command

### `ainative doctor`

Checks for:

- Node.js
- npm
- Git

### `ainative add-provider <name>`

Prints the environment variables needed for:

- `openai`
- `anthropic`
- `ollama`

## Local development

Build the CLI:

```bash
corepack pnpm --dir packages/cli run build
```

Run tests:

```bash
corepack pnpm --dir packages/cli test
```

Smoke check the built binary:

```bash
corepack pnpm --dir packages/cli exec node dist/index.js --help
```

## Template output

The bundled template includes:

- `src/main.tsx` - Main application component with AI workspace
- `src/server.ts` - AI server configuration
- `src/style.css` - Clean, responsive styling
- `index.html` - HTML entry point
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` - Minimal React, Vite, and AINative dependencies

### Template Features

The default template includes:

- **Built-in Workspace**: Uses AINative's first-party `AIPane` surface directly
- **Multi-Modal Input**: Support for text, files, and voice notes
- **Voice Recording**: Click-to-record voice messages
- **Smart Modes**: Toggle between Search, Think, and Canvas modes for specialized AI interactions
- **Runtime Visibility**: Request counts, recent events, and streaming status in the interface
- **Professional UI**: Clean light workspace designed for real product use
- **Responsive Design**: Works seamlessly on desktop and mobile devices
