/**
 * AINative Server - Express-based server
 */

import express, { Express } from 'express';
import cors from 'cors';
import { createAIRouter, RouterConfig } from './router';
import { ToolRegistry, builtInTools } from './tools';

export interface ServerConfig extends RouterConfig {
  port?: number;
  cors?: boolean;
  corsOptions?: any;
  registerBuiltInTools?: boolean;
}

export class AINativeServer {
  private app: Express;
  private toolRegistry: ToolRegistry;
  private config: ServerConfig;

  constructor(config: ServerConfig) {
    this.config = config;
    this.app = express();
    this.toolRegistry = new ToolRegistry();

    this.setup();
  }

  private setup(): void {
    // Middleware
    this.app.use(express.json());

    if (this.config.cors !== false) {
      this.app.use(cors(this.config.corsOptions));
    }

    // Register built-in tools
    if (this.config.registerBuiltInTools !== false) {
      builtInTools.forEach((tool) => this.toolRegistry.register(tool));
    }

    // Create AI router
    const aiRouter = createAIRouter(this.config, this.toolRegistry);
    this.app.use('/ai', aiRouter);

    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
  }

  registerTool(tool: any): void {
    this.toolRegistry.register(tool);
  }

  getApp(): Express {
    return this.app;
  }

  listen(port?: number): void {
    const listenPort = port || this.config.port || 3000;
    this.app.listen(listenPort, () => {
      console.log(`AINative server listening on port ${listenPort}`);
    });
  }
}

export function createServer(config: ServerConfig): AINativeServer {
  return new AINativeServer(config);
}
