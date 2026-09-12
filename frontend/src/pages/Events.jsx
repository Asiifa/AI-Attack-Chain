import { useEffect, useState } from "react";

import {
  ArrowLeft,
  Search,
  Activity,
  RefreshCw,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { getEvents } from "../services/api";

function Events() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ----------------------------------------
  // Load events from backend
  // ----------------------------------------
  async function loadEvents() {
    try {
      setLoading(true);
      setError("");

      const data = await getEvents();

      setEvents(data.events || []);
    } catch (error) {
      console.error("Failed to load events:", error);
      setError("Unable to load security events.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  // ----------------------------------------
  // Filter events
  // ----------------------------------------
  const filteredEvents = events.filter((event) => {
    const searchText = search.trim().toLowerCase();

    const eventText = [
      event.event_id,
      event.activity,
      event.event_type,
      event.category,
      event.user,
      event.source_ip,
      event.destination_ip,
      event.hostname,
      event.severity,
    ]
      .map((value) => String(value ?? "").toLowerCase())
      .join(" ");

    const searchMatches =
      searchText === "" ||
      eventText.includes(searchText);

    const severityMatches =
      severityFilter === "ALL" ||
      String(event.severity ?? "").toUpperCase() ===
        severityFilter;

    return searchMatches && severityMatches;
  });

  // ----------------------------------------
  // Summary counts
  // ----------------------------------------
  const criticalCount = events.filter(
    (event) =>
      String(event.severity ?? "").toUpperCase() ===
      "CRITICAL"
  ).length;

  const highCount = events.filter(
    (event) =>
      String(event.severity ?? "").toUpperCase() ===
      "HIGH"
  ).length;

  const anomalousCount = events.filter(
    (event) =>
      Number(event.anomaly_score || 0) >= 50
  ).length;

  return (
    <div className="events-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <header className="events-header">

        <button
          className="back-button"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </button>

        <div className="events-title">

          <div>
            <span className="events-label">
              SECURITY EVENTS
            </span>

            <h1>Event Explorer</h1>

            <p>
              Inspect normalized security events detected by
              the investigation pipeline.
            </p>
          </div>

          <div className="events-total">

            <Activity size={20} />

            <div>
              <span>Total Events</span>

              <strong>
                {loading ? "..." : events.length}
              </strong>
            </div>

          </div>

        </div>

      </header>

      {/* =====================================
          SUMMARY CARDS
      ====================================== */}

      <section className="event-summary-grid">

        <div className="event-summary-card">
          <span>TOTAL EVENTS</span>

          <strong>
            {loading ? "..." : events.length}
          </strong>

          <small>
            Imported into the system
          </small>
        </div>

        <div className="event-summary-card">
          <span>ANOMALOUS</span>

          <strong className="event-anomaly-count">
            {loading ? "..." : anomalousCount}
          </strong>

          <small>
            Score ≥ 50
          </small>
        </div>

        <div className="event-summary-card">
          <span>HIGH</span>

          <strong className="event-high-count">
            {loading ? "..." : highCount}
          </strong>

          <small>
            High severity events
          </small>
        </div>

        <div className="event-summary-card">
          <span>CRITICAL</span>

          <strong className="event-critical-count">
            {loading ? "..." : criticalCount}
          </strong>

          <small>
            Critical severity events
          </small>
        </div>

      </section>

      {/* =====================================
          EVENTS PANEL
      ====================================== */}

      <section className="events-panel">

        {/* Toolbar */}

        <div className="events-toolbar">

          <div className="events-search">

            <Search size={16} />

            <input
              type="text"
              placeholder="Search event, user, IP, hostname..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <select
            value={severityFilter}
            onChange={(e) =>
              setSeverityFilter(e.target.value)
            }
          >
            <option value="ALL">
              All Severity
            </option>

            <option value="LOW">
              Low
            </option>

            <option value="MEDIUM">
              Medium
            </option>

            <option value="HIGH">
              High
            </option>

            <option value="CRITICAL">
              Critical
            </option>
          </select>

          <button
            className="refresh-events"
            onClick={loadEvents}
            disabled={loading}
          >
            <RefreshCw
              size={14}
              className={
                loading ? "spinning" : ""
              }
            />

            Refresh
          </button>

        </div>

        {/* Summary */}

        <div className="events-summary">

          Showing {filteredEvents.length} of{" "}
          {events.length} events

        </div>

        {/* Error */}

        {error && (
          <div className="events-error">
            {error}
          </div>
        )}

        {/* =====================================
            EVENTS TABLE
        ====================================== */}

        <div className="events-table">

          <div className="events-table-header">

            <span>ID</span>
            <span>TIME</span>
            <span>EVENT</span>
            <span>USER</span>
            <span>SOURCE IP</span>
            <span>DESTINATION</span>
            <span>SEVERITY</span>
            <span>ANOMALY</span>

          </div>

          {loading ? (

            <div className="events-empty">
              Loading security events...
            </div>

          ) : filteredEvents.length === 0 ? (

            <div className="events-empty">
              No events match your filters.
            </div>

          ) : (

            filteredEvents.map((event) => {

              const anomalyScore =
                Number(
                  event.anomaly_score || 0
                );

              return (

                <div
                  className="events-table-row"
                  key={event.event_id}
                >

                  <span className="event-id">
                    #{event.event_id}
                  </span>

                  <span className="event-time">
                    {formatDateTime(
                      event.timestamp
                    )}
                  </span>

                  <div className="event-name">

                    <strong>
                      {formatEventType(
                        event.activity ||
                        event.event_type ||
                        "Unknown Event"
                      )}
                    </strong>

                    <small>
                      {event.category ||
                        "Other"}
                    </small>

                  </div>

                  <span>
                    {event.user || "—"}
                  </span>

                  <span>
                    {event.source_ip || "—"}
                  </span>

                  <span>
                    {event.destination_ip || "—"}
                  </span>

                  <span
                    className={`severity ${
                      event.severity?.toLowerCase() ||
                      ""
                    }`}
                  >
                    {event.severity || "—"}
                  </span>

                  <span
                    className={
                      anomalyScore >= 50
                        ? "event-anomaly-high"
                        : "event-anomaly"
                    }
                  >
                    {event.anomaly_score != null
                      ? anomalyScore.toFixed(2)
                      : "—"}
                  </span>

                </div>

              );
            })

          )}

        </div>

      </section>

    </div>
  );
}

// ----------------------------------------
// Helper functions
// ----------------------------------------

function formatEventType(eventType = "") {
  return eventType
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

function formatDateTime(timestamp) {
  return new Date(timestamp).toLocaleString();
}

export default Events;