# AINative Starter Template

Welcome to your new AINative project! This template provides a production-ready AI chat interface with advanced features.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2. Set Up Environment

Create a `.env` file in the root directory:

```env
OPENAI_API_KEY=sk-your-api-key-here
# or
ANTHROPIC_API_KEY=sk-ant-your-api-key-here
```

### 3. Start Development

Open two terminal windows:

**Terminal 1 - Start the AI server:**
```bash
npm run server
```

**Terminal 2 - Start the dev server:**
```bash
npm run dev
```

Visit `http://localhost:5173` to see your app!

## ✨ Features

This template includes:

### 🎨 Advanced Prompt Input Box
- **Multi-Modal Input**: Text, images, and voice messages
- **Drag & Drop**: Simply drag images into the chat
- **Paste Support**: Copy and paste images directly from clipboard
- **File Upload**: Browse and select images (up to 10MB)

### 🎯 Smart Modes
- **Search Mode** 🌐: Enable web search capabilities
- **Think Mode** 🧠: Deep reasoning and analysis
- **Canvas Mode** 📁: Code generation and editing

### 🎤 Voice Recording
- Click to start/stop recording voice messages
- Visual indicator when recording is active

### 🎭 Modern UI
- Built with Radix UI primitives for accessibility
- Smooth animations with Framer Motion
- Responsive design for mobile and desktop
- Helpful tooltips on all controls
- Full-screen image preview

## 📁 Project Structure

```
├── src/
│   ├── main.tsx              # Main app component
│   ├── PromptInputBox.tsx    # Advanced prompt input component
│   ├── server.ts             # AI server configuration
│   └── style.css             # Styling
├── index.html                # HTML entry point
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run server` - Start AI server

## 🎨 Customization

### Changing AI Provider

Edit `src/server.ts` to configure your preferred AI provider:

```typescript
const server = createServer({
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
  },
  // or use Anthropic
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || '',
  },
  defaultProvider: 'openai', // or 'anthropic'
  port: 3001,
});
```

### Styling

All styles are in `src/style.css`. The template uses CSS custom properties for easy theming:

```css
:root {
  --bg: #07111f;
  --text: #eff6ff;
  --accent: #61d9ff;
  /* ... and more */
}
```

### Adding More Features

The `PromptInputBox` component is fully customizable. Check `src/PromptInputBox.tsx` to:
- Add more toggle modes
- Customize file upload limits
- Add more input types
- Modify UI behavior

## 📚 Learn More

- [AINative Documentation](https://github.com/hari7261/ainative)
- [Component API](../../docs/component-api.md)
- [Server API](../../docs/server-api.md)
- [Streaming Guide](../../docs/streaming.md)

## 🤝 Contributing

Found a bug or want to contribute? Visit the [main repository](https://github.com/hari7261/ainative).

## 📄 License

MIT
