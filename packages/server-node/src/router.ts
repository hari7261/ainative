/**
 * Router for AI endpoints
 */

import { Router, Request, Response } from 'express';
import { OpenAIProvider } from './adapters/openai';
import { AnthropicProvider } from './adapters/anthropic';
import { OllamaProvider } from './adapters/ollama';
import { ToolRegistry } from './tools';
import { StreamManager } from './stream';

export interface RouterConfig {
  openai?: {
    apiKey: string;
    model?: string;
  };
  anthropic?: {
    apiKey: string;
    model?: string;
  };
  ollama?: {
    baseURL?: string;
    model?: string;
  };
  defaultProvider?: 'openai' | 'anthropic' | 'ollama';
}

export function createAIRouter(config: RouterConfig, toolRegistry: ToolRegistry): Router {
  const router = Router();

  // Initialize providers
  const providers: any = {};

  if (config.openai) {
    providers.openai = new OpenAIProvider(config.openai);
  }

  if (config.anthropic) {
    providers.anthropic = new AnthropicProvider(config.anthropic);
  }

  if (config.ollama) {
    providers.ollama = new OllamaProvider(config.ollama);
  }

  const defaultProvider = providers[config.defaultProvider || 'openai'];

  // POST /ai/action - Non-streaming action
  router.post('/action', async (req: Request, res: Response) => {
    try {
      const { action, params, context } = req.body;

      const prompt = `Action: ${action}\nParameters: ${JSON.stringify(params)}\nContext: ${JSON.stringify(context)}`;

      const provider = providers[req.body.provider] || defaultProvider;

      if (!provider) {
        return res.status(400).json({ error: 'No provider available' });
      }

      const result = await provider.generateNonStreaming({
        prompt,
        messages: context?.messages,
      });

      res.json({
        messages: [
          {
            role: 'assistant',
            content: result,
          },
        ],
        context,
      });
    } catch (error) {
      console.error('Action error:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // POST /ai/stream - Streaming action
  router.post('/stream', async (req: Request, res: Response) => {
    const stream = new StreamManager(res);

    try {
      const { action, params, context } = req.body;

      const prompt = `Action: ${action}\nParameters: ${JSON.stringify(params)}\nContext: ${JSON.stringify(context)}`;

      const provider = providers[req.body.provider] || defaultProvider;

      if (!provider) {
        stream.sendError('No provider available');
        stream.sendDone();
        return;
      }

      const generator = provider.generate({
        prompt,
        messages: context?.messages,
        stream: true,
      });

      for await (const token of generator) {
        stream.sendToken(token);
      }

      stream.sendDone();
    } catch (error) {
      console.error('Stream error:', error);
      stream.sendError(error instanceof Error ? error.message : 'Unknown error');
      stream.sendDone();
    }
  });

  // POST /ai/tool - Execute a tool
  router.post('/tool', async (req: Request, res: Response) => {
    try {
      const { tool, args, context } = req.body;

      const result = await toolRegistry.execute({ tool, args }, context);

      res.json(result);
    } catch (error) {
      console.error('Tool error:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // GET /ai/tools - List available tools
  router.get('/tools', (req: Request, res: Response) => {
    const schema = toolRegistry.getSchema();
    res.json({ tools: schema });
  });

  return router;
}
