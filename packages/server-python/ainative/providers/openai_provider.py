"""
OpenAI Provider for Python
"""

import openai
from typing import AsyncGenerator, List, Dict, Any, Optional


class OpenAIProvider:
    def __init__(self, api_key: str, model: str = "gpt-4o", base_url: Optional[str] = None):
        self.client = openai.AsyncOpenAI(api_key=api_key, base_url=base_url)
        self.model = model

    async def generate(
        self,
        prompt: str = "",
        messages: Optional[List[Dict[str, str]]] = None,
        stream: bool = True,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
    ) -> AsyncGenerator[str, None]:
        """Generate text using OpenAI"""
        msgs = messages or [{"role": "user", "content": prompt}]

        if stream:
            stream_response = await self.client.chat.completions.create(
                model=self.model,
                messages=msgs,  # type: ignore
                stream=True,
                temperature=temperature,
                max_tokens=max_tokens,
            )

            async for chunk in stream_response:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
        else:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=msgs,  # type: ignore
                temperature=temperature,
                max_tokens=max_tokens,
            )

            if response.choices[0].message.content:
                yield response.choices[0].message.content
