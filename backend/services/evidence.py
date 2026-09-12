def extract_evidence(incident):
    """
    Extract important evidence from a reconstructed incident.
    """

    events = incident["timeline"]

    evidence = []

    for event in events:

        severity = str(event["severity"]).lower()

        if severity in ["high", "critical"]:
            evidence.append({
                "event_id": event["event_id"],
                "timestamp": event["timestamp"],
                "event_type": event["event_type"],
                "stage": event["stage"],
                "severity": event["severity"],
                "anomaly_score": event["anomaly_score"],
                "reason": (
                    f"{severity.capitalize()} severity "
                    f"{event['event_type']} detected"
                )
            })

    return {
        "incident_id": incident["incident_id"],
        "evidence_count": len(evidence),
        "evidence": evidence
    }