from backend.database.schema import Event


def normalize_event(event: Event):
    """
    Convert a raw security event into a common
    OCSF-inspired normalized structure.
    """

    normalized = {
        "event_id": event.id,
        "timestamp": event.timestamp.isoformat(),
        "category": get_category(event.event_type),
        "activity": event.event_type,
        "source": event.source,
        "user": event.username,
        "source_ip": event.source_ip,
        "destination_ip": event.destination_ip,
        "hostname": event.hostname,
        "severity": event.severity,
        "anomaly_score": event.anomaly_score
    }

    return normalized


def get_category(event_type: str):
    """
    Map event types into common security categories.
    """

    categories = {
        "login_success": "Authentication",
        "login_failed": "Authentication",
        "file_access": "File Activity",
        "process_start": "Process Activity",
        "dns_query": "Network Activity",
        "network_connection": "Network Activity",
        "privilege_change": "Account Activity"
    }

    return categories.get(event_type, "Other")