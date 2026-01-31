// Health check endpoint
export default function handler(req, res) {
  res.status(200).json({
    status: "ok",
    name: "Cold Service Refrigeração API",
    timestamp: new Date().toISOString(),
  });
}
