/**
 * AI State Reconciler
 * Reconciles AI-generated state updates with the UI
 */

import { AIState, AIStateManager } from './state';
import { EventBus } from './events';
import { ReconciliationError } from './errors';

export interface StatePatch {
  op: 'add' | 'remove' | 'replace' | 'merge';
  path: string;
  value?: any;
}

export interface ReconcileOptions {
  merge?: boolean;
  validate?: boolean;
  batching?: boolean;
  batchDelay?: number;
}

export class AIReconciler {
  private stateManager: AIStateManager;
  private eventBus: EventBus;
  private pendingPatches: StatePatch[] = [];
  private batchTimeout: NodeJS.Timeout | null = null;

  constructor(stateManager: AIStateManager, eventBus: EventBus) {
    this.stateManager = stateManager;
    this.eventBus = eventBus;
  }

  /**
   * Apply a state patch from AI model output
   */
  applyPatch(patch: StatePatch, options: ReconcileOptions = {}): void {
    if (options.batching) {
      this.pendingPatches.push(patch);
      this.scheduleBatchUpdate(options.batchDelay || 16);
    } else {
      this.executePatch(patch, options);
    }
  }

  /**
   * Apply multiple patches atomically
   */
  applyPatches(patches: StatePatch[], options: ReconcileOptions = {}): void {
    const currentState = this.stateManager.getState();
    let newState = { ...currentState };

    try {
      for (const patch of patches) {
        newState = this.applyPatchToState(newState, patch, options);
      }
      this.stateManager.setState(newState);
      this.eventBus.emit('state-change', { patches, state: newState });
    } catch (error) {
      throw new ReconciliationError(
        `Failed to apply patches: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Reconcile AI output with current state
   */
  reconcile(aiOutput: any, options: ReconcileOptions = {}): void {
    const patches = this.generatePatches(aiOutput, options);
    this.applyPatches(patches, options);
  }

  /**
   * Generate patches from AI output
   */
  private generatePatches(aiOutput: any, options: ReconcileOptions): StatePatch[] {
    const patches: StatePatch[] = [];

    if (typeof aiOutput === 'string') {
      // Simple text update
      patches.push({
        op: 'add',
        path: 'messages',
        value: {
          role: 'assistant',
          content: aiOutput,
        },
      });
    } else if (aiOutput.messages) {
      // Message updates
      for (const msg of aiOutput.messages) {
        patches.push({
          op: 'add',
          path: 'messages',
          value: msg,
        });
      }
    }

    if (aiOutput.context) {
      patches.push({
        op: options.merge ? 'merge' : 'replace',
        path: 'context',
        value: aiOutput.context,
      });
    }

    if (aiOutput.metadata) {
      patches.push({
        op: 'merge',
        path: 'metadata',
        value: aiOutput.metadata,
      });
    }

    return patches;
  }

  /**
   * Execute a single patch
   */
  private executePatch(patch: StatePatch, options: ReconcileOptions): void {
    const currentState = this.stateManager.getState();
    const newState = this.applyPatchToState(currentState, patch, options);
    this.stateManager.setState(newState);
    this.eventBus.emit('state-change', { patch, state: newState });
  }

  /**
   * Apply patch to state object
   */
  private applyPatchToState(
    state: AIState,
    patch: StatePatch,
    options: ReconcileOptions
  ): AIState {
    if (options.validate) {
      this.validatePatch(patch);
    }

    const pathParts = patch.path.split('.');
    const newState = { ...state };

    switch (patch.op) {
      case 'add':
        return this.handleAdd(newState, pathParts, patch.value);
      case 'replace':
        return this.handleReplace(newState, pathParts, patch.value);
      case 'remove':
        return this.handleRemove(newState, pathParts);
      case 'merge':
        return this.handleMerge(newState, pathParts, patch.value);
      default:
        throw new ReconciliationError(`Unknown patch operation: ${patch.op}`);
    }
  }

  private handleAdd(state: AIState, path: string[], value: any): AIState {
    const key = path[0] as keyof AIState;

    if (path.length === 1) {
      if (Array.isArray(state[key])) {
        return {
          ...state,
          [key]: [...(state[key] as any[]), value],
        };
      }
      return { ...state, [key]: value };
    }

    return state;
  }

  private handleReplace(state: AIState, path: string[], value: any): AIState {
    const key = path[0] as keyof AIState;
    return { ...state, [key]: value };
  }

  private handleRemove(state: AIState, path: string[]): AIState {
    const key = path[0] as keyof AIState;
    if (Array.isArray(state[key]) && path.length > 1) {
      const index = parseInt(path[1]);
      return {
        ...state,
        [key]: (state[key] as any[]).filter((_, i) => i !== index),
      };
    }
    return state;
  }

  private handleMerge(state: AIState, path: string[], value: any): AIState {
    const key = path[0] as keyof AIState;
    if (typeof state[key] === 'object' && !Array.isArray(state[key])) {
      return {
        ...state,
        [key]: { ...(state[key] as any), ...value },
      };
    }
    return state;
  }

  private validatePatch(patch: StatePatch): void {
    if (!patch.path) {
      throw new ReconciliationError('Patch must have a path');
    }
    if (patch.op === 'add' || patch.op === 'replace' || patch.op === 'merge') {
      if (patch.value === undefined) {
        throw new ReconciliationError(`Patch operation ${patch.op} requires a value`);
      }
    }
  }

  private scheduleBatchUpdate(delay: number): void {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
    }

    this.batchTimeout = setTimeout(() => {
      if (this.pendingPatches.length > 0) {
        this.applyPatches([...this.pendingPatches]);
        this.pendingPatches = [];
      }
      this.batchTimeout = null;
    }, delay);
  }

  /**
   * Flush pending batched updates immediately
   */
  flush(): void {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }

    if (this.pendingPatches.length > 0) {
      this.applyPatches([...this.pendingPatches]);
      this.pendingPatches = [];
    }
  }
}
