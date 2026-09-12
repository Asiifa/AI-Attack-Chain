import pandas as pd

from datetime import datetime

from sqlalchemy.orm import Session

from backend.database.schema import Event


def ingest_csv(file_path: str, db: Session):
    """
    Read security logs from a CSV file and store only new events
    in the events table.
    """

    df = pd.read_csv(file_path)

    new_events = []
    skipped_events = 0

    for _, row in df.iterrows():

        timestamp = datetime.strptime(
            row["timestamp"],
            "%Y-%m-%d %H:%M:%S"
        )

        # Check whether this event already exists
        existing_event = db.query(Event).filter(
            Event.timestamp == timestamp,
            Event.event_type == row["event_type"],
            Event.source == row["source"],
            Event.username == row.get("username"),
            Event.source_ip == row.get("source_ip"),
            Event.destination_ip == row.get("destination_ip"),
            Event.hostname == row.get("hostname"),
            Event.severity == row.get("severity")
        ).first()

        if existing_event:
            skipped_events += 1
            continue

        event = Event(
            timestamp=timestamp,
            event_type=row["event_type"],
            source=row["source"],
            username=row.get("username"),
            source_ip=row.get("source_ip"),
            destination_ip=row.get("destination_ip"),
            hostname=row.get("hostname"),
            severity=row.get("severity")
        )

        new_events.append(event)

    db.add_all(new_events)
    db.commit()

    return len(new_events)