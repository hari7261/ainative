# Runtime

AINative runtime coordinates state, events, rendering, and streaming for AI-driven interfaces.

## Responsibilities

- Create and own application state through `createAIApp`.
- Dispatch actions to `/ai/action` and `/ai/stream`.
- Reconcile streamed tokens into assistant messages.
- Expose subscriptions so React components can re-render from model output.

## Key modules

- `runtime/app.ts`: top-level application object and action execution.
- `runtime/state.ts`: state updates, message history, and undo support.
- `runtime/events.ts`: internal event bus for action and streaming events.
- `runtime/reconciler.ts`: state patch merge and replacement logic.
- `runtime/streaming.ts`: SSE-first streaming with WebSocket fallback support.

## Runtime flow

1. User submits a message from `AIInput`.
2. `AIApp.sendMessage()` records the user message and starts a streamed action.
3. The streaming engine reads server events token by token.
4. The current assistant placeholder message is updated as tokens arrive.
5. `AIApp` clears stream listeners when the stream ends or errors.

## Local validation

```bash
npm test --workspace @ainative/client
```
