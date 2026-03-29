"use client";

export default function AlertsPanel({ alerts }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Alerts</h2>

      {alerts.map((a, i) => (
        <div key={i} className="border p-2 mb-2">
          <p>{a.node_id}</p>
          <p>{a.type}</p>
          <p>Severity: {a.severity}</p>

          {/* 🔥 winning feature */}
          <p>Risk Score: {a.severity * 10}</p>
        </div>
      ))}
    </div>
  );
}