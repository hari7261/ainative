/**
 * Ollama Provider Adapter (for local LLMs)
 */

export interface OllamaConfig {
  baseURL?: string;
  model?: string;
}

export interface GenerateOptions {
  prompt: string;
  messages?: Array<{ role: string; content: string }>;
  stream?: boolean;
  temperature?: number;
  maxTokens?: number;
}

export class OllamaProvider {
  private baseURL: string;
  private model: string;

  constructor(config: OllamaConfig = {}) {
    this.baseURL = config.baseURL || 'http://localhost:11434';
    this.model = config.model || 'llama2';
  }

  async *generate(options: GenerateOptions): AsyncGenerator<string, void, unknown> {
    const messages = options.messages || [
      { role: 'user', content: options.prompt },
    ];

    const response = await fetch(`${this.baseURL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        messages,
        stream: options.stream !== false,
        options: {
          temperature: options.temperature,
          num_predict: options.maxTokens,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama request failed: ${response.statusText}`);
    }

    if (options.stream !== false) {
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter((line) => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.message?.content) {
              yield data.message.content;
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    } else {
      const data = await response.json();
      if (data.message?.content) {
        yield data.message.content;
      }
    }
  }

  async generateNonStreaming(options: GenerateOptions): Promise<string> {
    const messages = options.messages || [
      { role: 'user', content: options.prompt },
    ];

    const response = await fetch(`${this.baseURL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        messages,
        stream: false,
        options: {
          temperature: options.temperature,
          num_predict: options.maxTokens,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.message?.content || '';
  }
}
