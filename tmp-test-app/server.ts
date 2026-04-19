import { createServer } from '@hari7261/ainative-server-node';

const server = createServer({
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
  },
  defaultProvider: 'openai',
  port: 3001,
});

server.listen();
