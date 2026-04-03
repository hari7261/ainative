"""
Ollama Provider for Python
"""

import httpx
from typing import AsyncGenerator, List, Dict, Any, Optional
import json


class OllamaProvider:
    def __init__(self, base_url: str = "http://localhost:11434", model: str = "llama2"):
        self.base_url = base_url
        self.model = model

    async def generate(
        self,
        prompt: str = "",
        messages: Optional[List[Dict[str, str]]] = None,
        stream: bool = True,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
    ) -> AsyncGenerator[str, None]:
        """Generate text using Ollama"""
        msgs = messages or [{"role": "user", "content": prompt}]

        async with httpx.AsyncClient() as client:
            async with client.stream(
                "POST",
                f"{self.base_url}/api/chat",
                json={
                    "model": self.model,
                    "messages": msgs,
                    "stream": stream,
                    "options": {
                        "temperature": temperature,
                        "num_predict": max_tokens,
                    },
                },
            ) as response:
                if stream:
                    async for line in response.aiter_lines():
                        if line.strip():
                            try:
                                data = json.loads(line)
                                if data.get("message", {}).get("content"):
                                    yield data["message"]["content"]
                            except json.JSONDecodeError:
                                continue
                else:
                    data = await response.json()
                    if data.get("message", {}).get("content"):
                        yield data["message"]["content"]
