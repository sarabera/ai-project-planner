"""API route handlers."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import get_db
from app.schemas.plan import (
    GeneratePlanRequest,
    GeneratePlanResponse,
    PlanHistoryItem,
    SavePlanRequest,
    SavePlanResponse,
)
from app.services.history_service import HistoryService
from app.services.planner_service import PlannerService

router = APIRouter(prefix="/api", tags=["planner"])


def get_planner_service() -> PlannerService:
    return PlannerService()


@router.post("/generate-plan", response_model=GeneratePlanResponse)
async def generate_plan(
    request: GeneratePlanRequest,
    planner: PlannerService = Depends(get_planner_service),
) -> GeneratePlanResponse:
    """Generate a software development plan using AI."""
    try:
        plan = await planner.generate_plan(request)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc
    except RuntimeError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(exc),
        ) from exc

    return GeneratePlanResponse(plan=plan)


@router.get("/history", response_model=list[PlanHistoryItem])
async def get_history(
    session: AsyncSession = Depends(get_db),
) -> list[PlanHistoryItem]:
    """List all saved plans."""
    service = HistoryService(session)
    return await service.list_plans()


@router.get("/history/{plan_id}", response_model=PlanHistoryItem)
async def get_plan_by_id(
    plan_id: int,
    session: AsyncSession = Depends(get_db),
) -> PlanHistoryItem:
    """Get a single plan by ID."""
    service = HistoryService(session)
    plan = await service.get_plan(plan_id)
    if plan is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Plan with id {plan_id} not found.",
        )
    return plan


@router.post("/save", response_model=SavePlanResponse)
async def save_plan(
    request: SavePlanRequest,
    session: AsyncSession = Depends(get_db),
) -> SavePlanResponse:
    """Save a generated plan to history."""
    service = HistoryService(session)
    saved = await service.save_plan(request)
    return SavePlanResponse(id=saved.id)


@router.delete("/history/{plan_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_plan(
    plan_id: int,
    session: AsyncSession = Depends(get_db),
) -> None:
    """Delete a plan from history."""
    service = HistoryService(session)
    deleted = await service.delete_plan(plan_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Plan with id {plan_id} not found.",
        )
