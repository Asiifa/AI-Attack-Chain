from backend.database.schema import Event


def generate_explanation(incident_events, risk_score, risk_level):
    """
    Generate an evidence-grounded explanation
    for a reconstructed security incident.
    """

    if not incident_events:
        return {
            "summary": "No suspicious events were found for this incident.",
            "findings": [],
            "evidence": [],
            "recommendation": "No immediate investigation is required."
        }

    users = list({
        event.username
        for event in incident_events
        if event.username
    })

    source_ips = list({
        event.source_ip
        for event in incident_events
        if event.source_ip
    })

    event_types = [
        event.event_type
        for event in incident_events
    ]

    findings = []

    # Authentication activity
    if "login_failed" in event_types:
        findings.append(
            "Failed authentication activity was observed."
        )

    # Successful login
    if "login_success" in event_types:
        findings.append(
            "A successful login occurred in the suspicious activity sequence."
        )

    # Process execution
    if "process_start" in event_types:
        findings.append(
            "Process execution activity was observed."
        )

    # Network activity
    if (
        "dns_query" in event_types
        or "network_connection" in event_types
    ):
        findings.append(
            "Network communication activity was observed during the incident."
        )

    # File activity
    if "file_access" in event_types:
        findings.append(
            "File access activity was observed."
        )

    # Privilege change
    if "privilege_change" in event_types:
        findings.append(
            "A privilege change was observed, increasing the significance of the incident."
        )

    # Temporal correlation
    if len(incident_events) >= 2:
        findings.append(
            "Multiple suspicious events occurred within the correlated time window."
        )

    user_text = ", ".join(users) if users else "an unknown user"
    ip_text = ", ".join(source_ips) if source_ips else "an unknown source"

    summary = (
        f"This {risk_level} risk incident involves {len(incident_events)} "
        f"correlated suspicious events associated with {user_text} "
        f"from source IP {ip_text}. "
        f"The calculated risk score is {risk_score:.2f}."
    )

    if risk_level in ["HIGH", "CRITICAL"]:
        recommendation = (
            "Prioritize investigation of the involved user, source IP, "
            "process activity, privilege changes, and network destinations."
        )
    elif risk_level == "MEDIUM":
        recommendation = (
            "Review the correlated events and verify whether the activity "
            "matches expected user behavior."
        )
    else:
        recommendation = (
            "Continue monitoring the activity and review the evidence "
            "if additional suspicious events appear."
        )

    evidence = []

    for event in incident_events:
        evidence.append({
            "event_id": int(event.id),
            "timestamp": event.timestamp.isoformat(),
            "event_type": event.event_type,
            "username": event.username,
            "source_ip": event.source_ip,
            "destination_ip": event.destination_ip,
            "hostname": event.hostname,
            "severity": event.severity,
            "anomaly_score": (
                float(event.anomaly_score)
                if event.anomaly_score is not None
                else None
            )
        })

    return {
        "summary": summary,
        "findings": findings,
        "evidence": evidence,
        "recommendation": recommendation
    }