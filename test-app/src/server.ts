import { createServer } from '@hari7261/ainative-server-node';

const server = createServer({
  port: 3001,
  fallbackResponse: (_action, params) =>
    `Starter response: ${params?.message || 'Hello from the starter template.'}`,
});

server.listen();
