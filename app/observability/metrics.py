from prometheus_client import Counter

# 🔥 ingestion tracking
ingestion_counter = Counter(
    "ingestion_events_total",
    "Total number of ingested events"
)

# ❌ errors
error_counter = Counter(
    "ingestion_errors_total",
    "Total ingestion errors"
)

# 🚨 detections
detection_counter = Counter(
    "detections_total",
    "Total detected anomalies"
)