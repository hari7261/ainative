/**
 * Core error types for AINative runtime
 */

export class AINativeError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'AINativeError';
  }
}

export class StreamingError extends AINativeError {
  constructor(message: string) {
    super(message, 'STREAMING_ERROR');
    this.name = 'StreamingError';
  }
}

export class ReconciliationError extends AINativeError {
  constructor(message: string) {
    super(message, 'RECONCILIATION_ERROR');
    this.name = 'ReconciliationError';
  }
}

export class ConnectionError extends AINativeError {
  constructor(message: string) {
    super(message, 'CONNECTION_ERROR');
    this.name = 'ConnectionError';
  }
}

export class ProviderError extends AINativeError {
  constructor(message: string, public provider?: string) {
    super(message, 'PROVIDER_ERROR');
    this.name = 'ProviderError';
  }
}

export class ActionError extends AINativeError {
  constructor(message: string, public action?: string) {
    super(message, 'ACTION_ERROR');
    this.name = 'ActionError';
  }
}
