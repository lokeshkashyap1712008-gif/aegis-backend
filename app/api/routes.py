from fastapi import APIRouter
from app.pipeline.processor import process_log
from app.models.schemas import LogRequest

router = APIRouter()

@router.post("/ingest")
async def ingest(data: LogRequest):
    return process_log(data.dict())