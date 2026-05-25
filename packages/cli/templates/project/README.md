# AINative Starter Template

Welcome to your new AINative project. This starter ships with the framework's built-in Studio-style chat workspace and a clean, production-friendly default UI.

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment

Create a `.env` file in the root directory:

```env
OPENAI_API_KEY=sk-your-api-key-here
# or
ANTHROPIC_API_KEY=sk-ant-your-api-key-here
```

### 3. Start development

Terminal 1:

```bash
npm run server
```

Terminal 2:

```bash
npm run dev
```

Then open `http://localhost:5173`.

## What you get

- Built-in `AIPane` workspace from `@hari7261/ainative-client`
- Search, Think, and Canvas prompt modes
- File attachments and voice-note capture
- Request counts, recent events, and streaming status in the UI
- Clean responsive light theme ready for product work

## Project structure

```text
├── src/
│   ├── main.tsx
│   ├── server.ts
│   └── style.css
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Available scripts

- `npm run dev` - Start the Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run server` - Start the AI server

## Customization

### Changing AI provider

Edit `src/server.ts` to configure your preferred provider.

### Adapting the workspace

Edit `src/main.tsx` to customize:

- header and footer copy
- prompt behavior and modes
- provider context passed to the runtime
- layout around the built-in chat workspace

### Styling

Edit `src/style.css` to adapt spacing, typography, and page framing around the built-in AINative components.

## Learn more

- [AINative Documentation](https://github.com/hari7261/ainative)
- [Component API](../../docs/component-api.md)
- [Server API](../../docs/server-api.md)
- [Streaming Guide](../../docs/streaming.md)

## License

MIT
