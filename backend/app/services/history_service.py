"""Plan history persistence service."""

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.plan import Plan
from app.schemas.plan import PlanHistoryItem, SavePlanRequest


class HistoryService:
    """CRUD operations for stored plans."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def list_plans(self) -> list[PlanHistoryItem]:
        """Return all plans ordered by newest first."""
        result = await self._session.execute(
            select(Plan).order_by(Plan.created_at.desc())
        )
        plans = result.scalars().all()
        return [PlanHistoryItem.model_validate(plan) for plan in plans]

    async def get_plan(self, plan_id: int) -> PlanHistoryItem | None:
        """Fetch a single plan by ID."""
        result = await self._session.execute(select(Plan).where(Plan.id == plan_id))
        plan = result.scalar_one_or_none()
        if plan is None:
            return None
        return PlanHistoryItem.model_validate(plan)

    async def save_plan(self, request: SavePlanRequest) -> PlanHistoryItem:
        """Persist a generated plan."""
        plan = Plan(
            project_idea=request.project_idea,
            industry=request.industry,
            budget=request.budget,
            project_type=request.project_type,
            experience_level=request.experience_level,
            generated_plan=request.generated_plan,
        )
        self._session.add(plan)
        await self._session.flush()
        await self._session.refresh(plan)
        return PlanHistoryItem.model_validate(plan)

    async def delete_plan(self, plan_id: int) -> bool:
        """Delete a plan by ID. Returns True if deleted."""
        result = await self._session.execute(
            delete(Plan).where(Plan.id == plan_id)
        )
        return result.rowcount > 0
