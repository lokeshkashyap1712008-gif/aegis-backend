from collections import defaultdict, deque
import statistics
import time

# store last 50 events per node
node_history = defaultdict(lambda: deque(maxlen=50))

def detect(event):
    alerts = []

    node_id = event.get("node_id")
    response_time = event.get("response_time", 0)
    http_status = event.get("http_status", 0)
    timestamp = time.time()

    # store event
    node_history[node_id].append({
        "response_time": response_time,
        "http_status": http_status,
        "timestamp": timestamp
    })

    history = node_history[node_id]

    
    if http_status >= 500:
        alerts.append({"type": "CRITICAL", "severity": 10})

   
    if http_status == 200 and response_time > 800:
        alerts.append({"type": "SLEEPER", "severity": 9})

   
    if len(history) >= 10:
        recent = list(history)[-10:]

        fail_count = sum(1 for e in recent if e["http_status"] >= 500)
        avg_latency = statistics.mean(e["response_time"] for e in recent)

        if fail_count >= 5:
            alerts.append({"type": "DDOS", "severity": 9})

        if avg_latency > 1000:
            alerts.append({"type": "HIGH_LATENCY_CLUSTER", "severity": 8})

    risk_score = calculate_risk(alerts)

    return {
        "alerts": alerts,
        "risk_score": risk_score
    }

def calculate_risk(alerts):
    return sum(a["severity"] for a in alerts)



