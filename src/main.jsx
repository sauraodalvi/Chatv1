import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/tailark.css";
import "./index.css";

// Patch Object.entries to handle null/undefined safely
const originalObjectEntries = Object.entries;
Object.entries = function (obj) {
  if (obj === null || obj === undefined) {
    console.warn(
      "Object.entries called with null/undefined. Returning empty array instead of throwing error."
    );
    return [];
  }
  return originalObjectEntries(obj);
};

// Also add a safe version as a utility
if (!Object.safeEntries) {
  Object.safeEntries = function (obj) {
    if (obj === null || obj === undefined) {
      return [];
    }
    return originalObjectEntries(obj);
  };
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
