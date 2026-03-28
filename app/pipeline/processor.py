from app.services.ingestion_service import normalize_log
from app.services.detection_service import detect
from app.models.db import SessionLocal
from app.models.models import Event, Alert

def process_log(body):
    db = SessionLocal()

    # 1. Normalize input
    normalized = normalize_log(body)

    # 2. Save event
    event = Event(
        node_id=normalized["node_id"],
        http_status=normalized["http_status"],
        response_time=normalized["response_time"]
    )
    db.add(event)

    # 3. Run detection engine
    result = detect(normalized)

    alerts = result["alerts"]
    risk_score = result["risk_score"]

    # 4. Save alerts
    for a in alerts:
        db.add(Alert(
            node_id=normalized["node_id"],
            type=a["type"],
            severity=a["severity"]
        ))

    db.commit()
    db.close()

    # 5. Return response
    return {
        "normalized": normalized,
        "alerts": alerts,
        "risk_score": risk_score
    }