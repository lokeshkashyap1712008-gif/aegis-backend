from fastapi import APIRouter
from app.pipeline.processor import process_log
from app.models.schemas import LogRequest
from app.models.db import SessionLocal
from app.models.models import Event, Alert

router = APIRouter()

# ---------------------------
# INGEST (already working)
# ---------------------------
@router.post("/ingest")
async def ingest(data: LogRequest):
    return process_log(data.dict())


# ---------------------------
# 1. NODES OVERVIEW
# ---------------------------
@router.get("/nodes")
def get_nodes():
    db = SessionLocal()

    events = db.query(Event).all()

    node_map = {}

    for e in events:
        if e.node_id not in node_map:
            node_map[e.node_id] = {
                "node_id": e.node_id,
                "avg_latency": [],
                "status": "healthy"
            }

        node_map[e.node_id]["avg_latency"].append(e.response_time)

        if e.http_status >= 500:
            node_map[e.node_id]["status"] = "critical"

    # compute avg latency
    result = []
    for node in node_map.values():
        avg = sum(node["avg_latency"]) / len(node["avg_latency"])
        node["avg_latency"] = avg
        result.append(node)

    db.close()
    return result


# ---------------------------
# 2. ALERTS
# ---------------------------
@router.get("/alerts")
def get_alerts():
    db = SessionLocal()

    alerts = db.query(Alert).order_by(Alert.timestamp.desc()).limit(50).all()

    result = [
        {
            "node_id": a.node_id,
            "type": a.type,
            "severity": a.severity,
            "timestamp": a.timestamp
        }
        for a in alerts
    ]

    db.close()
    return result


# ---------------------------
# 3. LATENCY METRICS
# ---------------------------
@router.get("/metrics/latency")
def get_latency_metrics():
    db = SessionLocal()

    events = db.query(Event).all()

    data = {}

    for e in events:
        if e.node_id not in data:
            data[e.node_id] = []

        data[e.node_id].append(e.response_time)

    result = []
    for node_id, values in data.items():
        result.append({
            "node_id": node_id,
            "avg_latency": sum(values) / len(values),
            "max_latency": max(values),
            "count": len(values)
        })

    db.close()
    return result


# ---------------------------
# 4. SCHEMA INFO
# ---------------------------
@router.get("/schema")
def get_schema():
    return {
        "fields": [
            "node_id",
            "http_status",
            "response_time",
            "timestamp"
        ],
        "description": "Canonical normalized schema"
    }