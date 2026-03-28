from app.services.decoding_service import decode_node_id
from datetime import datetime

def normalize_log(body):
    node_id = body.get("identifier")
    http_status = body.get("code")
    response_time = body.get("response_time")

    # Handle missing / bad data
    if not node_id:
        node_id = "unknown_node"

    if http_status is None:
        http_status = 0

    if response_time is None:
        response_time = 0

    return {
        "node_id": decode_node_id(node_id),
        "http_status": http_status,
        "response_time": response_time,
        "timestamp": datetime.utcnow()
    }