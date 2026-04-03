import { describe, it, expect, beforeEach } from 'vitest';
import { EventBus, AIEvent } from '../src/runtime/events';

describe('EventBus', () => {
  let eventBus: EventBus;

  beforeEach(() => {
    eventBus = new EventBus();
  });

  it('should emit and receive events', () => {
    let receivedEvent: AIEvent | null = null;

    eventBus.on('action', (event) => {
      receivedEvent = event;
    });

    eventBus.emit('action', { action: 'test', params: {} });

    expect(receivedEvent).not.toBeNull();
    expect(receivedEvent?.type).toBe('action');
    expect(receivedEvent?.payload.action).toBe('test');
  });

  it('should support multiple listeners', () => {
    let count1 = 0;
    let count2 = 0;

    eventBus.on('action', () => { count1++; });
    eventBus.on('action', () => { count2++; });

    eventBus.emit('action', {});

    expect(count1).toBe(1);
    expect(count2).toBe(1);
  });

  it('should support once listeners', () => {
    let count = 0;

    eventBus.once('action', () => { count++; });

    eventBus.emit('action', {});
    eventBus.emit('action', {});

    expect(count).toBe(1);
  });

  it('should support global listeners', () => {
    let receivedTypes: string[] = [];

    eventBus.onAll((event) => {
      receivedTypes.push(event.type);
    });

    eventBus.emit('action', {});
    eventBus.emit('stream-start', {});

    expect(receivedTypes).toEqual(['action', 'stream-start']);
  });

  it('should support unsubscribe', () => {
    let count = 0;

    const unsubscribe = eventBus.on('action', () => { count++; });

    eventBus.emit('action', {});
    expect(count).toBe(1);

    unsubscribe();

    eventBus.emit('action', {});
    expect(count).toBe(1);
  });

  it('should maintain event history', () => {
    eventBus.emit('action', { action: 'test1' });
    eventBus.emit('action', { action: 'test2' });

    const history = eventBus.getHistory();
    expect(history.length).toBe(2);
    expect(history[0].payload.action).toBe('test1');
    expect(history[1].payload.action).toBe('test2');
  });

  it('should clear listeners', () => {
    let count = 0;

    eventBus.on('action', () => { count++; });

    eventBus.emit('action', {});
    expect(count).toBe(1);

    eventBus.clear('action');

    eventBus.emit('action', {});
    expect(count).toBe(1);
  });
});
