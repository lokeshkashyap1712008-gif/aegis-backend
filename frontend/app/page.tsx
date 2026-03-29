"use client";

import dynamic from "next/dynamic";
import AlertsPanel from "../components/alerts/AlertsPanel";
import LatencyHeatmap from "../components/heatmap/LatencyHeatmap";
import SystemMetrics from "../components/SystemMetrics";

import usePolling from "../hooks/usePolling";
import { getNodes, getAlerts, getLatency } from "../services/api";

const RealTimeMap = dynamic(
  () => import("../components/map/RealTimeMap"),
  { ssr: false }
);

export default function Page() {
  const nodes   = usePolling(getNodes,   3000) || [];
  const alerts  = usePolling(getAlerts,  3000) || [];
  const latency = usePolling(getLatency, 5000) || [];

  const now = new Date();
  const timestamp = now.toISOString().replace("T", " ").split(".")[0] + " UTC";

  const critCount  = alerts.filter(a => a.type === "CRITICAL").length;
  const avgLatency = latency.length > 0
    ? (latency.reduce((s, d) => s + (d.latency || 0), 0) / latency.length).toFixed(1)
    : "—";
  const threatHigh = critCount > 0;

  const kpis = [
    { label: "Active Nodes",  value: nodes.length.toString().padStart(3, "0"), unit: "",   color: "#00aaff", sub: `${nodes.length} tracked`                           },
    { label: "Open Threats",  value: alerts.length.toString().padStart(3, "0"), unit: "",  color: "#ff4040", sub: "since last poll"                                    },
    { label: "Critical",      value: critCount.toString().padStart(3, "0"),     unit: "",  color: "#ff7700", sub: critCount > 0 ? "ACTION REQUIRED" : "all clear"      },
    { label: "Avg Latency",   value: avgLatency,                                unit: "ms", color: "#99ee00", sub: `${latency.length} samples`                         },
    { label: "Uptime",        value: "99.97",                                   unit: "%",  color: "#00ee88", sub: "30-day rolling"                                    },
    { label: "Threat Level",  value: threatHigh ? "HIGH" : "MOD",              unit: "",   color: threatHigh ? "#ff4040" : "#ffaa00",
      sub: threatHigh ? "CRITICAL EVENTS" : "nominal posture"                                                                                                          },
  ];

  return (
    <div className="min-h-screen bg-[#060810] text-[#c8d8e8] flex flex-col">

      {/* ══════════════════ HEADER ══════════════════ */}
      <header className="sticky top-0 z-50 border-b border-[#111926] bg-[#060810]/96 backdrop-blur-sm shrink-0">
        <div className="max-w-[1920px] mx-auto flex items-stretch h-[52px] px-6 gap-0 justify-between">

          {/* Logo block */}
          <div className="flex items-center gap-5 shrink-0 pr-6 border-r border-[#111926]">
            <div className="relative w-7 h-7 shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 border border-[#00aaff]/50 rotate-45" />
              <div className="absolute inset-[3px] border border-[#00aaff]/20 rotate-[22.5deg]" />
              <span className="relative z-10 text-[#00aaff] text-[12px] font-bold leading-none">Æ</span>
            </div>
            <div>
              <div className="text-[#00aaff] text-[12px] font-bold tracking-[0.32em] leading-none"
                style={{ fontFamily: "'Rajdhani', sans-serif" }}>AEGIS</div>
              <div className="text-[#1e3550] text-[8px] tracking-[0.22em] mt-[4px]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}>CONTROL CENTER v4.1</div>
            </div>
            <div className="flex items-center gap-2 pl-2">
              <span className="px-[7px] py-[2px] text-[8px] font-bold tracking-[0.12em] border border-[#ff0000]/35 text-[#ff4444] bg-[#ff0000]/5"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                TS//SCI
              </span>
              <span className="text-[#1e3550] text-[8px] tracking-[0.14em]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}>ORION-7</span>
            </div>
          </div>

          {/* Nav tabs */}
          <nav className="flex items-stretch flex-1 justify-center">
            {["OVERVIEW", "NETWORK", "THREATS", "ANALYTICS", "LOGS"].map((tab, i) => (
              <button
                key={tab}
                className="relative flex items-center justify-center px-6 text-[10px] tracking-[0.18em] border-r border-[#111926] first:border-l transition-colors duration-150"
                style={{
                  color:      i === 0 ? "#00aaff" : "#2a4260",
                  background: i === 0 ? "rgba(0,170,255,0.06)" : "transparent",
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 600,
                  minWidth:   96,
                }}
              >
                {i === 0 && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00aaff]" />
                )}
                {tab}
              </button>
            ))}
          </nav>

          {/* Right status */}
          <div className="flex items-center gap-4 shrink-0 pl-6 border-l border-[#111926]">
            {/* Signal bars */}
            <div className="flex items-center gap-2">
              <span className="text-[8px] text-[#1e3550] tracking-[0.15em]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}>SYNC</span>
              <div className="flex items-end gap-[2px] h-[14px]">
                {[3, 5, 7, 10, 13].map((h, i) => (
                  <div key={i} className="w-[3px] bg-[#00aaff] rounded-[1px] opacity-90" style={{ height: h }} />
                ))}
              </div>
            </div>
            <div className="w-px h-4 bg-[#111926]" />
            <span className="text-[8px] text-[#1e3550] tracking-[0.1em] tabular-nums"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}>{timestamp}</span>
            <div className="w-px h-4 bg-[#111926]" />
            <div className="flex items-center gap-[7px]">
              <span className="w-[5px] h-[5px] rounded-full bg-[#00ee88] shadow-[0_0_5px_#00ee88] animate-pulse" />
              <span className="text-[8px] text-[#00aa55] tracking-[0.22em]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}>NOMINAL</span>
            </div>
          </div>

        </div>
        {/* Bottom gradient accent */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#00aaff]/20 to-transparent" />
      </header>

      {/* ══════════════════ MAIN ══════════════════ */}
      <main className="flex-1 w-full max-w-[1920px] mx-auto px-5 pt-4 pb-8 space-y-3">

        {/* ── KPI STRIP ──────────────────────────────────── */}
        <div className="grid grid-cols-6 gap-px bg-[#0a1018] rounded-sm overflow-hidden"
          style={{ boxShadow: "0 0 0 1px #111926" }}>
          {kpis.map((k) => (
            <div
              key={k.label}
              className="relative flex flex-col justify-between bg-[#070b14] hover:bg-[#09101c] transition-colors duration-200 overflow-hidden group"
              style={{ padding: "16px 22px 14px" }}
            >
              {/* 2px top accent */}
              <div className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: `linear-gradient(90deg, ${k.color}80 0%, ${k.color}22 55%, transparent 100%)` }} />

              {/* Hover side glow */}
              <div className="absolute left-0 top-0 bottom-0 w-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(180deg, transparent, ${k.color}60, transparent)` }} />

              {/* Label */}
              <div
                style={{
                  fontFamily:    "'Rajdhani', sans-serif",
                  fontSize:      10,
                  fontWeight:    600,
                  letterSpacing: "0.20em",
                  textTransform: "uppercase",
                  color:         `${k.color}75`,
                  lineHeight:    1,
                  marginBottom:  10,
                }}
              >
                {k.label}
              </div>

              {/* Value row */}
              <div className="flex items-baseline gap-[5px]" style={{ marginBottom: 8 }}>
                <span
                  style={{
                    fontFamily:         "'JetBrains Mono', monospace",
                    fontSize:           32,
                    fontWeight:         700,
                    lineHeight:         1,
                    color:              k.color,
                    fontVariantNumeric: "tabular-nums",
                    textShadow:         `0 0 20px ${k.color}40`,
                  }}
                >
                  {k.value}
                </span>
                {k.unit && (
                  <span
                    style={{
                      fontFamily:    "'JetBrains Mono', monospace",
                      fontSize:      11,
                      fontWeight:    500,
                      letterSpacing: "0.08em",
                      color:         `${k.color}40`,
                    }}
                  >
                    {k.unit}
                  </span>
                )}
              </div>

              {/* Sub-line */}
              <div
                style={{
                  fontFamily:    "'JetBrains Mono', monospace",
                  fontSize:      8,
                  letterSpacing: "0.13em",
                  color:         `${k.color}38`,
                  lineHeight:    1,
                  textTransform: "uppercase",
                }}
              >
                {k.sub}
              </div>
            </div>
          ))}
        </div>

        {/* ── MAP + THREAT FEED ──────────────────────────── */}
        <div className="grid grid-cols-12 gap-3">

          <div className="col-span-8 min-h-0">
            <div className="aegis-panel h-full">
              <PanelHeader label="Network Map"          icon="◈" tag="LIVE"                     tagColor="#00aaff" />
              <RealTimeMap nodes={nodes} />
            </div>
          </div>

          <div className="col-span-4 min-h-0">
            <div className="aegis-panel h-full flex flex-col">
              <PanelHeader label="Threat Feed"          icon="⚠" tag={`${alerts.length} ACTIVE`} tagColor="#ff4040" />
              <AlertsPanel alerts={alerts} />
            </div>
          </div>

          <div className="col-span-12">
            <div className="aegis-panel">
              <PanelHeader label="Latency Heatmap"      icon="◐" tag="5s REFRESH"              tagColor="#ffaa00" />
              <div className="aegis-child-content">
                <LatencyHeatmap data={latency} />
              </div>
            </div>
          </div>

          <div className="col-span-12">
            <div className="aegis-panel">
              <PanelHeader label="System Observability" icon="≡" tag="2s REFRESH"              tagColor="#99ee00" />
              <div className="aegis-child-content">
                <SystemMetrics />
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer className="border-t border-[#111926] shrink-0">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between px-6 h-[30px]">
          <div className="flex items-center gap-3"
            style={{ fontFamily: "'JetBrains Mono'", fontSize: 8, letterSpacing: "0.14em", color: "#1a3050" }}>
            <span>AEGIS v4.1.0-PROD</span>
            <span style={{ color: "#0e1a28" }}>·</span>
            <span>CLUSTER: ORION-7</span>
            <span style={{ color: "#0e1a28" }}>·</span>
            <span>REGION: IN-WEST</span>
          </div>
          <div className="flex items-center gap-3"
            style={{ fontFamily: "'JetBrains Mono'", fontSize: 8, letterSpacing: "0.14em", color: "#1a3050" }}>
            <span>POLL: 3s</span>
            <span style={{ color: "#0e1a28" }}>·</span>
            <span>ENC: AES-256-GCM</span>
            <span style={{ color: "#0e1a28" }}>·</span>
            <span style={{ color: "rgba(0,170,255,0.35)" }}>● FEED ACTIVE</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

/* ── Shared Panel Header ────────────────────────────────────── */
function PanelHeader({
  label, icon, tag, tagColor,
}: {
  label: string; icon: string; tag?: string; tagColor?: string;
}) {
  return (
    <div
      className="flex items-center justify-between border-b border-[#111926]"
      style={{ padding: "10px 20px", background: "#050810", minHeight: 42 }}
    >
      <div className="flex items-center gap-[10px]">
        <span style={{ color: tagColor ? `${tagColor}55` : "#1e3550", fontSize: 13, lineHeight: 1, display: "flex", alignItems: "center" }}>
          {icon}
        </span>
        <span style={{
          fontFamily:    "'Rajdhani', sans-serif",
          fontSize:      12,
          fontWeight:    600,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color:         "#4a6a88",
        }}>
          {label}
        </span>
      </div>

      {tag && (
        <div className="flex items-center gap-[7px]">
          <span
            className="rounded-full animate-pulse"
            style={{ width: 4, height: 4, background: tagColor, display: "inline-block", flexShrink: 0,
              boxShadow: `0 0 5px ${tagColor}` }}
          />
          <span style={{
            fontFamily:    "'JetBrains Mono', monospace",
            fontSize:      8,
            letterSpacing: "0.16em",
            fontWeight:    500,
            padding:       "3px 8px",
            border:        `1px solid ${tagColor}28`,
            background:    `${tagColor}0a`,
            color:         tagColor,
            whiteSpace:    "nowrap",
          }}>
            {tag}
          </span>
        </div>
      )}
    </div>
  );
}