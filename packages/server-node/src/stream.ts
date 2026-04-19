/**
 * Streaming utilities for SSE
 */

import { Response } from 'express';

export class StreamManager {
  private response: Response;
  private closed: boolean = false;

  constructor(response: Response) {
    this.response = response;
    this.setupSSE();
  }

  private setupSSE(): void {
    this.response.setHeader('Content-Type', 'text/event-stream');
    this.response.setHeader('Cache-Control', 'no-cache');
    this.response.setHeader('Connection', 'keep-alive');
    this.response.setHeader('X-Accel-Buffering', 'no'); // Nginx
    this.response.flushHeaders();
  }

  sendToken(token: string): void {
    if (this.closed) return;

    this.response.write(`data: ${JSON.stringify({ type: 'token', data: token })}\n\n`);
  }

  sendMetadata(metadata: any): void {
    if (this.closed) return;

    this.response.write(
      `data: ${JSON.stringify({ type: 'metadata', data: metadata })}\n\n`
    );
  }

  sendError(error: string): void {
    if (this.closed) return;

    this.response.write(`data: ${JSON.stringify({ type: 'error', data: error })}\n\n`);
  }

  sendDone(): void {
    if (this.closed) return;

    this.response.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    this.response.write('data: [DONE]\n\n');
    this.close();
  }

  close(): void {
    if (!this.closed) {
      this.closed = true;
      this.response.end();
    }
  }

  isClosed(): boolean {
    return this.closed;
  }
}

export async function* streamTokens(
  generator: AsyncGenerator<string, void, unknown>
): AsyncGenerator<string, void, unknown> {
  for await (const token of generator) {
    yield token;
  }
}
