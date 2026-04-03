"""
Tool execution system for Python
"""

from typing import Dict, Any, Callable, Awaitable, List, Optional
from pydantic import BaseModel


class Tool(BaseModel):
    name: str
    description: str
    parameters: Dict[str, Any]
    handler: Any  # Callable[[Dict[str, Any], Any], Awaitable[Any]]

    class Config:
        arbitrary_types_allowed = True


class ToolRegistry:
    def __init__(self):
        self.tools: Dict[str, Tool] = {}

    def register(self, tool: Tool):
        """Register a tool"""
        self.tools[tool.name] = tool

    def unregister(self, name: str):
        """Unregister a tool"""
        if name in self.tools:
            del self.tools[name]

    def get(self, name: str) -> Optional[Tool]:
        """Get a tool by name"""
        return self.tools.get(name)

    def list(self) -> List[Tool]:
        """List all tools"""
        return list(self.tools.values())

    async def execute(self, tool_name: str, args: Dict[str, Any], context: Any = None) -> Dict[str, Any]:
        """Execute a tool"""
        tool = self.tools.get(tool_name)

        if not tool:
            return {"success": False, "error": f"Tool not found: {tool_name}"}

        try:
            result = await tool.handler(args, context)
            return {"success": True, "result": result}
        except Exception as e:
            return {"success": False, "error": str(e)}

    def get_schema(self) -> List[Dict[str, Any]]:
        """Get JSON schema for all tools"""
        return [
            {
                "name": tool.name,
                "description": tool.description,
                "parameters": tool.parameters,
            }
            for tool in self.tools.values()
        ]


# Built-in tools

async def get_time_handler(args: Dict[str, Any], context: Any = None) -> str:
    """Get current time"""
    from datetime import datetime
    import pytz

    timezone = args.get("timezone", "UTC")
    tz = pytz.timezone(timezone)
    return datetime.now(tz).strftime("%Y-%m-%d %H:%M:%S %Z")


async def calculate_handler(args: Dict[str, Any], context: Any = None) -> Dict[str, Any]:
    """Perform calculation"""
    expression = args.get("expression", "")
    try:
        result = eval(expression)
        return {"result": result}
    except Exception as e:
        raise ValueError(f"Invalid expression: {e}")


built_in_tools = [
    Tool(
        name="get_time",
        description="Get the current time",
        parameters={
            "type": "object",
            "properties": {
                "timezone": {"type": "string", "description": "Timezone (e.g., America/New_York)"}
            },
        },
        handler=get_time_handler,
    ),
    Tool(
        name="calculate",
        description="Perform a mathematical calculation",
        parameters={
            "type": "object",
            "properties": {
                "expression": {"type": "string", "description": "Mathematical expression to evaluate"}
            },
            "required": ["expression"],
        },
        handler=calculate_handler,
    ),
]
