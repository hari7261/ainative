/**
 * AIApp Component
 * Root component for AI-driven applications
 */

import React, { useEffect, useRef, useState } from 'react';
import { AIApp as AIAppRuntime, AppConfig } from '../runtime/app';
import { AIState } from '../runtime/state';

export interface AIAppProps {
  config: AppConfig;
  children: (state: AIState, app: AIAppRuntime) => React.ReactNode;
}

export const AIApp: React.FC<AIAppProps> = ({ config, children }) => {
  const appRef = useRef<AIAppRuntime | null>(null);
  const [app, setApp] = useState<AIAppRuntime | null>(null);
  const [state, setState] = useState<AIState>({
    messages: [],
    context: {},
    streaming: false,
    error: null,
    metadata: {},
  });

  useEffect(() => {
    // Initialize the AI app
    if (!appRef.current) {
      appRef.current = new AIAppRuntime(config);
      setApp(appRef.current);

      // Subscribe to state changes
      appRef.current.onStateChange((newState) => {
        setState(newState);
      });
    }

    return () => {
      if (appRef.current) {
        appRef.current.destroy();
        appRef.current = null;
        setApp(null);
      }
    };
  }, [config]);

  if (!app) {
    return null;
  }

  return <>{children(state, app)}</>;
};
