"""Request and response schemas for plan endpoints."""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator


Industry = Literal[
    "Healthcare",
    "Finance",
    "Education",
    "Hotel",
    "E-commerce",
    "AI",
    "SaaS",
    "Other",
]
Budget = Literal["Low", "Medium", "High"]
ProjectType = Literal["MVP", "Startup", "Enterprise", "Student Project"]
ExperienceLevel = Literal["Beginner", "Intermediate", "Advanced"]


class GeneratePlanRequest(BaseModel):
    """Input payload for plan generation."""

    project_idea: str = Field(..., min_length=10, max_length=5000)
    industry: Industry = "Other"
    budget: Budget = "Medium"
    project_type: ProjectType = "MVP"
    experience_level: ExperienceLevel = "Intermediate"

    @field_validator("project_idea")
    @classmethod
    def strip_idea(cls, value: str) -> str:
        cleaned = value.strip()
        if len(cleaned) < 10:
            raise ValueError("Project idea must be at least 10 characters.")
        return cleaned


class GeneratePlanResponse(BaseModel):
    """Generated plan markdown."""

    plan: str


class SavePlanRequest(BaseModel):
    """Payload to persist a generated plan."""

    project_idea: str = Field(..., min_length=10, max_length=5000)
    industry: Industry = "Other"
    budget: Budget = "Medium"
    project_type: ProjectType = "MVP"
    experience_level: ExperienceLevel = "Intermediate"
    generated_plan: str = Field(..., min_length=50)


class SavePlanResponse(BaseModel):
    """Response after saving a plan."""

    id: int
    message: str = "Plan saved successfully."


class PlanHistoryItem(BaseModel):
    """Single plan record from history."""

    id: int
    project_idea: str
    industry: str
    budget: str
    project_type: str
    experience_level: str
    generated_plan: str
    created_at: datetime

    model_config = {"from_attributes": True}
