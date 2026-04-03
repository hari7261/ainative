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

- `src/main.tsx`
- `src/server.ts`
- `index.html`
- `vite.config.ts`
- `tsconfig.json`
- `package.json`
