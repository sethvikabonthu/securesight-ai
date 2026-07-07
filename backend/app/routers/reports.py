from fastapi import APIRouter
from typing import List
from app.schemas.scan import ReportResponse

router = APIRouter()

@router.get("", response_model=List[ReportResponse])
async def get_reports():
    return [
        ReportResponse(id="rep-201", name="Weekly Threat Summary", date="2026-07-06", status="Generated", scansAnalyzed=45),
        ReportResponse(id="rep-202", name="Synthetic Media Audit - Q2", date="2026-07-01", status="Generated", scansAnalyzed=198),
        ReportResponse(id="rep-203", name="Credential Harvesting Analysis", date="2026-06-25", status="Generated", scansAnalyzed=74),
    ]
