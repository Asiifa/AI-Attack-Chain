import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search, ShieldAlert, Clock3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getRiskData,
  getReconstructedIncidents,
} from "../services/api";

function Incidents() {
  const navigate = useNavigate();

  const [riskData, setRiskData] = useState(null);
  const [reconstructedData, setReconstructedData] = useState(null);

  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadIncidents() {
      try {
        const [risk, reconstructed] = await Promise.all([
          getRiskData(),
          getReconstructedIncidents(),
        ]);

        setRiskData(risk);
        setReconstructedData(reconstructed);
      } catch (error) {
        console.error("Failed to load incidents:", error);
      } finally {
        setLoading(false);
      }
    }

    loadIncidents();
  }, []);

  const incidents = useMemo(() => {
    const reconstructed = reconstructedData?.incidents ?? [];
    const risks = riskData?.incidents ?? [];

    return reconstructed.map((incident) => {
      const riskInfo = risks.find(
        (risk) =>
          risk.incident_id === incident.incident_id
      );

      return {
        ...incident,
        riskScore: riskInfo?.risk?.risk_score ?? 0,
        riskLevel: riskInfo?.risk?.risk_level ?? "LOW",
        factors: riskInfo?.risk?.factors ?? {},
      };
    });
  }, [riskData, reconstructedData]);

  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      const searchText = `
        ${incident.incident_id}
        ${incident.users?.join(" ") || ""}
        ${incident.source_ips?.join(" ") || ""}
        ${incident.riskLevel}
      `.toLowerCase();

      const matchesSearch = searchText.includes(
        search.toLowerCase()
      );

      const matchesRisk =
        riskFilter === "ALL" ||
        incident.riskLevel === riskFilter;

      return matchesSearch && matchesRisk;
    });
  }, [incidents, search, riskFilter]);

  const highCount = incidents.filter(
    (incident) =>
      incident.riskLevel === "HIGH" ||
      incident.riskLevel === "CRITICAL"
  ).length;

  const mediumCount = incidents.filter(
    (incident) => incident.riskLevel === "MEDIUM"
  ).length;

  const lowCount = incidents.filter(
    (incident) => incident.riskLevel === "LOW"
  ).length;

  return (
    <div className="incidents-page">

      {/* Header */}
      <header className="incidents-header">

        <button
          className="back-button"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </button>

        <div className="incidents-title-row">

          <div>
            <span className="incidents-label">
              SECURITY OPERATIONS
            </span>

            <h1>Incident Center</h1>

            <p>
              Review, prioritize, and investigate correlated
              security incidents.
            </p>
          </div>

          <div className="incident-count-card">
            <ShieldAlert size={21} />

            <div>
              <span>Total Incidents</span>
              <strong>
                {loading ? "..." : incidents.length}
              </strong>
            </div>
          </div>

        </div>

      </header>

      {/* Overview */}
      <section className="incident-summary-grid">

        <div className="incident-summary-card">
          <span>HIGH / CRITICAL</span>
          <strong className="summary-high">
            {loading ? "..." : highCount}
          </strong>
          <small>Requires attention</small>
        </div>

        <div className="incident-summary-card">
          <span>MEDIUM</span>
          <strong className="summary-medium">
            {loading ? "..." : mediumCount}
          </strong>
          <small>Monitor and review</small>
        </div>

        <div className="incident-summary-card">
          <span>LOW</span>
          <strong className="summary-low">
            {loading ? "..." : lowCount}
          </strong>
          <small>Lower priority</small>
        </div>

        <div className="incident-summary-card">
          <span>OPEN INVESTIGATIONS</span>
          <strong>
            {loading ? "..." : highCount}
          </strong>
          <small>Based on current risk</small>
        </div>

      </section>

      {/* Main panel */}
      <section className="incidents-main-panel">

        {/* Toolbar */}
        <div className="incidents-toolbar">

          <div className="incident-search">
            <Search size={16} />

            <input
              type="text"
              placeholder="Search user, IP, incident..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <select
            value={riskFilter}
            onChange={(event) =>
              setRiskFilter(event.target.value)
            }
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

        </div>

        <div className="incident-results">
          Showing {filteredIncidents.length} of{" "}
          {incidents.length} incidents
        </div>

        {/* Incident list */}
        <div className="incident-list">

          {loading ? (
            <div className="incident-empty">
              Loading incidents...
            </div>
          ) : filteredIncidents.length === 0 ? (
            <div className="incident-empty">
              No incidents match your filters.
            </div>
          ) : (
            filteredIncidents.map((incident) => {

              const isHigh =
                incident.riskLevel === "HIGH" ||
                incident.riskLevel === "CRITICAL";

              return (
                <div
                  className="incident-list-row"
                  key={incident.incident_id}
                  onClick={() =>
                    navigate(
                      `/investigation/${incident.incident_id}`
                    )
                  }
                >

                  <div className="incident-main-info">

                    <div className="incident-icon">
                      <ShieldAlert size={18} />
                    </div>

                    <div>
                      <strong>
                        INC-
                        {String(
                          incident.incident_id
                        ).padStart(3, "0")}
                      </strong>

                      <span>
                        {incident.event_count > 1
                          ? "Multi-stage suspicious activity"
                          : "Unusual security activity"}
                      </span>
                    </div>

                  </div>

                  <div className="incident-detail">
                    <span>USER</span>
                    <strong>
                      {incident.users?.join(", ") || "Unknown"}
                    </strong>
                  </div>

                  <div className="incident-detail">
                    <span>SOURCE IP</span>
                    <strong>
                      {incident.source_ips?.join(", ") ||
                        "Unknown"}
                    </strong>
                  </div>

                  <div className="incident-detail">
                    <span>EVENTS</span>
                    <strong>
                      {incident.event_count}
                    </strong>
                  </div>

                  <div className="incident-detail">
                    <span>TIME WINDOW</span>
                    <strong>
                      {formatTimeRange(
                        incident.start_time,
                        incident.end_time
                      )}
                    </strong>
                  </div>

                  <div className="incident-risk">
                    <span
                      className={`risk-pill ${
                        incident.riskLevel.toLowerCase()
                      }`}
                    >
                      {incident.riskLevel}
                    </span>

                    <strong
                      className={
                        isHigh
                          ? "high-text"
                          : "low-text"
                      }
                    >
                      {incident.riskScore.toFixed(2)}
                    </strong>
                  </div>

                  <div className="incident-open">
                    <span>Investigate</span>
                    <span>→</span>
                  </div>

                </div>
              );
            })
          )}

        </div>

      </section>

    </div>
  );
}

function formatTimeRange(start, end) {
  const startTime = new Date(start).toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const endTime = new Date(end).toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return `${startTime} – ${endTime}`;
}

export default Incidents;