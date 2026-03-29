"use client";

import NodeMap from "../components/map/NodeMap";
import AlertsPanel from "../components/alerts/AlertsPanel";
import LatencyHeatmap from "../components/heatmap/LatencyHeatmap";

import usePolling from "../hooks/usePolling";
import { getNodes, getAlerts, getLatency } from "../services/api";

export default function Page() {
  const nodes = usePolling(getNodes, 3000);
  const alerts = usePolling(getAlerts, 3000);
  const latency = usePolling(getLatency, 5000);

  return (
    <div className="p-6 space-y-6">
      <NodeMap nodes={nodes} />
      <AlertsPanel alerts={alerts} />
      <LatencyHeatmap data={latency} />
    </div>
  );
}