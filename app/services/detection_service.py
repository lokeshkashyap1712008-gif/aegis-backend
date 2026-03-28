def detect(event):
    alerts = []

    if event["response_time"] > 1000:
        alerts.append({"type": "DDOS", "severity": 8})

    if event["http_status"] == 200 and event["response_time"] > 800:
        alerts.append({"type": "SLEEPER", "severity": 9})

    return alerts