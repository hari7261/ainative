"""
Streaming utilities for SSE
"""

import json
from typing import AsyncGenerator, Any


async def stream_tokens(generator: AsyncGenerator[str, None]) -> AsyncGenerator[str, None]:
    """Stream tokens in SSE format"""
    try:
        async for token in generator:
            yield f"data: {json.dumps({'type': 'token', 'data': token})}\n\n"
    except Exception as e:
        yield f"data: {json.dumps({'type': 'error', 'data': str(e)})}\n\n"
    finally:
        yield f"data: {json.dumps({'type': 'done'})}\n\n"
        yield "data: [DONE]\n\n"
