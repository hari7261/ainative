# Server API Reference

## Node.js Server

### Creating a Server

```typescript
import { createServer } from '@hari7261/ainative-server-node';

const server = createServer({
  // Provider configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4o',
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: 'claude-3-5-sonnet-20241022',
  },
  ollama: {
    baseURL: 'http://localhost:11434',
    model: 'llama2',
  },

  // Server configuration
  defaultProvider: 'openai',
  port: 3001,
  cors: true,
  registerBuiltInTools: true,
});

server.listen();
```

### Registering Custom Tools

```typescript
server.registerTool({
  name: 'get_weather',
  description: 'Get weather for a location',
  parameters: {
    type: 'object',
    properties: {
      location: {
        type: 'string',
        description: 'City name',
      },
    },
    required: ['location'],
  },
  handler: async (args) => {
    // Fetch weather data
    return { temperature: 72, condition: 'Sunny' };
  },
});
```

### API Endpoints

#### POST /ai/action

Non-streaming action execution.

**Request:**
```json
{
  "action": "chat",
  "params": { "message": "Hello" },
  "context": { "userId": "123" }
}
```

**Response:**
```json
{
  "messages": [
    { "role": "assistant", "content": "Hi there!" }
  ],
  "context": { "userId": "123" }
}
```

#### POST /ai/stream

Streaming action execution (SSE).

**Request:**
```json
{
  "action": "chat",
  "params": { "message": "Hello" },
  "context": {}
}
```

**Response:** Server-Sent Events
```
data: {"type":"token","data":"Hi"}
data: {"type":"token","data":" there"}
data: {"type":"token","data":"!"}
data: {"type":"done"}
data: [DONE]
```

#### POST /ai/tool

Execute a registered tool.

**Request:**
```json
{
  "tool": "get_weather",
  "args": { "location": "San Francisco" },
  "context": {}
}
```

**Response:**
```json
{
  "success": true,
  "result": { "temperature": 72, "condition": "Sunny" }
}
```

#### GET /ai/tools

List all registered tools.

**Response:**
```json
{
  "tools": [
    {
      "name": "get_weather",
      "description": "Get weather for a location",
      "parameters": { "..." }
    }
  ]
}
```

## Python Server

### Creating a Server

```python
from ainative import create_server, ServerConfig

config = ServerConfig(
    openai_api_key="sk-...",
    openai_model="gpt-4o",
    default_provider="openai",
)

server = create_server(config)
app = server.get_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)
```

### Registering Custom Tools

```python
from ainative import Tool

async def get_weather_handler(args, context=None):
    location = args.get("location")
    # Fetch weather data
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
    handler=get_weather_handler
)

server.register_tool(tool)
```

### Running the Server

```bash
uvicorn main:app --reload --port 3001
```

## Provider Configuration

### OpenAI

```typescript
openai: {
  apiKey: string;
  model?: string; // default: 'gpt-4o'
  baseURL?: string;
  organization?: string;
}
```

### Anthropic

```typescript
anthropic: {
  apiKey: string;
  model?: string; // default: 'claude-3-5-sonnet-20241022'
}
```

### Ollama (Local)

```typescript
ollama: {
  baseURL?: string; // default: 'http://localhost:11434'
  model?: string; // default: 'llama2'
}
```

## Built-in Tools

### get_time

Get the current time in a timezone.

**Parameters:**
- `timezone` (string, optional): Timezone name

### calculate

Perform a mathematical calculation.

**Parameters:**
- `expression` (string, required): Math expression to evaluate

## Error Handling

All endpoints return standardized error responses:

```json
{
  "error": "Error message here"
}
```

HTTP status codes:
- `400`: Bad Request (invalid input)
- `500`: Internal Server Error
