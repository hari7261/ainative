import { createServer } from '@ainative/server-node';

const server = createServer({
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: 'gpt-4o',
  },
  defaultProvider: 'openai',
  port: 3001,
  cors: true,
  registerBuiltInTools: true,
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
