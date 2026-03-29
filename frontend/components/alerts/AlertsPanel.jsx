"use client";

const getBorderColor = (type) => {
  if (type === "CRITICAL") return "border-red-500 bg-red-500/20";
  if (type === "DDOS") return "border-orange-400 bg-orange-400/20";
  if (type === "SLEEPER") return "border-yellow-400 bg-yellow-400/20";
  return "border-gray-500";
};

export default function AlertsPanel({ alerts }) {
  return (
    <div className="card p-6 rounded-xl">
      <h2 className="text-xl font-bold text-red-400 mb-4">
        🚨 Threat Feed
      </h2>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {alerts.length === 0 && (
          <p className="text-gray-400 text-sm">No active threats</p>
        )}

        {alerts.map((a, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg border transition-all duration-300 hover:scale-[1.02] ${getBorderColor(
              a.type
            )} animate-pulse`}
          >
            <div className="flex justify-between">
              <p className="font-semibold">{a.node_id}</p>
              <span className="text-xs text-gray-300">
                {a.type}
              </span>
            </div>

            <div className="flex justify-between text-xs mt-2">
              <span>Severity: {a.severity}</span>
              <span className="font-bold text-red-300">
                Risk: {a.severity * 10}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}