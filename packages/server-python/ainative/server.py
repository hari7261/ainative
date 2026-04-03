"""
AINative FastAPI Server
"""

from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, Dict, Any
from pydantic import BaseModel

from .tools import ToolRegistry, built_in_tools
from .streaming import stream_tokens


class ActionRequest(BaseModel):
    action: str
    params: Dict[str, Any]
    context: Optional[Dict[str, Any]] = None
    provider: Optional[str] = None


class ToolRequest(BaseModel):
    tool: str
    args: Dict[str, Any]
    context: Optional[Dict[str, Any]] = None


class ServerConfig(BaseModel):
    openai_api_key: Optional[str] = None
    openai_model: str = "gpt-4o"
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama2"
    default_provider: str = "openai"
    register_built_in_tools: bool = True
    cors: bool = True


class AINativeServer:
    def __init__(self, config: ServerConfig):
        self.config = config
        self.app = FastAPI(title="AINative Server")
        self.tool_registry = ToolRegistry()
        self.providers: Dict[str, Any] = {}

        self.setup()

    def setup(self):
        """Setup server"""
        # CORS
        if self.config.cors:
            self.app.add_middleware(
                CORSMiddleware,
                allow_origins=["*"],
                allow_credentials=True,
                allow_methods=["*"],
                allow_headers=["*"],
            )

        # Initialize providers
        if self.config.openai_api_key:
            from .providers.openai_provider import OpenAIProvider

            self.providers["openai"] = OpenAIProvider(
                api_key=self.config.openai_api_key,
                model=self.config.openai_model,
            )

        from .providers.ollama_provider import OllamaProvider

        self.providers["ollama"] = OllamaProvider(
            base_url=self.config.ollama_base_url,
            model=self.config.ollama_model,
        )

        # Register built-in tools
        if self.config.register_built_in_tools:
            for tool in built_in_tools:
                self.tool_registry.register(tool)

        # Routes
        self.app.post("/ai/action")(self.handle_action)
        self.app.post("/ai/stream")(self.handle_stream)
        self.app.post("/ai/tool")(self.handle_tool)
        self.app.get("/ai/tools")(self.list_tools)
        self.app.get("/health")(self.health)

    async def handle_action(self, request: ActionRequest):
        """Handle non-streaming action"""
        try:
            prompt = f"Action: {request.action}\nParameters: {request.params}\nContext: {request.context}"

            provider_name = request.provider or self.config.default_provider
            provider = self.providers.get(provider_name)

            if not provider:
                return JSONResponse(
                    status_code=400,
                    content={"error": "No provider available"}
                )

            result = ""
            messages = request.context.get("messages") if request.context else None

            async for token in provider.generate(
                prompt=prompt,
                messages=messages,
                stream=False,
            ):
                result += token

            return {
                "messages": [{"role": "assistant", "content": result}],
                "context": request.context,
            }

        except Exception as e:
            return JSONResponse(
                status_code=500,
                content={"error": str(e)}
            )

    async def handle_stream(self, request: ActionRequest):
        """Handle streaming action"""
        try:
            prompt = f"Action: {request.action}\nParameters: {request.params}\nContext: {request.context}"

            provider_name = request.provider or self.config.default_provider
            provider = self.providers.get(provider_name)

            if not provider:
                return JSONResponse(
                    status_code=400,
                    content={"error": "No provider available"}
                )

            messages = request.context.get("messages") if request.context else None

            generator = provider.generate(
                prompt=prompt,
                messages=messages,
                stream=True,
            )

            return StreamingResponse(
                stream_tokens(generator),
                media_type="text/event-stream",
            )

        except Exception as e:
            return JSONResponse(
                status_code=500,
                content={"error": str(e)}
            )

    async def handle_tool(self, request: ToolRequest):
        """Handle tool execution"""
        try:
            result = await self.tool_registry.execute(
                request.tool,
                request.args,
                request.context,
            )
            return result
        except Exception as e:
            return JSONResponse(
                status_code=500,
                content={"error": str(e)}
            )

    async def list_tools(self):
        """List available tools"""
        schema = self.tool_registry.get_schema()
        return {"tools": schema}

    async def health(self):
        """Health check"""
        from datetime import datetime, timezone
        return {
            "status": "ok",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    def get_app(self) -> FastAPI:
        """Get FastAPI app"""
        return self.app

    def register_tool(self, tool):
        """Register a custom tool"""
        self.tool_registry.register(tool)


def create_server(config: ServerConfig) -> AINativeServer:
    """Create AINative server"""
    return AINativeServer(config)


def create_app(config: Optional[ServerConfig] = None) -> FastAPI:
    """Create a FastAPI app for tests and embedding."""
    server = create_server(config or ServerConfig(default_provider="ollama"))
    return server.get_app()
