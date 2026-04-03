/**
 * Renderer - Manages React rendering and hydration
 */

import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { AIStateManager } from './state';
import { EventBus } from './events';

export interface RenderOptions {
  container: HTMLElement;
  hydrate?: boolean;
}

export class AIRenderer {
  private root: Root | null = null;
  private container: HTMLElement | null = null;
  private stateManager: AIStateManager;
  private eventBus: EventBus;
  private component: any;

  constructor(stateManager: AIStateManager, eventBus: EventBus) {
    this.stateManager = stateManager;
    this.eventBus = eventBus;
  }

  /**
   * Mount the application
   */
  mount(component: any, options: RenderOptions): void {
    this.component = component;
    this.container = options.container;

    if (options.hydrate && this.container.hasChildNodes()) {
      // Hydrate existing server-rendered content
      this.root = createRoot(this.container, { hydrate: true } as any);
    } else {
      this.root = createRoot(this.container);
    }

    this.render();

    // Subscribe to state changes for re-rendering
    this.stateManager.subscribe(() => {
      this.render();
    });
  }

  /**
   * Render the component with current state
   */
  private render(): void {
    if (!this.root || !this.component) {
      return;
    }

    const state = this.stateManager.getState();
    const element = createElement(this.component, { state, eventBus: this.eventBus });

    this.root.render(element);
  }

  /**
   * Unmount the application
   */
  unmount(): void {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
    this.container = null;
  }

  /**
   * Force a re-render
   */
  forceUpdate(): void {
    this.render();
  }
}
