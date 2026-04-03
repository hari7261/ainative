# CLI Reference

## Commands

### ainative init

Initialize a new AINative project.

```bash
ainative init [name] [options]
```

**Arguments:**
- `name` - Project name (optional, will prompt if not provided)

**Options:**
- `-t, --template <template>` - Template to use (default: 'basic')

**Examples:**
```bash
# Interactive mode
ainative init

# With project name
ainative init my-app

# With template
ainative init my-app --template streaming
```

### ainative dev

Start the development server.

```bash
ainative dev [options]
```

**Options:**
- `-p, --port <port>` - Port number (default: 3000)

**Example:**
```bash
ainative dev --port 5173
```

### ainative build

Build the project for production.

```bash
ainative build [options]
```

**Options:**
- `-o, --output <dir>` - Output directory (default: 'dist')

**Example:**
```bash
ainative build --output build
```

### ainative doctor

Check system dependencies and configuration.

```bash
ainative doctor
```

Checks:
- Node.js version
- npm/pnpm version
- Git installation
- Environment variables
- Package installations

**Example output:**
```
🔍 AINative Doctor

✓ Node.js v20.11.0
✓ npm 10.2.4
✓ Git 2.42.0

All checks passed!
```

## Configuration

### Project Structure

After running `ainative init`, your project will have:

```
my-app/
├── src/
│   ├── main.tsx        # Client entry point
│   └── server.ts       # Server entry point
├── index.html          # HTML template
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
├── vite.config.ts      # Vite config
└── .env.example        # Environment template
```

### Environment Variables

Create a `.env` file:

```bash
# Required
OPENAI_API_KEY=sk-...

# Optional
ANTHROPIC_API_KEY=sk-ant-...
PORT=3001
NODE_ENV=development
```

## Templates

### basic (default)

Simple chat application with streaming.

### streaming

Advanced streaming demo with multiple providers.

### multimodal

Example with audio, image, and file support.

## Global Installation

Install globally for easy access:

```bash
npm install -g @ainative/cli
```

Or use with npx:

```bash
npx @ainative/cli init my-app
```

## Troubleshooting

### Command not found

If `ainative` command is not found after global install:

```bash
# Check global bin directory
npm config get prefix

# Add to PATH if needed
export PATH="$PATH:$(npm config get prefix)/bin"
```

### Permission errors

On Linux/Mac, you may need to use sudo:

```bash
sudo npm install -g @ainative/cli
```

Or configure npm to install globally without sudo:

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```
