/**
 * Anthropic Provider Adapter
 */

import Anthropic from '@anthropic-ai/sdk';

export interface AnthropicConfig {
  apiKey: string;
  model?: string;
}

export interface GenerateOptions {
  prompt: string;
  messages?: Array<{ role: string; content: string }>;
  stream?: boolean;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

export class AnthropicProvider {
  private client: Anthropic;
  private model: string;

  constructor(config: AnthropicConfig) {
    this.client = new Anthropic({
      apiKey: config.apiKey,
    });
    this.model = config.model || 'claude-3-5-sonnet-20241022';
  }

  async *generate(options: GenerateOptions): AsyncGenerator<string, void, unknown> {
    const messages = options.messages || [
      { role: 'user', content: options.prompt },
    ];

    if (options.stream) {
      const stream = await this.client.messages.create({
        model: this.model,
        max_tokens: options.maxTokens || 4096,
        messages: messages.map((msg) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
        stream: true,
        temperature: options.temperature,
        top_p: options.topP,
      });

      for await (const event of stream) {
        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          yield event.delta.text;
        }
      }
    } else {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: options.maxTokens || 4096,
        messages: messages.map((msg) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
        temperature: options.temperature,
        top_p: options.topP,
      });

      const textContent = response.content.find((block) => block.type === 'text');
      if (textContent && textContent.type === 'text') {
        yield textContent.text;
      }
    }
  }

  async generateNonStreaming(options: GenerateOptions): Promise<string> {
    const messages = options.messages || [
      { role: 'user', content: options.prompt },
    ];

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: options.maxTokens || 4096,
      messages: messages.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      temperature: options.temperature,
      top_p: options.topP,
    });

    const textContent = response.content.find((block) => block.type === 'text');
    if (textContent && textContent.type === 'text') {
      return textContent.text;
    }

    return '';
  }
}
