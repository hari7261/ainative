/**
 * AI State Management
 * Manages the AI-driven state of the application
 */

export interface AIState {
  messages: Message[];
  context: Record<string, any>;
  streaming: boolean;
  error: Error | null;
  metadata: Record<string, any>;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export type StateListener = (state: AIState) => void;

export class AIStateManager {
  private state: AIState;
  private listeners: Set<StateListener> = new Set();
  private history: AIState[] = [];
  private maxHistory = 50;

  constructor(initialState?: Partial<AIState>) {
    this.state = {
      messages: [],
      context: {},
      streaming: false,
      error: null,
      metadata: {},
      ...initialState,
    };
    this.saveToHistory();
  }

  getState(): Readonly<AIState> {
    return { ...this.state };
  }

  setState(updates: Partial<AIState>): void {
    this.state = { ...this.state, ...updates };
    this.saveToHistory();
    this.notifyListeners();
  }

  addMessage(message: Omit<Message, 'id' | 'timestamp'>): void {
    const newMessage: Message = {
      ...message,
      id: this.generateId(),
      timestamp: Date.now(),
    };
    this.setState({
      messages: [...this.state.messages, newMessage],
    });
  }

  updateMessage(id: string, updates: Partial<Message>): void {
    const messages = this.state.messages.map((msg) =>
      msg.id === id ? { ...msg, ...updates } : msg
    );
    this.setState({ messages });
  }

  updateContext(context: Record<string, any>): void {
    this.setState({
      context: { ...this.state.context, ...context },
    });
  }

  setStreaming(streaming: boolean): void {
    this.setState({ streaming });
  }

  setError(error: Error | null): void {
    this.setState({ error });
  }

  clearMessages(): void {
    this.setState({ messages: [] });
  }

  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.getState()));
  }

  private saveToHistory(): void {
    this.history.push({ ...this.state });
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  getHistory(): Readonly<AIState[]> {
    return [...this.history];
  }

  undo(): boolean {
    if (this.history.length > 1) {
      this.history.pop(); // Remove current
      const previousState = this.history[this.history.length - 1];
      this.state = { ...previousState };
      this.notifyListeners();
      return true;
    }
    return false;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
