from app.services.ingestion_service import normalize_log
from app.services.detection_service import detect
from app.models.db import SessionLocal
from app.models.models import Event, Alert

def process_log(body):
    db = SessionLocal()

    normalized = normalize_log(body)

    event = Event(**normalized)
    db.add(event)

    alerts = detect(normalized)

    for a in alerts:
        db.add(Alert(node_id=normalized["node_id"], **a))

    db.commit()
    db.close()

    return normalized, alerts