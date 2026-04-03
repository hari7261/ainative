import { createServer } from '@hari7261/ainative-server-node';

const server = createServer({
  openai: process.env.OPENAI_API_KEY
    ? {
        apiKey: process.env.OPENAI_API_KEY,
        model: 'gpt-4o',
      }
    : undefined,
  defaultProvider: process.env.OPENAI_API_KEY ? 'openai' : undefined,
  port: 3001,
  cors: true,
  registerBuiltInTools: true,
  fallbackResponse: (_action, params) => {
    const message = params?.message || 'Hello from AINative';
    return `Local demo response: ${message}`;
  },
});

// Register custom tool
server.registerTool({
  name: 'greet',
  description: 'Greet the user',
  parameters: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'User name' },
    },
    required: ['name'],
  },
  handler: async (args: any) => {
    return `Hello, ${args.name}! Welcome to AINative!`;
  },
});

server.listen();

console.log('Basic chat server running on http://localhost:3001');
