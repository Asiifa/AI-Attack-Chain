# 🛡️ AI Attack Chain Investigator

### AI-Based Cybersecurity Investigation & Explainable Incident Analysis

AI Attack Chain Investigator is an AI-based cybersecurity investigation system that reconstructs suspicious activity from security logs, calculates incident risk, extracts supporting evidence, and generates explainable incident assessments.

The system transforms raw security logs into structured events, identifies anomalies, correlates related activities, reconstructs potential attack chains, and presents investigation results through a modern SOC-style dashboard.

> **Project Type:** Full-Stack Cybersecurity Application  
> **Version:** 1.0.0  
> **Frontend:** React + Vite  
> **Backend:** Python + FastAPI  
> **Database:** SQLite

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Investigation Workflow](#-investigation-workflow)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Dashboard & Investigation](#-dashboard--investigation)
- [Testing](#-testing)
- [Current Limitations](#-current-limitations)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Responsible Use](#-responsible-use)

---

## 🚀 Overview

Security logs contain valuable information about system activities, authentication attempts, network events, and potentially suspicious behavior.

However, investigating these events manually can be time-consuming, particularly when multiple activities are related to the same incident.

AI Attack Chain Investigator addresses this problem through a structured investigation pipeline.

### Core Objectives

- Import security events from CSV logs.
- Normalize raw security events into an OCSF-inspired structure.
- Detect suspicious activities using anomaly detection.
- Correlate related security events into incidents.
- Reconstruct chronological attack chains.
- Calculate deterministic incident risk scores.
- Extract supporting evidence from security events.
- Generate evidence-grounded incident explanations.
- Visualize investigation results through a SOC-style dashboard.

The application combines automated security analysis with explainable investigation results, helping users understand not only what happened but also why an incident was considered suspicious.

---

## ✨ Key Features

### 🔍 Security Event Analysis

The backend processes raw security logs through a multi-stage investigation pipeline.

**CSV Log Ingestion**

Imports security events from sample CSV log files.

**Event Normalization**

Converts raw security events into a common OCSF-inspired structure.

**Anomaly Detection**

Assigns anomaly scores to identify potentially suspicious events.

**Event Correlation**

Groups related security events into incidents based on correlation logic.

**Attack-Chain Reconstruction**

Builds a chronological sequence of related activities to represent potential attack progression.

**Risk Scoring**

Calculates deterministic incident risk scores and assigns corresponding risk levels.

**Evidence Extraction**

Identifies important events supporting an incident assessment.

**Explainable Investigation**

Generates evidence-grounded explanations describing why an incident is considered risky.

### 🖥️ SOC-Style Dashboard

A React-based interface provides a centralized view of security activity and investigation results.

**Security Overview**

Displays high-level information about monitored events and incidents.

**Incident Listing**

Presents correlated incidents with their associated risk information.

**Investigation View**

Provides detailed analysis of individual incidents.

**Attack Chain Visualization**

Displays suspicious activities in chronological order.

**Risk Factors**

Highlights factors contributing to an incident's risk score.

**Evidence Cards**

Presents important events supporting the investigation.

**Investigation Explanation**

Provides readable summaries explaining the incident assessment.

### ⚙️ Backend & API

The FastAPI backend provides the processing engine and REST API for the application.

- REST API endpoints
- SQLAlchemy database integration
- SQLite storage
- Pandas-based CSV processing
- Automatic database table creation
- Interactive Swagger API documentation

---

## 🏗️ System Architecture

The application follows a modular full-stack architecture.

### Investigation Pipeline

```text
              SECURITY LOGS
                    |
                    v
               Log Ingestion
                    |
                    v
           Event Normalization
                    |
                    v
            Anomaly Detection
                    |
                    v
             Event Correlation
                    |
                    v
        Attack-Chain Reconstruction
                    |
                    v
               Risk Scoring
                    |
                    v
             Evidence Extraction
                    |
                    v
          Explainable Investigation
                    |
                    v
             React SOC Dashboard
```

### Application Architecture

```text
                USER
                  |
                  v
        +---------------------+
        |   React Frontend    |
        |   Vite Application  |
        +---------------------+
                  |
                  | HTTP Requests
                  v
        +---------------------+
        |    FastAPI Backend  |
        +---------------------+
                  |
                  v
        +---------------------+
        | Investigation       |
        | Services            |
        +---------------------+
                  |
          +-------+-------+
          |               |
          v               v
     Data Processing   Risk & Evidence
          |               |
          +-------+-------+
                  |
                  v
        +---------------------+
        |   SQLAlchemy ORM    |
        +---------------------+
                  |
                  v
        +---------------------+
        |    SQLite Database |
        +---------------------+
```

---

## 🔄 Investigation Workflow

The complete V1 investigation pipeline consists of the following stages.

**Step 1 — CSV Log Ingestion**

Security events are imported from sample CSV files.

**Step 2 — Event Normalization**

Raw log entries are converted into a standardized, OCSF-inspired event structure.

**Step 3 — Anomaly Detection**

The system analyzes normalized events and assigns anomaly scores.

**Step 4 — Event Correlation**

Related events are grouped together to identify potential incidents.

**Step 5 — Attack-Chain Reconstruction**

Correlated events are arranged chronologically to reconstruct suspicious activity sequences.

**Step 6 — Risk Scoring**

A deterministic risk engine calculates incident risk scores and assigns risk levels.

**Step 7 — Evidence Extraction**

Supporting security events are extracted for individual incidents.

**Step 8 — Explainable Investigation**

The system generates explanations grounded in the available incident evidence.

**Step 9 — Dashboard Visualization**

The frontend presents incident information, attack chains, risk factors, evidence, and explanations.

### Complete Workflow

```text
CSV Security Logs
        |
        v
   Normalization
        |
        v
 Anomaly Detection
        |
        v
 Event Correlation
        |
        v
Attack-Chain Reconstruction
        |
        v
    Risk Score
        |
        v
     Evidence
        |
        v
   Explanation
        |
        v
     Dashboard
```

---

## 🧩 Technology Stack

| Component | Technology |
|---|---|
| Programming Language | Python |
| Frontend Framework | React |
| Frontend Build Tool | Vite |
| Frontend Language | JavaScript |
| UI Icons | Lucide React |
| Backend Framework | FastAPI |
| Data Processing | Pandas |
| ORM | SQLAlchemy |
| Database | SQLite |
| API Documentation | Swagger UI |
| API Communication | REST API |

---

## 📂 Project Structure

The project follows a modular structure that separates backend processing, database operations, frontend components, sample data, and application documentation.

```text
AI-Attack-Chain/
│
├── backend/
│   │
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
│   │
│   ├── src/
│   │   ├── pages/
│   │   │   └── Investigation.jsx
│   │   │
│   │   ├── services/
│   │   │
│   │   └── ...
│   │
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
```

### Directory Responsibilities

| Directory / File | Description |
|---|---|
| `backend/` | FastAPI backend application |
| `backend/main.py` | API entry point and endpoint definitions |
| `backend/database/` | Database connection and schema definitions |
| `backend/services/` | Investigation and security analysis modules |
| `frontend/` | React + Vite frontend application |
| `frontend/src/pages/` | Frontend application pages |
| `frontend/src/services/` | Frontend API communication |
| `data/sample/` | Sample security log datasets |
| `screenshots/` | Application screenshots |
| `requirements.txt` | Python backend dependencies |
| `.gitignore` | Files and directories excluded from Git |
| `README.md` | Project documentation |

---

## ⚙️ Installation & Setup

### Prerequisites

Make sure the following are installed:

- Python 3.x
- Node.js
- npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Asiifa/AI-Attack-Chain.git
```

Navigate into the project directory:

```bash
cd AI-Attack-Chain
```

### 2. Create a Python Virtual Environment

```bash
python -m venv venv
```

### 3. Activate the Environment

**Windows PowerShell:**

```powershell
.\venv\Scripts\Activate.ps1
```

### 4. Install Backend Dependencies

From the project root:

```bash
pip install -r requirements.txt
```

### 5. Install Frontend Dependencies

Navigate into the frontend directory:

```bash
cd frontend
```

Install the required packages:

```bash
npm install
```

---

## ▶️ Running the Application

The backend and frontend run independently in separate terminals.

### 1. Start the Backend

Open a terminal in the project root.

Activate the virtual environment if it is not already active.

Run:

```bash
uvicorn backend.main:app --reload
```

**Backend URL:**

```text
http://localhost:8000
```

**Interactive Swagger Documentation:**

```text
http://localhost:8000/docs
```

### 2. Start the Frontend

Open another terminal.

Navigate to the frontend directory:

```bash
cd frontend
```

Start the Vite development server:

```bash
npm run dev
```

**Frontend URL:**

```text
http://localhost:5173
```

### Application Access

| Component | URL |
|---|---|
| React Dashboard | http://localhost:5173 |
| FastAPI Backend | http://localhost:8000 |
| Swagger Documentation | http://localhost:8000/docs |

---

## 🌐 API Endpoints

The FastAPI backend exposes REST endpoints for security event ingestion, incident analysis, and investigation results.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Check API status |
| GET | `/health` | Health check |
| POST | `/ingest` | Import sample security logs |
| GET | `/events` | Retrieve security events |
| GET | `/events/count` | Get total event count |
| GET | `/events/normalized` | View normalized events |
| GET | `/events/anomalies` | View detected anomalies |
| GET | `/incidents/correlated` | View correlated incidents |
| GET | `/incidents/reconstructed` | View reconstructed attack chains |
| GET | `/incidents/risk` | View incident risk scores |
| GET | `/incidents/evidence` | View incident evidence |
| GET | `/incidents/explanation` | View incident explanations |

### Interactive API Documentation

FastAPI automatically provides interactive Swagger documentation.

Access it at:

```text
http://localhost:8000/docs
```

---

## 🖥️ Dashboard & Investigation

The React frontend provides a SOC-style interface for understanding security activity and investigating suspicious incidents.

### Security Dashboard

Displays the overall security activity and incident overview.

![Security Dashboard](screenshots/dashboard.png)

### Incidents

Displays correlated incidents with their associated risk information.

![Incidents](screenshots/incidents.png)

### Investigation

Provides a detailed view of an individual incident.

![Investigation](screenshots/investigation.png)

### Investigation Details

The investigation page presents:

- Incident details
- Attack chain
- Investigation timeline
- Risk factors
- Supporting evidence
- Explainable investigation summary

---

## 🧪 Testing

The backend can be tested through the interactive Swagger interface.

```text
http://localhost:8000/docs
```

### Main Frontend Workflow

The primary frontend flow can be verified through the following sequence:

```text
Dashboard
    |
    v
 Incidents
    |
    v
Investigation
```

### Investigation Validation

Verify that the investigation page correctly displays:

- Incident details
- Reconstructed attack chain
- Investigation timeline
- Risk factors
- Supporting evidence
- Investigation explanation

The sample CSV dataset can be used to validate the ingestion and investigation workflow.

---

## ⚠️ Current Limitations

The current V1 implementation is designed as an academic project and operates with a defined set of data sources and investigation rules.

Current limitations include:

**Sample Security Logs**

The application currently uses sample security log datasets.

**CSV-Based Ingestion**

Log ingestion is based on CSV files.

**Local Database**

SQLite is used for local data storage.

**Deterministic Risk Scoring**

Incident risk levels are calculated using deterministic scoring logic.

**Limited Event Types**

The current implementation supports a limited set of event types and correlation rules.

**Not a Production SIEM**

The application is an academic cybersecurity investigation project and is not intended to replace production SIEM or enterprise incident-response platforms.

---

## 🚧 Roadmap

### V1 — Completed

- [x] CSV security log ingestion
- [x] Event normalization
- [x] Anomaly detection
- [x] Event correlation
- [x] Attack-chain reconstruction
- [x] Incident risk scoring
- [x] Evidence extraction
- [x] Explainable investigation
- [x] SOC-style dashboard

### V2 — Planned

- [ ] JSON log support
- [ ] Multiple log-source support
- [ ] MITRE ATT&CK technique mapping
- [ ] Automated investigation reports
- [ ] Advanced attack-chain analysis

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test the application.
5. Submit a pull request.

---

## 🔐 Responsible Use

AI Attack Chain Investigator is intended for:

- Defensive cybersecurity research.
- Cybersecurity education.
- Security monitoring.
- Authorized incident investigation.
- Security event analysis.

Only use the system with security data and systems that you are authorized to analyze.

The investigation results should be treated as decision-support information and reviewed by qualified security personnel before taking operational action.

---

**AI Attack Chain Investigator — Turning Security Logs into Explainable Attack Investigations.**
