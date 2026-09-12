def reconstruct_attack_chain(incidents):
    """
    Convert correlated incidents into attack-chain timelines
    and graph-friendly structures.
    """

    reconstructed = []

    for incident in incidents:

        events = incident["events"]

        timeline = []
        nodes = []
        edges = []

        for index, event in enumerate(events):

            stage = classify_stage(event["event_type"])

            node = {
                "event_id": event["event_id"],
                "timestamp": event["timestamp"],
                "event_type": event["event_type"],
                "stage": stage,
                "severity": event["severity"],
                "anomaly_score": event["anomaly_score"]
            }

            timeline.append(node)
            nodes.append(node)

            if index > 0:
                previous_event = events[index - 1]

                edges.append({
                    "from": previous_event["event_id"],
                    "to": event["event_id"],
                    "relationship": "temporal_sequence"
                })

        reconstructed.append({
            "incident_id": incident["incident_id"],
            "start_time": incident["start_time"],
            "end_time": incident["end_time"],
            "users": incident["users"],
            "source_ips": incident["source_ips"],
            "event_count": incident["event_count"],
            "timeline": timeline,
            "graph": {
                "nodes": nodes,
                "edges": edges
            }
        })

    return reconstructed


def classify_stage(event_type):
    """
    Map security events to attack-chain activity stages.
    """

    stages = {
        "login_failed": "Authentication",
        "login_success": "Authentication",

        "process_start": "Execution",

        "dns_query": "Network Activity",
        "network_connection": "Network Activity",

        "file_access": "Resource Access",

        "privilege_change": "Privilege / Account Activity"
    }

    return stages.get(event_type, "Other")