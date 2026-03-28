from app.services.decoding_service import decode_node_id
from datetime import datetime

def normalize_log(body):
    return {
        "node_id": decode_node_id(body.get("identifier")),
        "http_status": body.get("code"),
        "response_time": body.get("response_time"),
        "timestamp": datetime.utcnow()
    }