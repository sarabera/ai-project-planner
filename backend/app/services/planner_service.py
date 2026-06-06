"""Gemini-powered plan generation service."""

import asyncio

from google import genai
from google.genai import types

from app.config import get_settings
from app.prompts.planner_prompt import SYSTEM_PROMPT, build_user_prompt
from app.schemas.plan import GeneratePlanRequest


class PlannerService:
    """Generates software development plans using Google Gemini."""

    def __init__(self) -> None:
        settings = get_settings()
        if not settings.gemini_api_key:
            raise ValueError(
                "GEMINI_API_KEY is not configured. Set it in your .env file. "
                "Get a free key at https://aistudio.google.com/apikey"
            )
        self._client = genai.Client(api_key=settings.gemini_api_key)
        self._model = settings.gemini_model

    async def generate_plan(self, request: GeneratePlanRequest) -> str:
        """Generate a markdown plan for the given project idea."""
        try:
            response = await asyncio.to_thread(
                self._client.models.generate_content,
                model=self._model,
                contents=build_user_prompt(request),
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_PROMPT,
                    temperature=0.7,
                    max_output_tokens=8192,
                ),
            )
        except Exception as exc:
            raise RuntimeError(f"Gemini API error: {exc}") from exc

        content = response.text
        if not content:
            raise RuntimeError("Gemini returned an empty response.")

        return content.strip()
