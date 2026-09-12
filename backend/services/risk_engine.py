def calculate_risk(incident):
    """
    Calculate a deterministic risk score from a reconstructed incident.

    Score range: 0-100
    """

    events = incident["timeline"]

    if not events:
        return {
            "risk_score": 0,
            "risk_level": "LOW"
        }

    # 1. Maximum anomaly score
    max_anomaly = max(
        event["anomaly_score"]
        for event in events
    )

    # 2. Number of events
    event_count = len(events)

    # 3. Count critical/high severity events
    critical_count = sum(
        1
        for event in events
        if str(event["severity"]).lower() == "critical"
    )

    high_count = sum(
        1
        for event in events
        if str(event["severity"]).lower() == "high"
    )

    # 4. Calculate individual components

    anomaly_component = max_anomaly * 0.35

    event_component = min(event_count * 5, 20)

    severity_component = min(
        (critical_count * 10) + (high_count * 6),
        25
    )

    # More stages = stronger attack-chain evidence
    stage_count = len({
        event["stage"]
        for event in events
    })

    correlation_component = min(
        stage_count * 5,
        20
    )

    # Final score
    risk_score = (
        anomaly_component
        + event_component
        + severity_component
        + correlation_component
    )

    risk_score = round(
        min(risk_score, 100),
        2
    )

    risk_level = get_risk_level(risk_score)

    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "factors": {
            "maximum_anomaly_score": round(max_anomaly, 2),
            "event_count": event_count,
            "critical_events": critical_count,
            "high_events": high_count,
            "stages_detected": stage_count
        }
    }


def get_risk_level(score):
    """
    Convert numerical risk score into a severity level.
    """

    if score <= 30:
        return "LOW"

    elif score <= 60:
        return "MEDIUM"

    elif score <= 80:
        return "HIGH"

    else:
        return "CRITICAL"