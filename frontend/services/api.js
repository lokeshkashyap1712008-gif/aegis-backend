import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 5000 // ✅ prevents hanging
});

export const getNodes = () => API.get("/nodes");
export const getAlerts = () => API.get("/alerts");
export const getLatency = () => API.get("/metrics");