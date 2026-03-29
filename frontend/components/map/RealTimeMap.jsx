"use client";

import { MapContainer, TileLayer, CircleMarker, Popup, Polyline } from "react-leaflet";

// 🎨 color logic
const getColor = (status) => {
  if (status === "critical") return "#ef4444";
  if (status === "sleeper") return "#facc15";
  return "#22c55e";
};

// 🧠 stable positions
const nodePositions = {};

const getStablePosition = (node_id) => {
  if (!nodePositions[node_id]) {
    nodePositions[node_id] = [
      20 + Math.random() * 20,
      70 + Math.random() * 20
    ];
  }
  return nodePositions[node_id];
};

export default function RealTimeMap({ nodes = [] }) {
  const positions = nodes.map((n) => getStablePosition(n.node_id));

  return (
    <div className="card p-4 rounded-xl">
      <h2 className="text-xl text-blue-400 mb-4">
        🌍 Network Map
      </h2>

      <MapContainer
        center={[22, 78]}
        zoom={4}
        style={{ height: "400px", borderRadius: "12px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* 🔗 CONNECTION LINES */}
        {positions.length > 1 && (
          <Polyline
            positions={positions}
            pathOptions={{
              color: "cyan",
              weight: 2,
              opacity: 0.6
            }}
          />
        )}

        {/* 🔴 NODES */}
        {nodes.map((node, i) => {
          const position = getStablePosition(node.node_id);

          return (
            <CircleMarker
              key={`${node.node_id}-${i}`}   // ✅ FIXED
              center={position}
              radius={12}
              pathOptions={{
                color: getColor(node.status),
                fillOpacity: 0.9
              }}
              className="pulse-node"
            >
              <Popup>
                <b>{node.node_id}</b>
                <br />
                Latency: {node.avg_latency != null ? node.avg_latency.toFixed(2) : "N/A"} ms
                <br />
                Status: {node.status || "unknown"}
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}