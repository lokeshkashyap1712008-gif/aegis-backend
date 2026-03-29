"use client";

import dynamic from "next/dynamic";
import AlertsPanel from "../components/alerts/AlertsPanel";
import LatencyHeatmap from "../components/heatmap/LatencyHeatmap";
import SystemMetrics from "../components/SystemMetrics";

import usePolling from "../hooks/usePolling";
import { getNodes, getAlerts, getLatency } from "../services/api";

// 🚀 Fix Leaflet SSR
const RealTimeMap = dynamic(
  () => import("../components/map/RealTimeMap"),
  { ssr: false }
);

export default function Page() {
  const nodes = usePolling(getNodes, 3000) || [];
  const alerts = usePolling(getAlerts, 3000) || [];
  const latency = usePolling(getLatency, 5000) || [];

  return (
    <div className="p-6 space-y-6">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-blue-400">
          🧠 AEGIS CONTROL CENTER
        </h1>

        <div className="text-green-400 text-sm">
          ● SYSTEM ONLINE
        </div>
      </div>

      {/* 📊 GRID */}
      <div className="grid grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="col-span-2 space-y-6">
          <RealTimeMap nodes={nodes} />
          <LatencyHeatmap data={latency} />
        </div>

        {/* RIGHT */}
        <AlertsPanel alerts={alerts} />

      </div>

      {/* 🚀 PHASE 11 - OBSERVABILITY */}
      <SystemMetrics />

    </div>
  );
}