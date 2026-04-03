import { createServer } from '@ainative/server-node';

const server = createServer({
  port: 3002,
  cors: true,
  fallbackResponse: (_action, params) => {
    const message = params?.message || 'hello';
    return `Streaming demo says: ${message}`;
  },
});

server.listen();

console.log('Streaming demo server running on http://localhost:3002');
