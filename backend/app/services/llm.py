import json
import httpx
from backend.app.core.config import LLm

async def stream_rag_pipeline(question: str, retrieved_data: dict):
    sources_payload = json.dumps({"type": "sources", "data": retrieved_data["sources"]})
    yield f"data: {sources_payload}\n\n"

    prompt_text = f"""Context:
{retrieved_data['context']}

Question: {question}

Answer concisely using only the context provided above."""

    payload = {"contents": [{"parts": [{"text": prompt_text}]}]}
    url, headers = LLm()

    try:
        custom_timeout = httpx.Timeout(120.0, connect=10.0)
        async with httpx.AsyncClient(timeout=custom_timeout) as client:
            async with client.stream("POST", url, headers=headers, json=payload) as resp:
                
                if resp.status_code != 200:
                    error_bytes = await resp.aread()
                    error_msg = f"API Error {resp.status_code}: {error_bytes.decode('utf-8')}"
                    yield f"data: {json.dumps({'type': 'token', 'data': error_msg})}\n\n"
                    return

                async for line in resp.aiter_lines():
                    if line.startswith("data: "):
                        data_str = line[len("data: "):].strip()
                        if not data_str:
                            continue
                        try:
                            chunk_json = json.loads(data_str)
                            candidates = chunk_json.get("candidates", [])
                            if candidates:
                                part = candidates[0].get("content", {}).get("parts", [{}])[0]
                                token_text = part.get("text", "")
                                if token_text:
                                    yield f"data: {json.dumps({'type': 'token', 'data': token_text})}\n\n"
                        except json.JSONDecodeError:
                            continue
                            
    except Exception as e:
        yield f"data: {json.dumps({'type': 'token', 'data': f' Backend Crash: {str(e)}'})}\n\n"