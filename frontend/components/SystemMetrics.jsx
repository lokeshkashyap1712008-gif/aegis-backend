"use client";

import { useEffect, useState } from "react";
import { parseMetrics } from "../utils/parseMetrics";

const METRICS = [
  { key: "ingestion",  label: "Ingestion Events", sub: "Total processed",  color: "#00dd88", icon: "↓", unit: "evt" },
  { key: "errors",     label: "Error Rate",        sub: "Pipeline faults",  color: "#ff4040", icon: "⚡", unit: "err" },
  { key: "detections", label: "Detections",        sub: "Anomaly signals",  color: "#ff9900", icon: "◉", unit: "det" },
];

const MAX_HIST = 22;

export default function SystemMetrics() {
  const [metrics,  setMetrics]  = useState({ ingestion: 0, errors: 0, detections: 0 });
  const [prev,     setPrev]     = useState({ ingestion: 0, errors: 0, detections: 0 });
  const [history,  setHistory]  = useState({ ingestion: [], errors: [], detections: [] });
  const [syncTime, setSyncTime] = useState(null);

  useEffect(() => {
    const tick = async () => {
      try {
        const res    = await fetch("http://127.0.0.1:8000/metrics/prometheus");
        const text   = await res.text();
        const parsed = parseMetrics(text);

        setPrev(metrics);
        setMetrics(parsed);
        setSyncTime(new Date());
        setHistory(h => {
          const next = { ...h };
          for (const k of ["ingestion", "errors", "detections"])
            next[k] = [...(h[k] || []), parsed[k] ?? 0].slice(-MAX_HIST);
          return next;
        });
      } catch {}
    };
    tick();
    const id = setInterval(tick, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ padding: "16px 20px 18px", fontFamily: "'JetBrains Mono', monospace" }}>

      {/* Meta row */}
      <div
        className="flex items-center justify-between border-b border-[#111926] pb-3 mb-4"
        style={{ fontSize: 8, letterSpacing: "0.14em", color: "#1e3550" }}
      >
        <div className="flex items-center gap-3">
          <span>ENDPOINT: localhost:8000</span>
          <span style={{ color: "#0c1a28" }}>·</span>
          <span>POLL: 2000ms</span>
        </div>
        {syncTime && (
          <div className="flex items-center gap-2">
            <span
              className="rounded-full animate-pulse"
              style={{ width: 5, height: 5, background: "#00ee88", display: "inline-block", flexShrink: 0,
                boxShadow: "0 0 4px #00ee88" }}
            />
            <span style={{ color: "#2a4860" }}>
              LAST SYNC: {syncTime.toTimeString().split(" ")[0]}
            </span>
          </div>
        )}
      </div>

      {/* 3 metric cards */}
      <div className="grid grid-cols-3 gap-3">
        {METRICS.map((m) => {
          const val   = metrics[m.key] ?? 0;
          const delta = val - (prev[m.key] ?? 0);
          const hist  = history[m.key] || [];
          const maxH  = Math.max(...hist, 1);

          return (
            <div
              key={m.key}
              className="relative overflow-hidden group transition-colors duration-200"
              style={{
                border:     "1px solid #111926",
                background: "#060a14",
                padding:    "15px 17px 13px",
              }}
            >
              {/* Top gradient bar */}
              <div className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: `linear-gradient(90deg, ${m.color}70, ${m.color}18, transparent)` }} />
              {/* Left gradient bar */}
              <div className="absolute top-0 left-0 bottom-0 w-[2px]"
                style={{ background: `linear-gradient(180deg, ${m.color}65, transparent)` }} />
              {/* Hover radial glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `radial-gradient(ellipse at 20% 35%, ${m.color}08, transparent 65%)` }} />

              <div className="relative z-10">

                {/* Header: label + delta badge */}
                <div className="flex items-start justify-between mb-[11px]">
                  <div>
                    <div className="flex items-center gap-[7px] mb-[5px]">
                      <span style={{ color: m.color, fontSize: 12, lineHeight: 1, display: "flex", alignItems: "center" }}>
                        {m.icon}
                      </span>
                      <span style={{
                        fontFamily:    "'Rajdhani', sans-serif",
                        fontSize:      11,
                        fontWeight:    600,
                        letterSpacing: "0.17em",
                        textTransform: "uppercase",
                        color:         m.color,
                      }}>
                        {m.label}
                      </span>
                    </div>
                    <div style={{ fontSize: 8, letterSpacing: "0.12em", color: "#1e3550" }}>{m.sub}</div>
                  </div>
                  <span style={{
                    fontSize:           8,
                    letterSpacing:      "0.10em",
                    fontWeight:         600,
                    padding:            "2px 7px",
                    border:             `1px solid ${delta >= 0 ? m.color : "#ff4040"}35`,
                    background:         `${delta >= 0 ? m.color : "#ff4040"}0c`,
                    color:              delta >= 0 ? m.color : "#ff4040",
                    fontVariantNumeric: "tabular-nums",
                    whiteSpace:         "nowrap",
                    flexShrink:         0,
                  }}>
                    {delta >= 0 ? "+" : ""}{delta}
                  </span>
                </div>

                {/* Value */}
                <div className="flex items-baseline gap-[5px] mb-[14px]">
                  <span style={{
                    fontSize:           29,
                    fontWeight:         700,
                    lineHeight:         1,
                    color:              m.color,
                    fontVariantNumeric: "tabular-nums",
                    textShadow:         `0 0 20px ${m.color}35`,
                  }}>
                    {val.toLocaleString()}
                  </span>
                  <span style={{ fontSize: 10, letterSpacing: "0.10em", color: `${m.color}42`, fontWeight: 500 }}>
                    {m.unit}
                  </span>
                </div>

                {/* Sparkline */}
                {hist.length > 1 && (
                  <div
                    className="border-t border-[#111926] pt-[10px]"
                    style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 36 }}
                  >
                    {hist.map((v, i) => {
                      const pct  = maxH > 0 ? (v / maxH) * 100 : 0;
                      const last = i === hist.length - 1;
                      return (
                        <div key={i} className="flex-1 flex items-end" style={{ minWidth: 0 }}>
                          <div
                            style={{
                              width:      "100%",
                              minHeight:  2,
                              height:     `${Math.max(pct, 5)}%`,
                              background: last ? m.color : `${m.color}30`,
                              transition: "height 0.3s ease",
                              boxShadow:  last ? `0 0 4px ${m.color}` : "none",
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Min / Max */}
                {hist.length > 1 && (
                  <div
                    className="flex justify-between mt-[6px]"
                    style={{ fontSize: 8, letterSpacing: "0.12em", color: "#1e3550" }}
                  >
                    <span>MIN {Math.min(...hist)}</span>
                    <span>MAX {Math.max(...hist)}</span>
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}