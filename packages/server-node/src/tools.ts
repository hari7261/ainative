/**
 * Tool execution system
 */

export interface Tool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  handler: (args: Record<string, any>, context?: any) => Promise<any>;
}

export interface ToolCall {
  tool: string;
  args: Record<string, any>;
}

export class ToolRegistry {
  private tools: Map<string, Tool> = new Map();

  register(tool: Tool): void {
    this.tools.set(tool.name, tool);
  }

  unregister(name: string): void {
    this.tools.delete(name);
  }

  get(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  list(): Tool[] {
    return Array.from(this.tools.values());
  }

  async execute(toolCall: ToolCall, context?: any): Promise<any> {
    const tool = this.tools.get(toolCall.tool);

    if (!tool) {
      throw new Error(`Tool not found: ${toolCall.tool}`);
    }

    try {
      const result = await tool.handler(toolCall.args, context);
      return { success: true, result };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  getSchema(): any[] {
    return this.list().map((tool) => ({
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
    }));
  }
}

// Built-in tools

export const builtInTools: Tool[] = [
  {
    name: 'get_time',
    description: 'Get the current time',
    parameters: {
      type: 'object',
      properties: {
        timezone: {
          type: 'string',
          description: 'Timezone (e.g., America/New_York)',
        },
      },
    },
    handler: async (args) => {
      const timezone = args.timezone || 'UTC';
      return new Date().toLocaleString('en-US', { timeZone: timezone });
    },
  },
  {
    name: 'calculate',
    description: 'Perform a mathematical calculation',
    parameters: {
      type: 'object',
      properties: {
        expression: {
          type: 'string',
          description: 'Mathematical expression to evaluate',
        },
      },
      required: ['expression'],
    },
    handler: async (args) => {
      try {
        // Safe eval using Function constructor
        const result = Function(`'use strict'; return (${args.expression})`)();
        return { result };
      } catch (error) {
        throw new Error('Invalid expression');
      }
    },
  },
];
