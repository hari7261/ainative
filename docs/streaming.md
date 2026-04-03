# Streaming Guide

## Overview

AINative provides native, first-class support for token-by-token streaming from LLMs.

## Streaming Methods

### Server-Sent Events (SSE)

Default method. Works over HTTP with automatic reconnection.

```typescript
const config = {
  apiUrl: 'http://localhost:3001',
  streamMethod: 'SSE' as const,
};
```

**Pros:**
- Simple HTTP connection
- Automatic reconnection
- Wide browser support

**Cons:**
- Unidirectional (server to client)

### WebSockets

Bidirectional streaming for advanced use cases.

```typescript
const config = {
  apiUrl: 'http://localhost:3001',
  streamMethod: 'WS' as const,
};
```

**Pros:**
- Bidirectional communication
- Lower latency
- Better for long-running connections

**Cons:**
- More complex setup
- Requires WebSocket support

### Auto

Automatically selects the best method.

```typescript
const config = {
  streamMethod: 'AUTO' as const,
};
```

## Client-Side Streaming

### Using AIApp

```tsx
<AIAppComponent config={config}>
  {(state, app) => (
    <div>
      {state.streaming && <div>Streaming...</div>}
      <button onClick={() => app.sendMessage('Hello', { stream: true })}>
        Send
      </button>
    </div>
  )}
</AIAppComponent>
```

### Manual Streaming

```typescript
import { StreamingEngine, EventBus } from '@hari7261/ainative-client';

const eventBus = new EventBus();
const streaming = new StreamingEngine(eventBus);

// Listen for tokens
eventBus.on('stream-data', ({ payload }) => {
  console.log('Token:', payload.token);
});

// Start streaming
await streaming.start({
  url: 'http://localhost:3001/ai/stream',
  method: 'SSE',
}, {
  action: 'chat',
  params: { message: 'Hello' },
});
```

## Server-Side Streaming

### Node.js

```typescript
import { StreamManager } from '@hari7261/ainative-server-node';

app.post('/ai/stream', async (req, res) => {
  const stream = new StreamManager(res);

  try {
    const generator = provider.generate({
      prompt: req.body.message,
      stream: true,
    });

    for await (const token of generator) {
      stream.sendToken(token);
    }

    stream.sendDone();
  } catch (error) {
    stream.sendError(error.message);
    stream.sendDone();
  }
});
```

### Python

```python
from ainative.streaming import stream_tokens

@app.post("/ai/stream")
async def stream_handler(request: ActionRequest):
    generator = provider.generate(
        prompt=request.params["message"],
        stream=True,
    )

    return StreamingResponse(
        stream_tokens(generator),
        media_type="text/event-stream",
    )
```

## Stream Message Format

SSE messages follow this format:

```
data: {"type":"token","data":"Hello"}
data: {"type":"token","data":" world"}
data: {"type":"metadata","data":{"model":"gpt-4"}}
data: {"type":"done"}
data: [DONE]
```

## Error Handling

Handle streaming errors:

```typescript
eventBus.on('stream-error', ({ payload }) => {
  console.error('Stream error:', payload.error);
});

eventBus.on('stream-end', ({ payload }) => {
  if (payload.reason === 'error') {
    // Handle error
  }
});
```

## Cancellation

Stop streaming at any time:

```typescript
app.stopStreaming();
```

## Backpressure

The streaming engine handles backpressure automatically:

- Buffers tokens when UI can't keep up
- Throttles updates for performance
- Batches rapid updates

## Performance Tips

1. **Use batching for rapid tokens:**

```typescript
const reconciler = new AIReconciler(stateManager, eventBus);
reconciler.applyPatch(patch, { batching: true, batchDelay: 16 });
```

2. **Limit re-renders:**

Use `React.memo` for message components:

```tsx
const AIMessage = React.memo(({ message }) => {
  return <div>{message.content}</div>;
});
```

3. **Virtual scrolling for long conversations:**

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

const virtualizer = useVirtualizer({
  count: messages.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 50,
});
```

## Testing Streaming

```typescript
import { test } from 'vitest';

test('streaming works', async () => {
  const tokens: string[] = [];

  eventBus.on('stream-data', ({ payload }) => {
    tokens.push(payload.token);
  });

  await streaming.start(config, data);

  expect(tokens.length).toBeGreaterThan(0);
});
```
