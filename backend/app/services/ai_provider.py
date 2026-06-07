"""Provider-agnostic AI gateway.

Thin wrappers around Gemini (primary) and Groq (secondary). The gateway keeps
provider-specific HTTP details out of business logic. Per the platform
architecture: AI assists, the community remains the source of truth.
"""
from __future__ import annotations

import json
import logging
import re
from typing import Any

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

GEMINI_MODEL = "gemini-2.5-flash"
GROQ_MODEL = "llama-3.1-70b-versatile"

REQUEST_TIMEOUT_SECONDS = 30.0


class AIError(RuntimeError):
    """Raised when both providers fail to produce a valid response."""


def _strip_code_fence(text: str) -> str:
    """Strip ```json ... ``` or ``` ... ``` fences that some models add."""
    text = text.strip()
    if not text.startswith("```"):
        return text
    lines = text.split("\n")
    if lines and lines[0].startswith("```json"):
        lines = lines[1:]
    elif lines and lines[0].startswith("```"):
        lines = lines[1:]
    if lines and lines[-1].strip() == "```":
        lines = lines[:-1]
    return "\n".join(lines).strip()


async def call_gemini_json(prompt: str, *, max_output_tokens: int = 1024) -> dict[str, Any]:
    """Call Gemini and return a parsed JSON dict.

    Falls back to a generic empty dict on any error so callers can decide
    whether to retry, fall back to Groq, or use a rule-based fallback.
    """
    api_key = settings.gemini_api_key
    if not api_key:
        logger.warning("[AI] gemini_api_key not configured")
        return {}
    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{GEMINI_MODEL}:generateContent?key={api_key}"
    )
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.4,
            "maxOutputTokens": max_output_tokens,
            "responseMimeType": "application/json",
        },
    }
    try:
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT_SECONDS) as client:
            r = await client.post(url, json=payload)
            if r.status_code != 200:
                logger.error("[AI] Gemini HTTP %s: %s", r.status_code, r.text[:200])
                return {}
            data = r.json()
            raw = data["candidates"][0]["content"]["parts"][0]["text"]
            return _try_parse_json(raw)
    except (httpx.HTTPError, KeyError, IndexError) as err:
        logger.error("[AI] Gemini call failed: %s", err)
        return {}


async def call_groq_json(prompt: str, *, max_output_tokens: int = 1024) -> dict[str, Any]:
    """Secondary provider; used as a fallback if Gemini is unavailable."""
    api_key = settings.groq_api_key
    if not api_key:
        return {}
    url = "https://api.groq.com/openai/v1/chat/completions"
    payload = {
        "model": GROQ_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": max_output_tokens,
        "temperature": 0.4,
        "response_format": {"type": "json_object"},
    }
    headers = {"Authorization": f"Bearer {api_key}"}
    try:
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT_SECONDS) as client:
            r = await client.post(url, json=payload, headers=headers)
            if r.status_code != 200:
                logger.error("[AI] Groq HTTP %s: %s", r.status_code, r.text[:200])
                return {}
            data = r.json()
            raw = data["choices"][0]["message"]["content"]
            return _try_parse_json(raw)
    except (httpx.HTTPError, KeyError, IndexError) as err:
        logger.error("[AI] Groq call failed: %s", err)
        return {}


async def call_json(prompt: str, *, max_output_tokens: int = 1024) -> dict[str, Any]:
    """Primary entry: try Gemini, then Groq. Returns {} if both fail."""
    result = await call_gemini_json(prompt, max_output_tokens=max_output_tokens)
    if result:
        return result
    logger.info("[AI] Falling back to Groq")
    return await call_groq_json(prompt, max_output_tokens=max_output_tokens)


def _try_parse_json(raw: str) -> dict[str, Any]:
    """Parse a JSON string robustly, stripping markdown fences and trailing commas."""
    raw = _strip_code_fence(raw)
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        pass
    match = re.search(r"\{.*\}", raw, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            pass
    logger.warning("[AI] Could not parse JSON, raw preview: %.200s", raw)
    return {}


def slugify(text: str, *, max_len: int = 80) -> str:
    """Lowercase, hyphenate, strip non-alphanumerics. Used for FAQ slugs."""
    s = text.lower().strip()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    s = re.sub(r"-+", "-", s).strip("-")
    return s[:max_len] or "untitled"
