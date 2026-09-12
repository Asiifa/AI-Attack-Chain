from sqlalchemy.orm import Session
from sklearn.ensemble import IsolationForest

from backend.database.schema import Event


def detect_anomalies(db: Session):
    """
    Detect unusual security events using Isolation Forest.
    """

    events = db.query(Event).all()

    if not events:
        return []

    features = []

    for event in events:
        feature = [
            event.timestamp.hour,
            event.timestamp.minute,
            event.timestamp.second,

            1 if event.event_type == "login_failed" else 0,
            1 if event.event_type == "login_success" else 0,
            1 if event.event_type == "file_access" else 0,
            1 if event.event_type == "process_start" else 0,
            1 if event.event_type == "dns_query" else 0,
            1 if event.event_type == "network_connection" else 0,
            1 if event.event_type == "privilege_change" else 0,

            severity_value(event.severity)
        ]

        features.append(feature)

    model = IsolationForest(
        n_estimators=100,
        contamination=0.2,
        random_state=42
    )

    predictions = model.fit_predict(features)
    scores = model.decision_function(features)

    results = []

    for event, prediction, score in zip(events, predictions, scores):

        # Convert Isolation Forest score into a simple 0-100 anomaly score
        anomaly_score = round(
            max(0, min(100, (0.5 - score) * 100)),
            2
        )

        event.anomaly_score = anomaly_score

        results.append({
            "event_id": int(event.id),
            "event_type": event.event_type,
            "anomaly_score": float(anomaly_score),
            "is_anomaly": bool(prediction == -1)
        })

    db.commit()

    return results


def severity_value(severity):
    """
    Convert severity levels into numerical values.
    """

    values = {
        "low": 1,
        "medium": 2,
        "high": 3,
        "critical": 4
    }

    return values.get(str(severity).lower(), 0)