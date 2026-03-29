"use client";

export default function LatencyHeatmap({ data = [] }) {
  return (
    <div className="card p-6 rounded-xl">
      <h2 className="text-xl font-bold text-yellow-400 mb-4">
        🔥 Latency Heatmap
      </h2>

      <div className="space-y-2">
      {Array.isArray(data) && data.map((node) => (
          <div key={node.node_id}>
            <div className="flex justify-between text-sm">
              <span>{node.node_id}</span>
              <span>{node.avg_latency.toFixed(0)} ms</span>
            </div>

            <div className="w-full h-2 bg-gray-700 rounded">
              <div
                className="h-2 bg-yellow-400 rounded"
                style={{ width: `${Math.min(node.avg_latency / 10, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}