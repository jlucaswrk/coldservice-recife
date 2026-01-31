// Session management for customer-technician connections
// In production, use a proper database

const sessions = new Map();

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    // Create a new session
    const { customerName, customerPhone, technicianId = 'tech_001' } = req.body;

    if (!customerName) {
      return res.status(400).json({ error: 'customerName is required' });
    }

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const session = {
      sessionId,
      customerName,
      customerPhone,
      technicianId,
      customerLocation: null,
      createdAt: Date.now(),
      status: 'active'
    };

    sessions.set(sessionId, session);

    return res.status(200).json({
      success: true,
      session,
      // URL to share with customer
      trackingUrl: `/atendimento/${sessionId}`
    });
  }

  if (req.method === 'GET') {
    const { sessionId } = req.query;

    if (sessionId) {
      const session = sessions.get(sessionId);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }
      return res.status(200).json(session);
    }

    // Return all active sessions
    const activeSessions = Array.from(sessions.values())
      .filter(s => s.status === 'active');

    return res.status(200).json({ sessions: activeSessions });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
