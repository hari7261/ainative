import { describe, it, expect, beforeEach } from 'vitest';
import { AIStateManager, AIState } from '../src/runtime/state';

describe('AIStateManager', () => {
  let stateManager: AIStateManager;

  beforeEach(() => {
    stateManager = new AIStateManager();
  });

  it('should initialize with empty state', () => {
    const state = stateManager.getState();
    expect(state.messages).toEqual([]);
    expect(state.context).toEqual({});
    expect(state.streaming).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should add messages correctly', () => {
    stateManager.addMessage({
      role: 'user',
      content: 'Hello',
    });

    const state = stateManager.getState();
    expect(state.messages).toHaveLength(1);
    expect(state.messages[0].content).toBe('Hello');
    expect(state.messages[0].role).toBe('user');
    expect(state.messages[0].id).toBeDefined();
  });

  it('should update messages by id', () => {
    stateManager.addMessage({
      role: 'assistant',
      content: 'Initial',
    });

    const messageId = stateManager.getState().messages[0].id;

    stateManager.updateMessage(messageId, {
      content: 'Updated',
    });

    const state = stateManager.getState();
    expect(state.messages[0].content).toBe('Updated');
  });

  it('should update context', () => {
    stateManager.updateContext({ userId: '123' });
    expect(stateManager.getState().context).toEqual({ userId: '123' });

    stateManager.updateContext({ sessionId: 'abc' });
    expect(stateManager.getState().context).toEqual({
      userId: '123',
      sessionId: 'abc',
    });
  });

  it('should notify listeners on state change', () => {
    let notifiedState: AIState | null = null;

    stateManager.subscribe((state) => {
      notifiedState = state;
    });

    stateManager.setStreaming(true);

    expect(notifiedState).not.toBeNull();
    expect(notifiedState?.streaming).toBe(true);
  });

  it('should support unsubscribe', () => {
    let callCount = 0;

    const unsubscribe = stateManager.subscribe(() => {
      callCount++;
    });

    stateManager.setStreaming(true);
    expect(callCount).toBe(1);

    unsubscribe();

    stateManager.setStreaming(false);
    expect(callCount).toBe(1); // Should not increase
  });

  it('should maintain history', () => {
    stateManager.addMessage({ role: 'user', content: 'Message 1' });
    stateManager.addMessage({ role: 'user', content: 'Message 2' });

    const history = stateManager.getHistory();
    expect(history.length).toBeGreaterThan(2);
  });

  it('should support undo', () => {
    stateManager.addMessage({ role: 'user', content: 'Message 1' });
    const stateAfterFirst = stateManager.getState();

    stateManager.addMessage({ role: 'user', content: 'Message 2' });

    stateManager.undo();

    const stateAfterUndo = stateManager.getState();
    expect(stateAfterUndo.messages).toHaveLength(stateAfterFirst.messages.length);
  });
});
