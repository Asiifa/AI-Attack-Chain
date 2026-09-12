from datetime import timedelta
from sqlalchemy.orm import Session

from backend.database.schema import Event


def correlate_events(db: Session):
    """
    Group related suspicious events into potential incidents.

    Events are considered related when they share the same
    user or source IP and occur within a short time window.
    """

    events = (
        db.query(Event)
        .filter(Event.anomaly_score != None)
        .order_by(Event.timestamp)
        .all()
    )

    if not events:
        return []

    suspicious_events = [
        event
        for event in events
        if event.anomaly_score >= 50
    ]

    incidents = []
    current_incident = []

    for event in suspicious_events:

        if not current_incident:
            current_incident = [event]
            continue

        previous_event = current_incident[-1]

        same_user = (
            event.username is not None
            and event.username == previous_event.username
        )

        same_ip = (
            event.source_ip is not None
            and event.source_ip == previous_event.source_ip
        )

        within_time_window = (
            event.timestamp - previous_event.timestamp
            <= timedelta(minutes=15)
        )

        if (same_user or same_ip) and within_time_window:
            current_incident.append(event)

        else:
            incidents.append(current_incident)
            current_incident = [event]

    if current_incident:
        incidents.append(current_incident)

    return format_incidents(incidents)


def format_incidents(incidents):
    """
    Convert grouped events into a JSON-friendly structure.
    """

    results = []

    for index, incident_events in enumerate(incidents, start=1):

        results.append({
            "incident_id": index,
            "event_count": len(incident_events),
            "start_time": incident_events[0].timestamp.isoformat(),
            "end_time": incident_events[-1].timestamp.isoformat(),
            "users": list({
                event.username
                for event in incident_events
                if event.username
            }),
            "source_ips": list({
                event.source_ip
                for event in incident_events
                if event.source_ip
            }),
            "events": [
                {
                    "event_id": int(event.id),
                    "event_type": event.event_type,
                    "timestamp": event.timestamp.isoformat(),
                    "severity": event.severity,
                    "anomaly_score": float(event.anomaly_score)
                }
                for event in incident_events
            ]
        })

    return results