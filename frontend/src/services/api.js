const API_BASE_URL = "http://localhost:8000";

async function fetchAPI(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

// Backend health
export async function getHealth() {
  return fetchAPI("/health");
}

// Total event count
export async function getEventCount() {
  return fetchAPI("/events/count");
}

// All security events
export async function getEvents() {
  return fetchAPI("/events");
}

// Risk information
export async function getRiskData() {
  return fetchAPI("/incidents/risk");
}

// Reconstructed attack chains
export async function getReconstructedIncidents() {
  return fetchAPI("/incidents/reconstructed");
}

// Incident evidence
export async function getEvidence() {
  return fetchAPI("/incidents/evidence");
}

// Incident explanations
export async function getExplanations() {
  return fetchAPI("/incidents/explanation");
}