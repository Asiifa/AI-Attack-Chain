from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from backend.database.connection import engine, Base, get_db
from backend.database import schema

from backend.services.ingestion import ingest_csv
from backend.services.normalization import normalize_event
from backend.services.detection import detect_anomalies
from backend.services.correlation import correlate_events
from backend.services.reconstruction import reconstruct_attack_chain
from backend.services.risk_engine import calculate_risk
from backend.services.evidence import extract_evidence
from backend.services.explanation import generate_explanation




# Create database tables
Base.metadata.create_all(bind=engine)


# Create FastAPI application
app = FastAPI(
    title="AI Attack Chain Investigator",
    description="AI-based attack-chain reconstruction and explainable incident investigation system",
    version="1.0.0"
)


# Allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# BASIC ENDPOINTS
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "AI Attack Chain Investigator API is running",
        "status": "success"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# --------------------------------------------------
# INGESTION
# --------------------------------------------------

@app.post("/ingest")
def ingest_logs(db: Session = Depends(get_db)):

    file_path = "data/sample/sample_logs.csv"

    count = ingest_csv(file_path, db)

    return {
        "message": "Security logs imported successfully",
        "events_imported": count
    }


# --------------------------------------------------
# NORMALIZATION
# --------------------------------------------------

@app.get("/events/normalized")
def get_normalized_events(
    db: Session = Depends(get_db)
):

    events = db.query(schema.Event).all()

    normalized_events = [
        normalize_event(event)
        for event in events
    ]

    return {
        "count": len(normalized_events),
        "events": normalized_events
    }


# --------------------------------------------------
# ANOMALY DETECTION
# --------------------------------------------------

@app.get("/events/anomalies")
def get_anomalies(
    db: Session = Depends(get_db)
):

    results = detect_anomalies(db)

    return {
        "count": len(results),
        "anomalies": results
    }


# --------------------------------------------------
# EVENT CORRELATION
# --------------------------------------------------

@app.get("/incidents/correlated")
def get_correlated_incidents(
    db: Session = Depends(get_db)
):

    incidents = correlate_events(db)

    return {
        "count": len(incidents),
        "incidents": incidents
    }


# --------------------------------------------------
# ATTACK-CHAIN RECONSTRUCTION
# --------------------------------------------------

@app.get("/incidents/reconstructed")
def get_reconstructed_incidents(
    db: Session = Depends(get_db)
):

    incidents = correlate_events(db)

    reconstructed = reconstruct_attack_chain(incidents)

    return {
        "count": len(reconstructed),
        "incidents": reconstructed
    }


# --------------------------------------------------
# RISK ENGINE
# --------------------------------------------------

@app.get("/incidents/risk")
def get_incident_risk(
    db: Session = Depends(get_db)
):

    incidents = correlate_events(db)

    reconstructed = reconstruct_attack_chain(incidents)

    results = []

    for incident in reconstructed:

        risk = calculate_risk(incident)

        results.append({
            "incident_id": incident["incident_id"],
            "users": incident["users"],
            "source_ips": incident["source_ips"],
            "start_time": incident["start_time"],
            "end_time": incident["end_time"],
            "risk": risk
        })

    return {
        "count": len(results),
        "incidents": results
    }


# --------------------------------------------------
# EVIDENCE
# --------------------------------------------------

@app.get("/incidents/evidence")
def get_incident_evidence(
    db: Session = Depends(get_db)
):

    incidents = correlate_events(db)

    reconstructed = reconstruct_attack_chain(incidents)

    results = []

    for incident in reconstructed:

        evidence = extract_evidence(incident)

        results.append(evidence)

    return {
        "count": len(results),
        "incidents": results
    }


# --------------------------------------------------
# EXPLANATION
# --------------------------------------------------

@app.get("/incidents/explanation")
def get_incident_explanations(
    db: Session = Depends(get_db)
):

    incidents = correlate_events(db)

    reconstructed = reconstruct_attack_chain(incidents)

    results = []

    for incident in reconstructed:

        risk = calculate_risk(incident)

        evidence = extract_evidence(incident)

        explanation = generate_explanation(
            incident,
            risk,
            evidence
        )

        results.append(explanation)

    return {
        "count": len(results),
        "incidents": results
    }
@app.get("/events/count")
def get_event_count(
    db: Session = Depends(get_db)
):
    count = db.query(schema.Event).count()

    return {
        "count": count
    }


@app.get("/events")
def get_events(
    db: Session = Depends(get_db)
):
    events = (
        db.query(schema.Event)
        .order_by(schema.Event.timestamp)
        .all()
    )

    results = [
        normalize_event(event)
        for event in events
    ]

    return {
        "count": len(results),
        "events": results
    }
@app.get("/incidents/{incident_id}/explanation")
def get_incident_explanation(
    incident_id: int,
    db: Session = Depends(get_db)
):
    incidents = correlate_events(db)

    incident = next(
        (
            item
            for item in incidents
            if item["incident_id"] == incident_id
        ),
        None
    )

    if not incident:
        return {
            "error": "Incident not found"
        }

    event_ids = [
        event["event_id"]
        for event in incident["events"]
    ]

    incident_events = (
        db.query(schema.Event)
        .filter(schema.Event.id.in_(event_ids))
        .order_by(schema.Event.timestamp)
        .all()
    )

    risk_score = 0

    if incident_events:
        max_anomaly = max(
            event.anomaly_score or 0
            for event in incident_events
        )

        event_count = len(incident_events)

        risk_score = min(
            100,
            max_anomaly + (event_count * 6)
        )

    if risk_score >= 81:
        risk_level = "CRITICAL"
    elif risk_score >= 61:
        risk_level = "HIGH"
    elif risk_score >= 31:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    explanation = generate_explanation(
        incident_events,
        risk_score,
        risk_level
    )

    return {
        "incident_id": incident_id,
        "risk_score": round(risk_score, 2),
        "risk_level": risk_level,
        "explanation": explanation
    }