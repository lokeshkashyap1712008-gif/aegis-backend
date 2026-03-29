"use client";

import { MapContainer, TileLayer, CircleMarker, Popup, Polyline } from "react-leaflet";

const nodeColor = (status) => {
  if (status === "critical") return "#ff4040";
  if (status === "sleeper")  return "#ff9900";
  return "#00dd88";
};

const nodePositions = {};
const stablePos = (id) => {
  if (!nodePositions[id])
    nodePositions[id] = [20 + Math.random() * 20, 70 + Math.random() * 20];
  return nodePositions[id];
};

const LEGEND = [
  { color: "#00dd88", label: "NOMINAL"  },
  { color: "#ff9900", label: "SLEEPER"  },
  { color: "#ff4040", label: "CRITICAL" },
];

export default function RealTimeMap({ nodes = [] }) {
  const positions = nodes.map(n => stablePos(n.node_id));

  return (
    <div className="relative" style={{ fontFamily: "'JetBrains Mono', monospace" }}>

      {/* Corner brackets */}
      {[
        { cls: "absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2" },
        { cls: "absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2" },
        { cls: "absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2" },
        { cls: "absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2" },
      ].map(({ cls }, i) => (
        <div key={i} className={`${cls} z-10 pointer-events-none`}
          style={{ borderColor: "rgba(0,170,255,0.22)" }} />
      ))}

      {/* Node count badge */}
      <div
        className="absolute top-3 right-3 z-[500] flex items-center gap-[8px]"
        style={{
          background:  "rgba(6,8,16,0.9)",
          border:      "1px solid #111926",
          padding:     "5px 11px",
          backdropFilter: "blur(4px)",
        }}
      >
        <span
          className="rounded-full animate-pulse"
          style={{ width: 5, height: 5, background: "#00aaff", display: "inline-block", flexShrink: 0,
            boxShadow: "0 0 5px #00aaff" }}
        />
        <span style={{ fontSize: 8, letterSpacing: "0.16em", color: "#00aaff" }}>
          {nodes.length} NODES TRACKED
        </span>
      </div>

      <MapContainer
        center={[22, 82]}
        zoom={4}
        style={{ height: 420 }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {/* Connection lines */}
        {positions.length > 1 && (
          <>
            <Polyline positions={positions} pathOptions={{ color: "#00aaff", weight: 8,  opacity: 0.04 }} />
            <Polyline positions={positions} pathOptions={{ color: "#00aaff", weight: 1,  opacity: 0.35, dashArray: "4 8" }} />
          </>
        )}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const pos   = stablePos(node.node_id);
          const color = nodeColor(node.status);
          return (
            <CircleMarker
              key={`${node.node_id}-${i}`}
              center={pos}
              radius={9}
              pathOptions={{ color, fillColor: color, fillOpacity: 0.88, weight: 1.5 }}
            >
              <Popup>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize:   10,
                  background: "#060a14",
                  padding:    "14px",
                  minWidth:   180,
                }}>
                  {/* Popup header */}
                  <div style={{
                    display:        "flex",
                    justifyContent: "space-between",
                    alignItems:     "center",
                    borderBottom:   "1px solid #111926",
                    paddingBottom:  10,
                    marginBottom:   10,
                  }}>
                    <span style={{ color: "#00aaff", fontWeight: 700, letterSpacing: "0.06em", fontSize: 11 }}>
                      {node.node_id}
                    </span>
                    <span style={{
                      fontSize:      8,
                      padding:       "2px 7px",
                      border:        `1px solid ${color}50`,
                      color,
                      background:    `${color}10`,
                      letterSpacing: "0.10em",
                      fontWeight:    600,
                    }}>
                      {(node.status || "UNKNOWN").toUpperCase()}
                    </span>
                  </div>

                  {/* Popup rows */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {[
                      ["LATENCY", node.avg_latency != null ? `${node.avg_latency.toFixed(2)} ms` : "N/A"],
                      ["COORDS",  `${pos[0].toFixed(2)}, ${pos[1].toFixed(2)}`],
                    ].map(([k, v]) => (
                      <div key={k} style={{
                        display:        "flex",
                        justifyContent: "space-between",
                        alignItems:     "center",
                        gap:            16,
                      }}>
                        <span style={{ color: "#1e3550", letterSpacing: "0.12em", fontSize: 8 }}>{k}</span>
                        <span style={{ color: "#8aaac8", letterSpacing: "0.06em" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Legend */}
      <div
        className="absolute bottom-3 left-3 z-[500] flex items-center gap-5"
        style={{
          background:     "rgba(6,8,16,0.9)",
          border:         "1px solid #111926",
          padding:        "6px 14px",
          backdropFilter: "blur(4px)",
        }}
      >
        {LEGEND.map(({ color, label }) => (
          <div key={label} className="flex items-center gap-[7px]">
            <span className="rounded-full" style={{ width: 7, height: 7, background: color, display: "inline-block",
              boxShadow: `0 0 4px ${color}` }} />
            <span style={{ fontSize: 8, letterSpacing: "0.15em", color }}>{label}</span>
          </div>
        ))}
      </div>

    </div>
  );
}