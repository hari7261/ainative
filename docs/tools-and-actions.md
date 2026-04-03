# Tools and Actions

## Overview

Tools allow LLMs to execute functions and interact with external systems.

## Defining Tools

### Tool Structure

```typescript
interface Tool {
  name: string;
  description: string;
  parameters: Record<string, any>; // JSON Schema
  handler: (args: Record<string, any>, context?: any) => Promise<any>;
}
```

### Example Tool

```typescript
const weatherTool = {
  name: 'get_weather',
  description: 'Get weather information for a location',
  parameters: {
    type: 'object',
    properties: {
      location: {
        type: 'string',
        description: 'City name (e.g., "San Francisco")',
      },
      units: {
        type: 'string',
        enum: ['celsius', 'fahrenheit'],
        description: 'Temperature units',
      },
    },
    required: ['location'],
  },
  handler: async (args) => {
    const { location, units = 'celsius' } = args;
    // Fetch weather data
    const data = await fetchWeather(location);
    return {
      temperature: data.temp,
      condition: data.condition,
      units,
    };
  },
};
```

## Registering Tools

### Node.js Server

```typescript
import { createServer } from '@ainative/server-node';

const server = createServer(config);

server.registerTool(weatherTool);
```

### Python Server

```python
from ainative import Tool

async def weather_handler(args, context=None):
    location = args["location"]
    # Fetch weather
    return {"temperature": 72, "condition": "Sunny"}

tool = Tool(
    name="get_weather",
    description="Get weather for a location",
    parameters={
        "type": "object",
        "properties": {
            "location": {"type": "string"}
        },
        "required": ["location"]
    },
    handler=weather_handler
)

server.register_tool(tool)
```

## Calling Tools

### From Client

```typescript
// Call tool directly
const result = await fetch('http://localhost:3001/ai/tool', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tool: 'get_weather',
    args: { location: 'San Francisco' },
    context: {},
  }),
});

const data = await result.json();
console.log(data.result);
```

### LLM-Triggered

Tools can be automatically called by the LLM:

```typescript
// The LLM decides when to call tools
await app.sendMessage('What is the weather in Paris?');

// Behind the scenes:
// 1. LLM receives message and available tools
// 2. LLM decides to call get_weather tool
// 3. Tool is executed server-side
// 4. Result is sent back to LLM
// 5. LLM generates response using tool result
```

## Built-in Tools

### get_time

```typescript
{
  name: 'get_time',
  description: 'Get the current time',
  parameters: {
    type: 'object',
    properties: {
      timezone: { type: 'string' }
    }
  }
}
```

### calculate

```typescript
{
  name: 'calculate',
  description: 'Perform a mathematical calculation',
  parameters: {
    type: 'object',
    properties: {
      expression: { type: 'string' }
    },
    required: ['expression']
  }
}
```

## Advanced Patterns

### Context-Aware Tools

Access request context in handlers:

```typescript
{
  name: 'get_user_data',
  handler: async (args, context) => {
    const userId = context.userId;
    return await db.users.find(userId);
  }
}
```

### Async Tools

Tools can be long-running:

```typescript
{
  name: 'generate_image',
  handler: async (args) => {
    const imageUrl = await generateImage(args.prompt);
    return { url: imageUrl };
  }
}
```

### Error Handling

```typescript
{
  name: 'risky_operation',
  handler: async (args) => {
    try {
      return await performOperation(args);
    } catch (error) {
      throw new Error(`Operation failed: ${error.message}`);
    }
  }
}
```

## Tool Registry

### List Available Tools

```typescript
// Client
const response = await fetch('http://localhost:3001/ai/tools');
const { tools } = await response.json();

console.log(tools);
```

### Dynamic Registration

```typescript
// Register tools at runtime
if (user.hasPermission('admin')) {
  server.registerTool(adminTool);
}
```

### Unregister Tools

```typescript
// Node.js
toolRegistry.unregister('tool_name');

# Python
server.tool_registry.unregister('tool_name')
```

## Security

### Validate Input

Always validate tool arguments:

```typescript
{
  handler: async (args) => {
    if (!args.location || typeof args.location !== 'string') {
      throw new Error('Invalid location');
    }
    // Sanitize
    const location = args.location.trim();
    return await fetchWeather(location);
  }
}
```

### Authorization

Check permissions before execution:

```typescript
{
  handler: async (args, context) => {
    if (!context.user.hasPermission('weather:read')) {
      throw new Error('Unauthorized');
    }
    return await fetchWeather(args.location);
  }
}
```

### Rate Limiting

Implement rate limiting for expensive tools:

```typescript
const rateLimiter = new Map();

{
  handler: async (args, context) => {
    const key = context.userId;
    const now = Date.now();
    const lastCall = rateLimiter.get(key) || 0;

    if (now - lastCall < 1000) {
      throw new Error('Rate limit exceeded');
    }

    rateLimiter.set(key, now);
    return await expensiveOperation(args);
  }
}
```

## Testing Tools

```typescript
import { ToolRegistry } from '@ainative/server-node';
import { test } from 'vitest';

test('weather tool works', async () => {
  const registry = new ToolRegistry();
  registry.register(weatherTool);

  const result = await registry.execute({
    tool: 'get_weather',
    args: { location: 'San Francisco' },
  });

  expect(result.success).toBe(true);
  expect(result.result).toHaveProperty('temperature');
});
```
