import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Shield,
  Activity,
  AlertTriangle,
  Database,
  Network,
  Search,
  Settings,
  LayoutDashboard,
  FileWarning,
  CircleDot,
} from "lucide-react";

import {
  getHealth,
  getEventCount,
  getRiskData,
  getReconstructedIncidents,
} from "./services/api";

function App() {
  const navigate = useNavigate();

  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [incidents, setIncidents] = useState([]);
  const [riskData, setRiskData] = useState(null);
  const [eventCount, setEventCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [dashboardSearch, setDashboardSearch] = useState("");

  // ----------------------------------------
  // Check backend connection
  // ----------------------------------------
  useEffect(() => {
    getHealth()
      .then(() => {
        setBackendStatus("Connected");
      })
      .catch(() => {
        setBackendStatus("Disconnected");
      });
  }, []);

  // ----------------------------------------
  // Load dashboard data
  // ----------------------------------------
  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [eventResult, risk, reconstructed] =
          await Promise.all([
            getEventCount(),
            getRiskData(),
            getReconstructedIncidents(),
          ]);

        setEventCount(eventResult.count);
        setRiskData(risk);
        setIncidents(reconstructed.incidents);
      } catch (error) {
        console.error(
          "Failed to load dashboard data:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // ----------------------------------------
  // Dashboard calculations
  // ----------------------------------------

  const totalIncidents = riskData?.count ?? 0;

  const highRiskIncidents =
    riskData?.incidents?.filter(
      (incident) =>
        incident.risk.risk_level === "HIGH" ||
        incident.risk.risk_level === "CRITICAL"
    ).length ?? 0;

  const highestRisk =
    riskData?.incidents?.length > 0
      ? Math.max(
          ...riskData.incidents.map(
            (incident) => incident.risk.risk_score
          )
        )
      : 0;

  const lowRiskIncidents =
    riskData?.incidents?.filter(
      (incident) =>
        incident.risk.risk_level === "LOW"
    ).length ?? 0;

  const totalEvents = eventCount;

  // ----------------------------------------
  // Dashboard incident search
  // ----------------------------------------

  const filteredIncidents = incidents.filter((incident) => {
    const searchText =
      dashboardSearch.trim().toLowerCase();

    if (!searchText) {
      return true;
    }

    const incidentText = [
      incident.incident_id,

      ...(incident.users || []),

      ...(incident.source_ips || []),

      incident.event_count,

      ...(incident.timeline || []).map(
        (event) => event.event_type
      ),

      ...(incident.timeline || []).map(
        (event) => event.stage
      ),
    ]
      .map((value) =>
        String(value ?? "").toLowerCase()
      )
      .join(" ");

    return incidentText.includes(searchText);
  });

  return (
    <div className="app">

      {/* =====================================
          SIDEBAR
      ====================================== */}

      <aside className="sidebar">

        {/* Logo */}

        <div className="logo">

          <div className="logo-icon">
            <Shield size={22} />
          </div>

          <div>
            <h2>AttackChain</h2>
            <span>INVESTIGATOR</span>
          </div>

        </div>

        {/* Navigation */}

        <nav>

          <div className="nav-section">
            MAIN
          </div>

          {/* Dashboard */}

          <a
            className="nav-item active"
            onClick={() => navigate("/")}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </a>

          {/* Incidents */}

          <a
            className="nav-item"
            onClick={() => navigate("/incidents")}
          >
            <AlertTriangle size={18} />

            Incidents

            <span className="nav-badge">
              {loading
                ? "..."
                : totalIncidents}
            </span>
          </a>

          {/* Events */}

          <a
            className="nav-item"
            onClick={() => navigate("/events")}
          >
            <Activity size={18} />
            Events
          </a>

          {/* Attack Chains */}

          <a
            className="nav-item"
            onClick={() => {
              if (incidents.length > 0) {
                navigate(
                  `/investigation/${incidents[0].incident_id}`
                );
              }
            }}
          >
            <Network size={18} />
            Attack Chains
          </a>

          <div className="nav-section">
            SYSTEM
          </div>

          {/* Data Sources */}

          <a className="nav-item">
            <Database size={18} />
            Data Sources
          </a>

          {/* Settings */}

          <a className="nav-item">
            <Settings size={18} />
            Settings
          </a>

        </nav>

        {/* Backend status */}

        <div className="system-status">

          <CircleDot size={14} />

          <div>
            <strong>
              {backendStatus}
            </strong>

            <span>
              FastAPI backend connection
            </span>
          </div>

        </div>

      </aside>

      {/* =====================================
          MAIN CONTENT
      ====================================== */}

      <main className="main-content">

        {/* Top bar */}

        <header className="topbar">

          <div>

            <h1>
              Security Overview
            </h1>

            <p>
              AI-powered attack-chain investigation
            </p>

          </div>

          <div className="topbar-actions">

            {/* Dashboard search */}

            <div className="search-box">

              <Search size={17} />

              <input
                type="text"
                placeholder="Search incidents..."
                value={dashboardSearch}
                onChange={(e) =>
                  setDashboardSearch(
                    e.target.value
                  )
                }
              />

            </div>

            {/* Profile */}

            <div className="profile">

              <div className="avatar">
                AI
              </div>

              <div>
                <strong>
                  Analyst
                </strong>

                <span>
                  Security Operations
                </span>
              </div>

            </div>

          </div>

        </header>

        {/* =====================================
            STAT CARDS
        ====================================== */}

        <section className="stats-grid">

          {/* Total Events */}

          <div className="stat-card">

            <div className="stat-icon blue">
              <Activity size={21} />
            </div>

            <div>

              <span>
                Total Events
              </span>

              <h2>
                {loading
                  ? "..."
                  : totalEvents}
              </h2>

              <small>
                Imported security events
              </small>

            </div>

          </div>

          {/* Incidents */}

          <div className="stat-card">

            <div className="stat-icon orange">
              <AlertTriangle size={21} />
            </div>

            <div>

              <span>
                Incidents
              </span>

              <h2>
                {loading
                  ? "..."
                  : totalIncidents}
              </h2>

              <small>
                Correlated incidents
              </small>

            </div>

          </div>

          {/* High Risk */}

          <div className="stat-card">

            <div className="stat-icon red">
              <FileWarning size={21} />
            </div>

            <div>

              <span>
                High Risk
              </span>

              <h2>
                {loading
                  ? "..."
                  : highRiskIncidents}
              </h2>

              <small>
                Requires investigation
              </small>

            </div>

          </div>

          {/* Highest Risk */}

          <div className="stat-card">

            <div className="stat-icon purple">
              <Shield size={21} />
            </div>

            <div>

              <span>
                Highest Risk
              </span>

              <h2>
                {loading
                  ? "..."
                  : highestRisk.toFixed(2)}
              </h2>

              <small>
                Current risk score
              </small>

            </div>

          </div>

        </section>

        {/* =====================================
            DASHBOARD CONTENT
        ====================================== */}

        <section className="dashboard-grid">

          {/* Threat Activity */}

          <div className="panel large-panel">

            <div className="panel-header">

              <div>

                <h3>
                  Threat Activity
                </h3>

                <p>
                  Recent security activity across
                  the environment
                </p>

              </div>

              <button>
                Last 24 hours
              </button>

            </div>

            <div className="activity-chart">

              <div className="chart-line line-one"></div>

              <div className="chart-line line-two"></div>

              <div className="chart-line line-three"></div>

              <div className="chart-bars">

                <span style={{ height: "25%" }}></span>
                <span style={{ height: "40%" }}></span>
                <span style={{ height: "32%" }}></span>
                <span style={{ height: "65%" }}></span>
                <span style={{ height: "45%" }}></span>
                <span style={{ height: "82%" }}></span>
                <span style={{ height: "55%" }}></span>
                <span style={{ height: "92%" }}></span>
                <span style={{ height: "68%" }}></span>
                <span style={{ height: "48%" }}></span>
                <span style={{ height: "75%" }}></span>
                <span style={{ height: "58%" }}></span>

              </div>

            </div>

          </div>

          {/* Risk Distribution */}

          <div className="panel risk-panel">

            <div className="panel-header">

              <div>

                <h3>
                  Risk Distribution
                </h3>

                <p>
                  Current incidents
                </p>

              </div>

            </div>

            <div className="risk-circle">

              <div>

                <strong>
                  {loading
                    ? "..."
                    : totalIncidents}
                </strong>

                <span>
                  Incidents
                </span>

              </div>

            </div>

            <div className="risk-legend">

              <div>

                <span className="dot low"></span>

                Low

                <strong>
                  {loading
                    ? "..."
                    : lowRiskIncidents}
                </strong>

              </div>

              <div>

                <span className="dot high"></span>

                High

                <strong>
                  {loading
                    ? "..."
                    : highRiskIncidents}
                </strong>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================
            RECENT INCIDENTS
        ====================================== */}

        <section className="panel incidents-panel">

          <div className="panel-header">

            <div>

              <h3>
                Recent Incidents
              </h3>

              <p>
                Correlated security incidents
                requiring attention
              </p>

            </div>

            <button
              className="view-button"
              onClick={() =>
                navigate("/incidents")
              }
            >
              View all
            </button>

          </div>

          <div className="incident-table">

            <div className="table-header">

              <span>INCIDENT</span>
              <span>USER</span>
              <span>EVENTS</span>
              <span>RISK</span>
              <span>STATUS</span>
              <span></span>

            </div>

            {filteredIncidents.length === 0 ? (

              <div className="events-empty">
                No incidents match your search.
              </div>

            ) : (

              filteredIncidents.map((incident) => {

                const riskInfo =
                  riskData?.incidents?.find(
                    (riskIncident) =>
                      riskIncident.incident_id ===
                      incident.incident_id
                  );

                const riskScore =
                  riskInfo?.risk?.risk_score ?? 0;

                const riskLevel =
                  riskInfo?.risk?.risk_level ?? "LOW";

                const isHigh =
                  riskLevel === "HIGH" ||
                  riskLevel === "CRITICAL";

                return (

                  <div
                    className="table-row incident-clickable"
                    key={incident.incident_id}
                    onClick={() =>
                      navigate(
                        `/investigation/${incident.incident_id}`
                      )
                    }
                  >

                    <div>

                      <strong>
                        INC-
                        {String(
                          incident.incident_id
                        ).padStart(3, "0")}
                      </strong>

                      <small>
                        {incident.event_count > 1
                          ? "Multi-stage suspicious activity"
                          : "Unusual security activity"}
                      </small>

                    </div>

                    <span>
                      {incident.users?.join(", ") ||
                        "Unknown"}
                    </span>

                    <span>
                      {incident.event_count} event
                      {incident.event_count !== 1
                        ? "s"
                        : ""}
                    </span>

                    <div
                      className={`risk-value ${
                        isHigh
                          ? "high-text"
                          : "low-text"
                      }`}
                    >

                      {riskScore.toFixed(2)}

                      <small>
                        {riskLevel}
                      </small>

                    </div>

                    <span
                      className={`status ${
                        isHigh
                          ? "investigating"
                          : "monitoring"
                      }`}
                    >
                      {isHigh
                        ? "Investigate"
                        : "Monitoring"}
                    </span>

                    <button
                      className="arrow-button"
                      onClick={(event) => {
                        event.stopPropagation();

                        navigate(
                          `/investigation/${incident.incident_id}`
                        );
                      }}
                    >
                      →
                    </button>

                  </div>

                );
              })

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default App;