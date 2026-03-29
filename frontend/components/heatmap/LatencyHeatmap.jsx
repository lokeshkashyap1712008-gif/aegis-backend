"use client";

export default function LatencyHeatmap({ data }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Latency</h2>

      {data.map((node) => (
        <div key={node.node_id}>
          {node.node_id} → Avg: {node.avg_latency} | Max: {node.max_latency}
        </div>
      ))}
    </div>
  );
}