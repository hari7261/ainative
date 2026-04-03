/**
 * Event System for AINative
 * Handles communication between components and runtime
 */

export type EventType =
  | 'action'
  | 'tool'
  | 'stream-start'
  | 'stream-data'
  | 'stream-end'
  | 'stream-error'
  | 'state-change'
  | 'error';

export interface AIEvent<T = any> {
  type: EventType;
  payload: T;
  timestamp: number;
  id: string;
}

export interface ActionEvent {
  action: string;
  params: Record<string, any>;
  context?: Record<string, any>;
}

export interface ToolEvent {
  tool: string;
  args: Record<string, any>;
}

export interface StreamEvent {
  token?: string;
  done?: boolean;
  error?: string;
  metadata?: Record<string, any>;
}

export type EventListener<T = any> = (event: AIEvent<T>) => void;

export class EventBus {
  private listeners: Map<EventType, Set<EventListener>> = new Map();
  private globalListeners: Set<EventListener> = new Set();
  private eventHistory: AIEvent[] = [];
  private maxHistory = 100;

  emit<T = any>(type: EventType, payload: T): void {
    const event: AIEvent<T> = {
      type,
      payload,
      timestamp: Date.now(),
      id: this.generateId(),
    };

    this.saveToHistory(event);

    // Notify type-specific listeners
    const typeListeners = this.listeners.get(type);
    if (typeListeners) {
      typeListeners.forEach((listener) => listener(event));
    }

    // Notify global listeners
    this.globalListeners.forEach((listener) => listener(event));
  }

  on<T = any>(type: EventType, listener: EventListener<T>): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(listener as EventListener);

    return () => this.off(type, listener);
  }

  off<T = any>(type: EventType, listener: EventListener<T>): void {
    const typeListeners = this.listeners.get(type);
    if (typeListeners) {
      typeListeners.delete(listener as EventListener);
    }
  }

  onAll(listener: EventListener): () => void {
    this.globalListeners.add(listener);
    return () => this.globalListeners.delete(listener);
  }

  once<T = any>(type: EventType, listener: EventListener<T>): () => void {
    const wrappedListener: EventListener<T> = (event) => {
      listener(event);
      this.off(type, wrappedListener);
    };
    return this.on(type, wrappedListener);
  }

  clear(type?: EventType): void {
    if (type) {
      this.listeners.delete(type);
    } else {
      this.listeners.clear();
      this.globalListeners.clear();
    }
  }

  getHistory(): Readonly<AIEvent[]> {
    return [...this.eventHistory];
  }

  private saveToHistory(event: AIEvent): void {
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistory) {
      this.eventHistory.shift();
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
