"use client";

import { useEffect, useState } from "react";
import { parseMetrics } from "../utils/parseMetrics";

export default function SystemMetrics() {
  const [metrics, setMetrics] = useState({
    ingestion: 0,
    errors: 0,
    detections: 0
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/metrics/prometheus");
        const text = await res.text();

        const parsed = parseMetrics(text);
        setMetrics(parsed);
      } catch (err) {
        console.log("Metrics error:", err);
      }
    };

    fetchMetrics(); // first call

    const interval = setInterval(fetchMetrics, 2000); // 🔄 live refresh

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 rounded-xl bg-gray-900 border border-gray-700">
      <h2 className="text-xl text-purple-400 mb-4">
        📊 System Observability
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Ingestion */}
        <div className="p-4 rounded-lg bg-gray-800 border border-gray-600">
          <p className="text-sm text-gray-400">Ingestion Events</p>
          <p className="text-2xl font-bold text-green-400">
            {metrics.ingestion}
          </p>
        </div>

        {/* Errors */}
        <div className="p-4 rounded-lg bg-gray-800 border border-gray-600">
          <p className="text-sm text-gray-400">Errors</p>
          <p className="text-2xl font-bold text-red-400">
            {metrics.errors}
          </p>
        </div>

        {/* Detections */}
        <div className="p-4 rounded-lg bg-gray-800 border border-gray-600">
          <p className="text-sm text-gray-400">Detections</p>
          <p className="text-2xl font-bold text-yellow-400">
            {metrics.detections}
          </p>
        </div>

      </div>
    </div>
  );
}