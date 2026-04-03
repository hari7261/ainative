/**
 * AINative Application Runtime
 * Main entry point for creating AI-driven applications
 */

import { AIStateManager, AIState } from './state';
import { EventBus, ActionEvent } from './events';
import { StreamingEngine, StreamConfig } from './streaming';
import { AIReconciler } from './reconciler';
import { AIRenderer, RenderOptions } from './renderer';

export interface AppConfig {
  apiUrl: string;
  streamMethod?: 'SSE' | 'WS' | 'AUTO';
  initialState?: Partial<AIState>;
  reconnect?: boolean;
  debug?: boolean;
}

export interface ActionOptions {
  stream?: boolean;
  context?: Record<string, any>;
}

export class AIApp {
  private stateManager: AIStateManager;
  private eventBus: EventBus;
  private streaming: StreamingEngine;
  private reconciler: AIReconciler;
  private renderer: AIRenderer;
  private config: AppConfig;

  constructor(config: AppConfig) {
    this.config = config;
    this.stateManager = new AIStateManager(config.initialState);
    this.eventBus = new EventBus();
    this.streaming = new StreamingEngine(this.eventBus);
    this.reconciler = new AIReconciler(this.stateManager, this.eventBus);
    this.renderer = new AIRenderer(this.stateManager, this.eventBus);

    this.setupEventHandlers();

    if (config.debug) {
      this.enableDebugMode();
    }
  }

  /**
   * Mount the application to a DOM element
   */
  mount(component: any, options: RenderOptions): void {
    this.renderer.mount(component, options);
  }

  /**
   * Execute an AI action
   */
  async action(name: string, params: Record<string, any>, options: ActionOptions = {}): Promise<void> {
    const actionEvent: ActionEvent = {
      action: name,
      params,
      context: {
        ...this.stateManager.getState().context,
        ...options.context,
      },
    };

    this.eventBus.emit('action', actionEvent);

    if (options.stream) {
      return this.executeStreamingAction(actionEvent);
    } else {
      return this.executeAction(actionEvent);
    }
  }

  /**
   * Execute a non-streaming action
   */
  private async executeAction(actionEvent: ActionEvent): Promise<void> {
    try {
      const response = await fetch(`${this.config.apiUrl}/ai/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actionEvent),
      });

      if (!response.ok) {
        throw new Error(`Action failed: ${response.statusText}`);
      }

      const result = await response.json();
      this.reconciler.reconcile(result, { merge: true });
    } catch (error) {
      this.stateManager.setError(error as Error);
      this.eventBus.emit('error', { error });
    }
  }

  /**
   * Execute a streaming action
   */
  private async executeStreamingAction(actionEvent: ActionEvent): Promise<void> {
    const streamConfig: StreamConfig = {
      url: `${this.config.apiUrl}/ai/stream`,
      method: this.config.streamMethod,
      reconnect: this.config.reconnect,
    };

    this.stateManager.setStreaming(true);

    // Collect tokens for the streaming message
    let streamedContent = '';
    let messageId: string | null = null;

    // Add a placeholder message
    this.stateManager.addMessage({
      role: 'assistant',
      content: '',
    });

    const messages = this.stateManager.getState().messages;
    messageId = messages[messages.length - 1].id;

    this.eventBus.on('stream-data', ({ payload }) => {
      if (payload.token) {
        streamedContent += payload.token;
        if (messageId) {
          this.stateManager.updateMessage(messageId, { content: streamedContent });
        }
      }
    });

    this.eventBus.on('stream-end', () => {
      this.stateManager.setStreaming(false);
    });

    this.eventBus.on('stream-error', ({ payload }) => {
      this.stateManager.setStreaming(false);
      this.stateManager.setError(new Error(payload.error));
    });

    await this.streaming.start(streamConfig, actionEvent);
  }

  /**
   * Send a message (convenience method)
   */
  async sendMessage(content: string, options: ActionOptions = {}): Promise<void> {
    this.stateManager.addMessage({ role: 'user', content });
    return this.action('chat', { message: content }, { stream: true, ...options });
  }

  /**
   * Get current state
   */
  getState(): Readonly<AIState> {
    return this.stateManager.getState();
  }

  /**
   * Subscribe to state changes
   */
  onStateChange(listener: (state: AIState) => void): () => void {
    return this.stateManager.subscribe(listener);
  }

  /**
   * Stop any active streaming
   */
  stopStreaming(): void {
    this.streaming.stop();
    this.stateManager.setStreaming(false);
  }

  /**
   * Cleanup and unmount
   */
  destroy(): void {
    this.streaming.stop();
    this.renderer.unmount();
    this.eventBus.clear();
  }

  private setupEventHandlers(): void {
    // Handle errors globally
    this.eventBus.on('error', ({ payload }) => {
      console.error('AINative Error:', payload.error);
    });
  }

  private enableDebugMode(): void {
    this.eventBus.onAll((event) => {
      console.log('[AINative Debug]', event.type, event.payload);
    });

    this.stateManager.subscribe((state) => {
      console.log('[AINative State]', state);
    });
  }
}

/**
 * Factory function to create an AINative application
 */
export function createAIApp(config: AppConfig): AIApp {
  return new AIApp(config);
}
