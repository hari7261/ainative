/**
 * OpenAI Provider Adapter
 */

import OpenAI from 'openai';

export interface OpenAIConfig {
  apiKey: string;
  model?: string;
  baseURL?: string;
  organization?: string;
}

export interface GenerateOptions {
  prompt: string;
  messages?: Array<{ role: string; content: string }>;
  stream?: boolean;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

export class OpenAIProvider {
  private client: OpenAI;
  private model: string;

  constructor(config: OpenAIConfig) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
      organization: config.organization,
    });
    this.model = config.model || 'gpt-4o';
  }

  async *generate(options: GenerateOptions): AsyncGenerator<string, void, unknown> {
    const messages = options.messages || [
      { role: 'user', content: options.prompt },
    ];

    if (options.stream) {
      const stream = await this.client.chat.completions.create({
        model: this.model,
        messages: messages as any,
        stream: true,
        temperature: options.temperature,
        max_tokens: options.maxTokens,
        top_p: options.topP,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      }
    } else {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: messages as any,
        temperature: options.temperature,
        max_tokens: options.maxTokens,
        top_p: options.topP,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        yield content;
      }
    }
  }

  async generateNonStreaming(options: GenerateOptions): Promise<string> {
    const messages = options.messages || [
      { role: 'user', content: options.prompt },
    ];

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: messages as any,
      temperature: options.temperature,
      max_tokens: options.maxTokens,
      top_p: options.topP,
    });

    return response.choices[0]?.message?.content || '';
  }
}
