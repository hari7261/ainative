import { afterEach, describe, expect, it } from 'vitest';
import { createServer } from '../src/server';

describe('AINativeServer', () => {
  let listener: any = null;

  afterEach(() => {
    listener?.close?.();
    listener = null;
  });

  it('returns a fallback action response when no provider is configured', async () => {
    const serverInstance = createServer({
      fallbackResponse: (_action, params) => `Echo: ${params.message}`,
    });

    listener = serverInstance.getApp().listen(3101);

    const response = await fetch('http://127.0.0.1:3101/ai/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'chat',
        params: { message: 'hello' },
        context: { messages: [] },
      }),
    });

    const payload = await response.json();
    expect(payload.messages[0].content).toBe('Echo: hello');
  });
});
