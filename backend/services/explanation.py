def generate_explanation(incident, risk, evidence):
    """
    Generate an evidence-grounded explanation
    for a reconstructed security incident.
    """

    events = incident["timeline"]

    if not events:
        return {
            "incident_id": incident["incident_id"],
            "explanation": "No sufficient evidence was found."
        }

    user = ", ".join(incident["users"]) if incident["users"] else "Unknown user"

    source_ips = (
        ", ".join(incident["source_ips"])
        if incident["source_ips"]
        else "Unknown IP"
    )

    risk_score = risk["risk_score"]
    risk_level = risk["risk_level"]

    event_types = [
        event["event_type"]
        for event in events
    ]

    critical_events = [
        event
        for event in events
        if str(event["severity"]).lower() == "critical"
    ]

    explanation = (
        f"The incident involves user {user} from source IP "
        f"{source_ips}. "
        f"The system identified {len(events)} correlated security events "
        f"across {risk['factors']['stages_detected']} activity stages. "
        f"The calculated risk score is {risk_score}/100, classified as "
        f"{risk_level}. "
    )

    if critical_events:
        explanation += (
            f"There were {len(critical_events)} critical-severity events, "
            f"including "
            f"{', '.join(event['event_type'] for event in critical_events)}. "
        )

    explanation += (
        f"The observed event sequence was: "
        f"{' → '.join(event_types)}. "
        f"This explanation is based only on the verified events and "
        f"calculated risk factors associated with the incident."
    )

    return {
        "incident_id": incident["incident_id"],
        "risk_score": risk_score,
        "risk_level": risk_level,
        "explanation": explanation,
        "evidence_count": evidence["evidence_count"]
    }