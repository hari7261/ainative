# AINative Starter Template

Welcome to your new AINative project. This starter ships with a minimal prompt-first interface: centered product header, focused composer, and streaming replies that stay out of the way until you need them.

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

- Prompt-first starter surface with the product name centered at the top
- Search, Think, and Canvas controls in the composer
- File attachments and voice-note capture
- Streaming replies that appear above the composer after the first request
- Minimal responsive layout designed to feel polished from the first run

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

- header text
- prompt behavior and modes
- provider context passed to the runtime
- layout around the built-in message stream and composer

### Styling

Edit `src/style.css` to adapt the page framing, gradient backdrop, spacing, and responsive behavior around the built-in AINative components.

## Learn more

- [AINative Documentation](https://github.com/hari7261/ainative)
- [Component API](../../docs/component-api.md)
- [Server API](../../docs/server-api.md)
- [Streaming Guide](../../docs/streaming.md)

## License

MIT
