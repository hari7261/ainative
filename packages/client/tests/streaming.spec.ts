import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EventBus } from '../src/runtime/events';
import { StreamingEngine } from '../src/runtime/streaming';

function createStreamResponse(chunks: string[]) {
  const encoder = new TextEncoder();
  let index = 0;

  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    body: {
      getReader() {
        return {
          async read() {
            if (index >= chunks.length) {
              return { done: true, value: undefined };
            }

            const value = encoder.encode(chunks[index]);
            index += 1;
            return { done: false, value };
          },
        };
      },
    },
  };
}

describe('StreamingEngine', () => {
  let eventBus: EventBus;
  let engine: StreamingEngine;

  beforeEach(() => {
    eventBus = new EventBus();
    engine = new StreamingEngine(eventBus);
    vi.restoreAllMocks();
  });

  it('parses SSE token payloads and emits stream events', async () => {
    const tokens: string[] = [];
    const endings: string[] = [];

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        createStreamResponse([
          'data: {"type":"token","data":"Hello"}\n\n',
          'data: {"type":"token","data":" world"}\n\n',
          'data: [DONE]\n\n',
        ])
      )
    );

    eventBus.on('stream-data', ({ payload }) => {
      if (payload.token) {
        tokens.push(payload.token);
      }
    });

    eventBus.on('stream-end', ({ payload }) => {
      endings.push(payload.reason);
    });

    await engine.start({ url: 'http://localhost:3001/ai/stream', method: 'SSE' }, { action: 'chat' });

    expect(tokens).toEqual(['Hello', ' world']);
    expect(endings).toContain('complete');
    expect(engine.isActive()).toBe(false);
  });

  it('reuses the original payload when reconnecting after an error', async () => {
    const calls: any[] = [];
    let attempt = 0;

    vi.useFakeTimers();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async (_url: string, options: any) => {
        calls.push(JSON.parse(options.body));
        attempt += 1;

        if (attempt === 1) {
          throw new Error('temporary failure');
        }

        return createStreamResponse(['data: [DONE]\n\n']);
      })
    );

    const startPromise = engine.start(
      {
        url: 'http://localhost:3001/ai/stream',
        method: 'SSE',
        reconnect: true,
        reconnectDelay: 10,
      },
      { action: 'chat', params: { message: 'retry me' } }
    );

    await vi.advanceTimersByTimeAsync(20);
    await startPromise;
    vi.useRealTimers();

    expect(calls).toHaveLength(2);
    expect(calls[0]).toEqual(calls[1]);
  });
});
