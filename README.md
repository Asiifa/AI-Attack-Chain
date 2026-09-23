🛡️ AI Attack Chain Investigator

An AI-based cybersecurity investigation system that reconstructs suspicious activity from security logs, calculates incident risk, extracts evidence, and generates explainable incident assessments.







✨ Key Features

🔍 Security Event Analysis

The system converts raw security logs into structured events and identifies suspicious activity through a multi-stage investigation pipeline.

CSV Log Ingestion — Imports security events from sample CSV logs.

Event Normalization — Converts raw events into a common OCSF-inspired structure.

Anomaly Detection — Assigns anomaly scores to suspicious events.

Event Correlation — Groups related security events into incidents.

Attack-Chain Reconstruction — Builds a chronological sequence of related activities.

Risk Scoring — Calculates a deterministic risk score and risk level.

Evidence Extraction — Identifies verified events supporting an incident.

Explainable Investigation — Generates an evidence-grounded explanation of why an incident is risky.

🖥️ SOC-Style Dashboard

A modern React-based interface provides a centralized view of security activity.

Security Overview — High-level view of monitored events and incidents.

Incident Listing — Displays correlated incidents with risk information.

Investigation View — Detailed analysis of individual incidents.

Attack Chain Visualization — Shows suspicious events in chronological order.

Risk Factors — Displays the factors contributing to an incident's score.

Evidence Cards — Presents important events supporting the investigation.

Investigation Explanation — Provides a readable summary of the incident.

⚙️ Backend & API

The backend provides a FastAPI service for processing and exposing investigation results.

REST API endpoints

SQLAlchemy database integration

SQLite storage

Pandas-based CSV processing

Automatic database table creation

Interactive Swagger API documentation

🏗️ Architecture

                Security Logs
                      │
                      ▼
                Log Ingestion
                      │
                      ▼
             Event Normalization
                      │
                      ▼
              Anomaly Detection
                      │
                      ▼
              Event Correlation
                      │
                      ▼
          Attack-Chain Reconstruction
                      │
                      ▼
                 Risk Scoring
                      │
                      ▼
              Evidence Extraction
                      │
                      ▼
           Explainable Investigation
                      │
                      ▼
              React SOC Dashboard

📸 Screenshots

Security Dashboard

![Security Dashboard](screenshots/dashboard.png)

Incidents

![Incidents](screenshots/incidents.png)

Investigation

![Investigation](screenshots/investigation.png)

🛠️ Tech Stack

Component

Technology

Frontend

React, Vite, JavaScript

UI Icons

Lucide React

Backend

Python, FastAPI

Data Processing

Pandas

ORM

SQLAlchemy

Database

SQLite

API Documentation

FastAPI / Swagger

🚀 Quick Start

Prerequisites

Make sure you have:

Python 3.x

Node.js and npm

Git

1. Clone the Repository

git clone https://github.com/Asiifa/AI-Attack-Chain.git
cd AI-Attack-Chain

2. Create the Python Virtual Environment

python -m venv venv

3. Activate the Environment

For Windows PowerShell:

.\venv\Scripts\Activate.ps1

4. Install Backend Dependencies

pip install -r requirements.txt

5. Install Frontend Dependencies

cd frontend
npm install

▶️ Run the Application

The backend and frontend run in separate terminals.

Backend

From the project root:

uvicorn backend.main:app --reload

Backend:

http://localhost:8000

Swagger API documentation:

http://localhost:8000/docs

Frontend

Open another terminal:

cd frontend
npm run dev

Frontend:

http://localhost:5173

🔄 Investigation Workflow

The complete V1 pipeline is:

CSV Logs
    ↓
Normalization
    ↓
Anomaly Detection
    ↓
Event Correlation
    ↓
Attack-Chain Reconstruction
    ↓
Risk Score
    ↓
Evidence
    ↓
Explanation
    ↓
Dashboard

🌐 API Endpoints

Method

Endpoint

Purpose

GET

/

Check API status

GET

/health

Health check

POST

/ingest

Import sample security logs

GET

/events

Retrieve security events

GET

/events/count

Get total event count

GET

/events/normalized

View normalized events

GET

/events/anomalies

View detected anomalies

GET

/incidents/correlated

View correlated incidents

GET

/incidents/reconstructed

View reconstructed attack chains

GET

/incidents/risk

View incident risk scores

GET

/incidents/evidence

View incident evidence

GET

/incidents/explanation

View incident explanations

Interactive API documentation:

http://localhost:8000/docs

📂 Project Structure

AI-Attack-Chain/
│
├── backend/
│   ├── main.py
│   │
│   ├── database/
│   │   ├── connection.py
│   │   └── schema.py
│   │
│   └── services/
│       ├── ingestion.py
│       ├── anomaly_detection.py
│       ├── correlation.py
│       ├── reconstruction.py
│       ├── risk.py
│       ├── evidence.py
│       └── explanation.py
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   └── Investigation.jsx
│   │   ├── services/
│   │   └── ...
│   └── ...
│
├── data/
│   └── sample/
│       └── sample_logs.csv
│
├── screenshots/
│   ├── dashboard.png
│   ├── incidents.png
│   └── investigation.png
│
├── README.md
├── requirements.txt
└── .gitignore


🧪 Testing

The backend can be tested using the interactive Swagger interface:

http://localhost:8000/docs

The main frontend flow can be verified through:

Dashboard
    ↓
Incidents
    ↓
Investigation

The investigation page should display:

Incident details

Attack chain

Investigation timeline

Risk factors

Evidence

Explanation

⚠️ Current Limitations

The current V1 implementation is designed as an academic project and uses:

Sample security logs

CSV-based ingestion

Local SQLite storage

Deterministic risk scoring

A limited set of event types and correlation rules

It is not intended to replace a production SIEM or enterprise incident-response platform.

🚧 Roadmap

V1 — Completed

CSV security log ingestion

Event normalization

Anomaly detection

Event correlation

Attack-chain reconstruction

Risk scoring

Evidence extraction

Explainable investigation

SOC-style dashboard

V2 — Planned

JSON log support

Multiple log-source support

MITRE ATT&CK technique mapping

Automated investigation reports

Advanced attack-chain analysis

🤝 Contributing

Contributions, suggestions, and improvements are welcome.

To contribute:

Fork the repository.

Create a feature branch.

Make your changes.

Test the application.

Submit a pull request.

🔐 Responsible Use

This project is intended for defensive cybersecurity research, education, security monitoring, and authorized incident investigation.

Only use the system with security data and systems that you are authorized to analyze.
