"use client";

const getColor = (status) => {
  if (status === "critical") return "bg-red-500";
  if (status === "sleeper") return "bg-yellow-400";
  return "bg-green-500";
};

export default function NodeMap({ nodes }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {nodes.map((node) => (
        <div
          key={node.node_id}
          className={`p-4 text-white rounded ${getColor(node.status)}`}
        >
          <h3>{node.node_id}</h3>
          <p>{node.avg_latency} ms</p>
        </div>
      ))}
    </div>
  );
}