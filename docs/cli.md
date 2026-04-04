# CLI

AINative ships a lightweight CLI in `packages/cli`.

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
- `src/PromptInputBox.tsx` - Advanced prompt input component with multi-modal support
- `src/server.ts` - AI server configuration
- `src/style.css` - Modern, responsive styling
- `index.html` - HTML entry point
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` - Dependencies including Radix UI, Framer Motion, and Lucide icons

### Template Features

The default template includes:

- **Multi-Modal Input**: Support for text, images (drag & drop, paste, upload)
- **Voice Recording**: Click-to-record voice messages
- **Smart Modes**: Toggle between Search, Think, and Canvas modes for specialized AI interactions
- **Modern UI**: Built with Radix UI primitives and smooth Framer Motion animations
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Tooltips**: Helpful tooltips on all interactive elements
- **Image Preview**: Full-screen image viewer for uploaded files
