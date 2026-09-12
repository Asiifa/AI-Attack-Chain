import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "./index.css";

import App from "./App.jsx";
import Investigation from "./pages/investigation-temp.jsx";
import Events from "./pages/Events.jsx";
import Incidents from "./pages/Incidents.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>

        <Routes>
  <Route path="/" element={<App />} />

  <Route
    path="/investigation/:id"
    element={<Investigation />}
  />

  <Route
    path="/events"
    element={<Events />}
  />

  <Route
    path="/incidents"
    element={<Incidents />}
  />
</Routes>
    </BrowserRouter>
  </StrictMode>
);
