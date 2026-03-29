from fastapi import APIRouter, Depends, WebSocket, Request
from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi.responses import Response
from prometheus_client import generate_latest

from app.db.database import get_db
from app.observability.metrics import (
    ingestion_counter,
    error_counter,
    detection_counter
)

import asyncio
import time

router = APIRouter()

# 🧠 store last valid schema (fallback)
last_valid_schema = {}

# =========================
# 📊 METRICS (DB)
# =========================
@router.get("/metrics")
def get_metrics(db: Session = Depends(get_db)):
    try:
        result = db.execute(text("SELECT * FROM node_metrics"))
        rows = result.fetchall()

        return [
            {
                "node_id": r.node_id,
                "avg_latency": float(r.avg_latency),
                "max_latency": float(r.max_latency),
                "total_events": r.total_events,
            }
            for r in rows
        ]
    except Exception as e:
        error_counter.inc()  # 🔥 track DB errors
        return {"error": str(e)}


# =========================
# 🌍 NODES
# =========================
@router.get("/nodes")
def get_nodes():
    return [
        {"node_id": "node-1", "lat": 28.6139, "lng": 77.2090, "status": "healthy"},
        {"node_id": "node-2", "lat": 19.0760, "lng": 72.8777, "status": "sleeper"},
        {"node_id": "node-3", "lat": 13.0827, "lng": 80.2707, "status": "critical"},
    ]


# =========================
# 🚨 ALERTS
# =========================
@router.get("/alerts")
def get_alerts():
    return [
        {"node_id": "node-2", "message": "High latency detected"},
        {"node_id": "node-3", "message": "Node down"},
    ]


# =========================
# ⚡ WEBSOCKET (REAL-TIME)
# =========================
@router.websocket("/ws/metrics")
async def websocket_metrics(websocket: WebSocket):
    await websocket.accept()

    while True:
        data = [
            {
                "node_id": "node-1",
                "avg_latency": 120,
                "max_latency": 300,
                "total_events": 45,
                "status": "healthy"
            },
            {
                "node_id": "node-2",
                "avg_latency": 450,
                "max_latency": 800,
                "total_events": 90,
                "status": "critical"
            }
        ]

        await websocket.send_json(data)
        await asyncio.sleep(2)


# =========================
# 🔥 INGEST (PHASE 10 + 11)
# =========================
@router.post("/ingest")
async def ingest(request: Request):
    global last_valid_schema

    request_id = str(time.time())
    print(f"TRACE START: {request_id}")

    # 🧪 1. Corrupted logs
    try:
        payload = await request.json()
    except Exception as e:
        print("❌ Corrupted JSON:", e)
        error_counter.inc()  # 🔥 metric
        return {"status": "error", "reason": "corrupted_json"}

    # 🧪 2. Missing schema fallback
    if isinstance(payload, dict):
        last_valid_schema = payload
    elif last_valid_schema:
        print("⚠️ Using fallback schema")
        payload = last_valid_schema
    else:
        error_counter.inc()
        return {"status": "error", "reason": "no_valid_schema"}

    events = payload.get("events", [])

    processed = []

    for event in events:
        ingestion_counter.inc()  # 🔥 track ingestion

        try:
            node_id = event.get("node_id", "unknown")
            latency = float(event.get("response_time", 0))
            status_code = event.get("status_code", 200)

            # 🧪 Partial decode
            if latency <= 0:
                latency = 0

            # 🧠 detection logic
            if status_code >= 500:
                status = "critical"
            elif latency > 400:
                status = "sleeper"
            else:
                status = "healthy"

            # 🚨 detection metric
            if status in ["critical", "sleeper"]:
                detection_counter.inc()

            # 🧪 Clock drift
            timestamp = event.get("timestamp", time.time())
            if timestamp > time.time() + 60:
                timestamp = time.time()

            processed.append({
                "node_id": node_id,
                "latency": latency,
                "status": status,
                "timestamp": timestamp
            })

        except Exception as e:
            print("⚠️ Partial decode failure:", e)
            error_counter.inc()

            processed.append({
                "node_id": "unknown",
                "latency": 0,
                "status": "unknown",
                "timestamp": time.time()
            })

    print(f"TRACE END: {request_id}")

    return {
        "status": "ok",
        "processed": processed
    }


# =========================
# 📈 PROMETHEUS ENDPOINT (PHASE 11 PART 2)
# =========================
@router.get("/metrics/prometheus")
def prometheus_metrics():
    return Response(generate_latest(), media_type="text/plain")