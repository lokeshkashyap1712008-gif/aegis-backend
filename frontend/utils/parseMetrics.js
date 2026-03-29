export function parseMetrics(text) {
    const lines = text.split("\n");
  
    const metrics = {
      ingestion: 0,
      errors: 0,
      detections: 0
    };
  
    lines.forEach((line) => {
      if (line.startsWith("ingestion_events_total")) {
        metrics.ingestion = parseFloat(line.split(" ")[1]) || 0;
      }
  
      if (line.startsWith("ingestion_errors_total")) {
        metrics.errors = parseFloat(line.split(" ")[1]) || 0;
      }
  
      if (line.startsWith("detections_total")) {
        metrics.detections = parseFloat(line.split(" ")[1]) || 0;
      }
    });
  
    return metrics;
  }