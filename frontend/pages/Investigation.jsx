import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import {
  ArrowLeft,
  ShieldAlert,
  Clock3,
  User,
  Globe,
  Activity,
  FileSearch,
  Brain,
  Network,
} from "lucide-react";

import {
  getRiskData,
  getReconstructedIncidents,
  getEvidence,
  getExplanations,
} from "../services/api";

function Investigation() {
  const [riskData, setRiskData] = useState(null);
  const [reconstructed, setReconstructed] = useState(null);
  const [evidenceData, setEvidenceData] = useState(null);
  const [explanationData, setExplanationData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const incidentId = Number(id);

  useEffect(() => {
    async function loadInvestigation() {
      try {
        const [risk, chains, evidence, explanations] =
          await Promise.all([
            getRiskData(),
            getReconstructedIncidents(),
            getEvidence(),
            getExplanations(),
          ]);

        setRiskData(risk);
        setReconstructed(chains);
        setEvidenceData(evidence);
        setExplanationData(explanations);
      } catch (error) {
        console.error(
          "Failed to load investigation data:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadInvestigation();
  }, []);

  const incident = useMemo(() => {
    return reconstructed?.incidents?.find(
      (item) => item.incident_id === incidentId
    );
  }, [reconstructed, incidentId]);

  const risk = useMemo(() => {
    return riskData?.incidents?.find(
      (item) => item.incident_id === incidentId
    );
  }, [riskData, incidentId]);

  const evidence = useMemo(() => {
    return evidenceData?.incidents?.find(
      (item) => item.incident_id === incidentId
    );
  }, [evidenceData, incidentId]);

  const explanation = useMemo(() => {
    return explanationData?.incidents?.find(
      (item) => item.incident_id === incidentId
    );
  }, [explanationData, incidentId]);

  if (loading) {
    return (
      <div className="investigation-loading">
        Loading investigation...
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="investigation-loading">
        Incident data could not be loaded.
      </div>
    );
  }

  const riskScore = risk?.risk?.risk_score ?? 0;
  const riskLevel = risk?.risk?.risk_level ?? "LOW";

  return (
    <div className="investigation-page">
      {/* Header */}
      <header className="investigation-header">
        <button
          className="back-button"
          onClick={() => window.history.back()}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="incident-heading">
          <div>
            <span className="incident-label">
              INCIDENT #{String(incidentId).padStart(3, "0")}
            </span>

            <h1>
              {incident.event_count >= 3
                ? "Multi-stage suspicious activity"
                : "Suspicious activity detected"}
            </h1>

            <p>
              Attack-chain reconstruction and evidence analysis
            </p>
          </div>

          <div className="risk-header">
            <span className="risk-label">RISK SCORE</span>

            <strong>{Number(riskScore).toFixed(2)}</strong>

            <span className="risk-badge">
              {riskLevel}
            </span>
          </div>
        </div>
      </header>

      {/* Incident overview */}
      <section className="investigation-meta">
        <div className="meta-card">
          <User size={18} />

          <div>
            <span>User</span>

            <strong>
              {incident.users?.join(", ") || "Unknown"}
            </strong>
          </div>
        </div>

        <div className="meta-card">
          <Globe size={18} />

          <div>
            <span>Source IP</span>

            <strong>
              {incident.source_ips?.join(", ") || "Unknown"}
            </strong>
          </div>
        </div>

        <div className="meta-card">
          <Clock3 size={18} />

          <div>
            <span>Time Window</span>

            <strong>
              {incident.start_time} → {incident.end_time}
            </strong>
          </div>
        </div>

        <div className="meta-card">
          <Activity size={18} />

          <div>
            <span>Events</span>

            <strong>{incident.event_count}</strong>
          </div>
        </div>
      </section>

      {/* Attack Chain */}
      <section className="investigation-panel">
        <div className="investigation-panel-header">
          <div>
            <div className="section-icon">
              <Network size={18} />
            </div>

            <div>
              <h2>Attack Chain</h2>

              <p>
                Chronological relationship between suspicious
                events
              </p>
            </div>
          </div>
        </div>

        <div className="attack-chain">
          {incident.timeline?.map((event, index) => (
            <div
              className="chain-step"
              key={event.event_id}
            >
              <div className="chain-node">
                <span>{event.event_id}</span>
              </div>

              <div className="chain-content">
                <strong>
                  {formatEventType(event.event_type)}
                </strong>

                <span>{event.stage}</span>

                <small>
                  {formatTime(event.timestamp)}
                </small>
              </div>

              {index < incident.timeline.length - 1 && (
                <div className="chain-arrow">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Two-column content */}
      <section className="investigation-two-column">
        {/* Investigation Timeline */}
        <div className="investigation-panel">
          <div className="investigation-panel-header">
            <div>
              <div className="section-icon">
                <Clock3 size={18} />
              </div>

              <div>
                <h2>Investigation Timeline</h2>

                <p>Ordered suspicious activity</p>
              </div>
            </div>
          </div>

          <div className="timeline">
            {incident.timeline?.map((event) => (
              <div
                className="timeline-item"
                key={event.event_id}
              >
                <div className="timeline-dot"></div>

                <div className="timeline-content">
                  <div className="timeline-top">
                    <strong>
                      {formatEventType(event.event_type)}
                    </strong>

                    <span
                      className={`severity ${
                        event.severity?.toLowerCase() || ""
                      }`}
                    >
                      {event.severity || "unknown"}
                    </span>
                  </div>

                  <span className="timeline-stage">
                    {event.stage}
                  </span>

                  <small>
                    Event #{event.event_id} ·{" "}
                    {event.timestamp}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Factors */}
        <div className="investigation-panel">
          <div className="investigation-panel-header">
            <div>
              <div className="section-icon">
                <ShieldAlert size={18} />
              </div>

              <div>
                <h2>Risk Factors</h2>

                <p>
                  Why this incident scored{" "}
                  {Number(riskScore).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="risk-factors">
            <RiskFactor
              label="Maximum anomaly score"
              value={
                risk?.risk?.factors
                  ?.maximum_anomaly_score
              }
            />

            <RiskFactor
              label="Total events"
              value={risk?.risk?.factors?.event_count}
            />

            <RiskFactor
              label="Critical events"
              value={
                risk?.risk?.factors?.critical_events
              }
            />

            <RiskFactor
              label="High events"
              value={risk?.risk?.factors?.high_events}
            />

            <RiskFactor
              label="Stages detected"
              value={
                risk?.risk?.factors?.stages_detected
              }
            />
          </div>
        </div>
      </section>

      {/* Evidence */}
      <section className="investigation-panel">
        <div className="investigation-panel-header">
          <div>
            <div className="section-icon">
              <FileSearch size={18} />
            </div>

            <div>
              <h2>Evidence</h2>

              <p>
                Verified events contributing to the
                investigation
              </p>
            </div>
          </div>

          <span className="evidence-count">
            {evidence?.evidence_count ?? 0} verified events
          </span>
        </div>

        <div className="evidence-grid">
          {evidence?.evidence?.length > 0 ? (
            evidence.evidence.map((item) => (
              <div
                className="evidence-card"
                key={item.event_id}
              >
                <div className="evidence-top">
                  <span>
                    EVENT #{item.event_id}
                  </span>

                  <span
                    className={`severity ${
                      item.severity?.toLowerCase() || ""
                    }`}
                  >
                    {item.severity || "unknown"}
                  </span>
                </div>

                <h3>
                  {formatEventType(item.event_type)}
                </h3>

                <p>{item.reason}</p>

                <small>{item.timestamp}</small>
              </div>
            ))
          ) : (
            <div className="events-empty">
              No verified evidence was identified for
              this incident.
            </div>
          )}
        </div>
      </section>

      {/* Explanation */}
      <section className="investigation-panel explanation-panel">
        <div className="investigation-panel-header">
          <div>
            <div className="section-icon">
              <Brain size={18} />
            </div>

            <div>
              <h2>Investigation Explanation</h2>

              <p>
                Evidence-grounded incident assessment
              </p>
            </div>
          </div>
        </div>

        <div className="explanation-box">
          <p>
            {explanation?.explanation ||
              "No explanation available for this incident."}
          </p>
        </div>
      </section>
    </div>
  );
}

function RiskFactor({ label, value }) {
  return (
    <div className="risk-factor">
      <span>{label}</span>
      <strong>{value ?? 0}</strong>
    </div>
  );
}

function formatEventType(eventType) {
  if (!eventType) {
    return "Unknown Event";
  }

  return eventType
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

function formatTime(timestamp) {
  if (!timestamp) {
    return "Unknown time";
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toLocaleTimeString();
}

export default Investigation;