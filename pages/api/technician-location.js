// In-memory store for technician locations (use Redis/DB in production)
// This will reset on each deployment, but works for MVP
const technicianLocations = new Map();

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    // Receive location from technician app
    const { technicianId, sessionId, latitude, longitude, timestamp, online } = req.body;

    if (!technicianId) {
      return res.status(400).json({ error: 'technicianId is required' });
    }

    const locationData = {
      technicianId,
      sessionId,
      latitude,
      longitude,
      timestamp: timestamp || Date.now(),
      online: online !== false,
      lastUpdate: Date.now()
    };

    technicianLocations.set(technicianId, locationData);

    // Clean up offline technicians (no update in 30 seconds)
    const now = Date.now();
    for (const [id, data] of technicianLocations.entries()) {
      if (now - data.lastUpdate > 30000) {
        technicianLocations.set(id, { ...data, online: false });
      }
    }

    return res.status(200).json({ success: true, received: locationData });
  }

  if (req.method === 'GET') {
    // Return technician location(s)
    const { technicianId } = req.query;

    if (technicianId) {
      const location = technicianLocations.get(technicianId);
      if (!location) {
        return res.status(404).json({ error: 'Technician not found', online: false });
      }

      // Check if stale (no update in 30 seconds)
      const isStale = Date.now() - location.lastUpdate > 30000;
      return res.status(200).json({
        ...location,
        online: location.online && !isStale
      });
    }

    // Return all online technicians
    const allTechnicians = [];
    const now = Date.now();

    for (const [id, data] of technicianLocations.entries()) {
      const isStale = now - data.lastUpdate > 30000;
      allTechnicians.push({
        ...data,
        online: data.online && !isStale
      });
    }

    return res.status(200).json({ technicians: allTechnicians });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
