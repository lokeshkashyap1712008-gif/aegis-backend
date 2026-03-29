"use client";

import { useState } from "react";

const THREAT = {
  CRITICAL: { color: "#ff4040", icon: "◉", priority: 0 },
  DDOS:     { color: "#ff8800", icon: "⟳", priority: 1 },
  SLEEPER:  { color: "#ffcc00", icon: "◌", priority: 2 },
  DEFAULT:  { color: "#3a5878", icon: "○", priority: 3 },
};
const cfg = (type) => THREAT[type] || THREAT.DEFAULT;

const riskLabel = (score) => {
  if (score >= 80) return "CRITICAL";
  if (score >= 60) return "HIGH";
  if (score >= 40) return "ELEVATED";
  if (score >= 20) return "MODERATE";
  return "LOW";
};

export default function AlertsPanel({ alerts }) {
  const [filter, setFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("severity");

  const types     = ["ALL", ...new Set(alerts.map(a => a.type).filter(Boolean))];
  const critCount = alerts.filter(a => a.type === "CRITICAL").length;

  const filtered = alerts
    .filter(a => filter === "ALL" || a.type === filter)
    .sort((a, b) =>
      sortBy === "severity"
        ? (b.severity || 0) - (a.severity || 0)
        : cfg(a.type).priority - cfg(b.type).priority
    );

  return (
    <div className="flex flex-col flex-1 min-h-0" style={{ fontFamily: "'JetBrains Mono', monospace" }}>

      {/* ── Filter bar ─────────────────────────────── */}
      <div
        className="flex items-stretch border-b border-[#111926] shrink-0"
        style={{ background: "#05080f", minHeight: 34 }}
      >
        <div className="flex items-stretch flex-1">
          {types.slice(0, 4).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className="flex items-center justify-center flex-1 border-r border-[#111926] transition-colors duration-100"
              style={{
                fontFamily:    "'Rajdhani', sans-serif",
                fontSize:      9,
                fontWeight:    600,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color:         filter === t ? "#00aaff" : "#253848",
                background:    filter === t ? "rgba(0,170,255,0.06)" : "transparent",
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          onClick={() => setSortBy(s => s === "severity" ? "type" : "severity")}
          className="flex items-center justify-center px-4 shrink-0 transition-colors hover:text-[#3a5878]"
          style={{
            fontFamily:    "'Rajdhani', sans-serif",
            fontSize:      9,
            fontWeight:    600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color:         "#1e3050",
          }}
        >
          SORT ↕
        </button>
      </div>

      {/* ── Summary bar ───────────────────────────── */}
      <div
        className="flex items-center gap-4 border-b border-[#111926] shrink-0"
        style={{ padding: "7px 16px", background: "#050810" }}
      >
        <div className="flex items-center gap-[7px]">
          <span
            className="rounded-full animate-pulse"
            style={{ width: 5, height: 5, background: critCount > 0 ? "#ff4040" : "#1a3050",
              display: "inline-block", flexShrink: 0,
              boxShadow: critCount > 0 ? "0 0 5px #ff4040" : "none" }}
          />
          <span style={{ fontSize: 9, letterSpacing: "0.14em", color: critCount > 0 ? "#ff4040" : "#1e3550" }}>
            {critCount} CRITICAL
          </span>
        </div>
        <span style={{ color: "#0e1e30" }}>·</span>
        <span style={{ fontSize: 9, letterSpacing: "0.12em", color: "#1e3550" }}>
          {alerts.length} TOTAL
        </span>
        <span style={{ color: "#0e1e30" }}>·</span>
        <span style={{ fontSize: 9, letterSpacing: "0.12em", color: "#1e3550" }}>
          {filtered.length} SHOWN
        </span>
      </div>

      {/* ── Alert list ────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto min-h-0"
        style={{ padding: "10px 12px", gap: 6, display: "flex", flexDirection: "column" }}
      >
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 gap-3 py-10">
            <span style={{ fontSize: 22, color: "#111926", lineHeight: 1 }}>◎</span>
            <span style={{
              fontSize:      9,
              letterSpacing: "0.22em",
              color:         "#1e3050",
              fontFamily:    "'Rajdhani', sans-serif",
              fontWeight:    600,
            }}>
              NO ACTIVE THREATS
            </span>
          </div>
        )}

        {filtered.map((a, i) => {
          const c     = cfg(a.type);
          const score = (a.severity || 0) * 10;
          const label = riskLabel(score);

          return (
            <div
              key={i}
              className="relative hover:translate-x-[2px] transition-transform duration-150"
              style={{
                border:     `1px solid ${c.color}1e`,
                background: `${c.color}06`,
                padding:    "10px 13px 10px 15px",
              }}
            >
              {/* Left accent bar */}
              <div className="absolute left-0 top-0 bottom-0 w-[2px]"
                style={{ background: `linear-gradient(180deg, ${c.color}, ${c.color}40)` }} />

              {/* Row 1: node ID + type badge */}
              <div className="flex items-center justify-between mb-[8px]">
                <div className="flex items-center gap-[7px]">
                  <span style={{ color: c.color, fontSize: 11, lineHeight: 1, flexShrink: 0 }}>{c.icon}</span>
                  <span style={{ color: c.color, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em" }}>
                    {a.node_id || "UNKNOWN"}
                  </span>
                </div>
                <span style={{
                  fontSize:      8,
                  letterSpacing: "0.14em",
                  fontWeight:    600,
                  padding:       "2px 7px",
                  border:        `1px solid ${c.color}35`,
                  background:    `${c.color}0e`,
                  color:         c.color,
                  fontFamily:    "'Rajdhani', sans-serif",
                  whiteSpace:    "nowrap",
                }}>
                  {a.type || "UNKNOWN"}
                </span>
              </div>

              {/* Row 2: progress bar + score */}
              <div className="flex items-center gap-2 mb-[7px]">
                <div className="flex-1 relative overflow-hidden" style={{ height: 3, background: "#0e1520" }}>
                  <div
                    className="absolute left-0 top-0 bottom-0 transition-all duration-500"
                    style={{ width: `${score}%`, background: c.color, opacity: 0.75 }}
                  />
                </div>
                <span style={{
                  fontSize:           9,
                  color:              c.color,
                  fontWeight:         700,
                  minWidth:           24,
                  textAlign:          "right",
                  fontVariantNumeric: "tabular-nums",
                }}>
                  {score}
                </span>
              </div>

              {/* Row 3: sev + risk label */}
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 8, letterSpacing: "0.12em", color: "#2a4260" }}>
                  SEV <span style={{ color: "#3a5878" }}>{a.severity ?? "—"}</span>
                </span>
                <span style={{
                  fontSize:      8,
                  letterSpacing: "0.14em",
                  fontWeight:    600,
                  color:         `${c.color}aa`,
                  fontFamily:    "'Rajdhani', sans-serif",
                }}>
                  {label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Footer ────────────────────────────────── */}
      <div
        className="flex items-center justify-between border-t border-[#111926] shrink-0"
        style={{ padding: "7px 16px", background: "#050810" }}
      >
        <span style={{ fontSize: 8, letterSpacing: "0.14em", color: "#1a3050" }}>FEED &lt;100ms</span>
        <span style={{ fontSize: 8, letterSpacing: "0.14em", color: "#1a3050" }}>SORT: {sortBy.toUpperCase()}</span>
      </div>

    </div>
  );
}