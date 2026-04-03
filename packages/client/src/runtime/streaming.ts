/**
 * Streaming Engine for AINative
 * Supports SSE and WebSocket streaming with automatic fallback
 */

import { EventBus } from './events';
import { StreamingError, ConnectionError } from './errors';

export interface StreamConfig {
  url: string;
  method?: 'SSE' | 'WS' | 'AUTO';
  headers?: Record<string, string>;
  reconnect?: boolean;
  reconnectDelay?: number;
  maxReconnectAttempts?: number;
}

export interface StreamMessage {
  type: 'token' | 'done' | 'error' | 'metadata';
  data: any;
}

export class StreamingEngine {
  private eventBus: EventBus;
  private abortController: AbortController | null = null;
  private eventSource: EventSource | null = null;
  private websocket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private isStreaming = false;
  private lastConfig: StreamConfig | null = null;
  private lastPayload: any = null;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
  }

  async start(config: StreamConfig, data: any): Promise<void> {
    if (this.isStreaming) {
      throw new StreamingError('Stream already active');
    }

    this.isStreaming = true;
    this.lastConfig = { ...config };
    this.lastPayload = data;
    this.eventBus.emit('stream-start', { config, data });

    const method = config.method === 'AUTO' ? this.detectBestMethod() : config.method || 'SSE';

    try {
      if (method === 'WS') {
        await this.startWebSocket(config, data);
      } else {
        await this.startSSE(config, data);
      }
    } catch (error) {
      this.handleError(error as Error, config);
    }
  }

  private async startSSE(config: StreamConfig, data: any): Promise<void> {
    this.abortController = new AbortController();

    try {
      const response = await fetch(config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...config.headers,
        },
        body: JSON.stringify(data),
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        throw new ConnectionError(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new StreamingError('Response body is not readable');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          this.eventBus.emit('stream-end', { reason: 'complete' });
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              this.eventBus.emit('stream-end', { reason: 'complete' });
              this.isStreaming = false;
              return;
            }

            try {
              const parsed = JSON.parse(data);
              this.handleStreamMessage(parsed);
            } catch (e) {
              // Plain text token
              this.eventBus.emit('stream-data', { token: data });
            }
          }
        }
      }
    } finally {
      this.isStreaming = false;
      this.abortController = null;
    }
  }

  private async startWebSocket(config: StreamConfig, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const wsUrl = config.url.replace(/^http/, 'ws');
      this.websocket = new WebSocket(wsUrl);

      this.websocket.onopen = () => {
        this.websocket?.send(JSON.stringify(data));
        this.reconnectAttempts = 0;
      };

      this.websocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.handleStreamMessage(message);

          if (message.type === 'done') {
            this.eventBus.emit('stream-end', { reason: 'complete' });
            this.websocket?.close();
            this.isStreaming = false;
            resolve();
          }
        } catch (error) {
          this.eventBus.emit('stream-error', { error: error instanceof Error ? error.message : 'Parse error' });
        }
      };

      this.websocket.onerror = () => {
        this.eventBus.emit('stream-error', { error: 'WebSocket error' });
        reject(new ConnectionError('WebSocket connection failed'));
      };

      this.websocket.onclose = () => {
        this.isStreaming = false;
        if (config.reconnect && this.reconnectAttempts < (config.maxReconnectAttempts || 3)) {
          this.reconnectAttempts++;
          setTimeout(() => {
            this.startWebSocket(config, data);
          }, config.reconnectDelay || 1000);
        }
      };
    });
  }

  private handleStreamMessage(message: StreamMessage): void {
    switch (message.type) {
      case 'token':
        this.eventBus.emit('stream-data', { token: message.data });
        break;
      case 'done':
        this.eventBus.emit('stream-end', { reason: 'complete' });
        break;
      case 'error':
        this.eventBus.emit('stream-error', { error: message.data });
        break;
      case 'metadata':
        this.eventBus.emit('stream-data', { metadata: message.data });
        break;
    }
  }

  stop(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }

    this.isStreaming = false;
    this.eventBus.emit('stream-end', { reason: 'aborted' });
  }

  isActive(): boolean {
    return this.isStreaming;
  }

  private detectBestMethod(): 'SSE' | 'WS' {
    // Prefer SSE for simplicity, fallback to WS if needed
    return typeof EventSource !== 'undefined' ? 'SSE' : 'WS';
  }

  private handleError(error: Error, config: StreamConfig): void {
    this.eventBus.emit('stream-error', { error: error.message });
    this.isStreaming = false;

    if (config.reconnect && this.reconnectAttempts < (config.maxReconnectAttempts || 3)) {
      this.reconnectAttempts++;
      setTimeout(() => {
        if (this.lastConfig) {
          this.start(this.lastConfig, this.lastPayload);
        }
      }, config.reconnectDelay || 1000);
    }
  }
}
