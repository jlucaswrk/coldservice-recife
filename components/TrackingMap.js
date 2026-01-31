import { useState, useEffect, useRef } from 'react';

/**
 * TrackingMap - Mapa interativo estilo "Central de Operações"
 * Usado na home e na página de atendimento
 */

// Bairros de Recife para visualização no mapa
const RECIFE_NEIGHBORHOODS = [
  { name: "Boa Viagem", lat: -8.1234, lng: -34.9012, mapX: 75, mapY: 85 },
  { name: "Casa Forte", lat: -8.0345, lng: -34.9123, mapX: 55, mapY: 35 },
  { name: "Boa Vista", lat: -8.0623, lng: -34.8812, mapX: 100, mapY: 50 },
  { name: "Espinheiro", lat: -8.0412, lng: -34.8945, mapX: 85, mapY: 40 },
  { name: "Graças", lat: -8.0389, lng: -34.9034, mapX: 70, mapY: 38 },
  { name: "Aflitos", lat: -8.0456, lng: -34.9089, mapX: 65, mapY: 42 },
  { name: "Derby", lat: -8.0534, lng: -34.9001, mapX: 78, mapY: 45 },
  { name: "Parnamirim", lat: -8.0312, lng: -34.9178, mapX: 50, mapY: 32 },
  { name: "Tamarineira", lat: -8.0267, lng: -34.9123, mapX: 55, mapY: 28 },
  { name: "Torre", lat: -8.0489, lng: -34.8923, mapX: 90, mapY: 44 },
  { name: "Madalena", lat: -8.0567, lng: -34.9089, mapX: 68, mapY: 52 },
  { name: "Ilha do Leite", lat: -8.0623, lng: -34.8856, mapX: 105, mapY: 55 },
  { name: "Recife Antigo", lat: -8.0634, lng: -34.8712, mapX: 120, mapY: 48 },
  { name: "Imbiribeira", lat: -8.1089, lng: -34.9156, mapX: 60, mapY: 78 },
  { name: "Pina", lat: -8.0934, lng: -34.8834, mapX: 105, mapY: 72 },
];

function findNearestNeighborhood(lat, lng) {
  let nearest = RECIFE_NEIGHBORHOODS[0];
  let minDist = Infinity;
  for (const n of RECIFE_NEIGHBORHOODS) {
    const dist = Math.sqrt(Math.pow(n.lat - lat, 2) + Math.pow(n.lng - lng, 2));
    if (dist < minDist) {
      minDist = dist;
      nearest = n;
    }
  }
  return nearest;
}

// Calcula distância em km usando Haversine
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function formatDistance(km) {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
}

function estimateArrival(distanceKm) {
  const avgSpeedKmH = 30;
  const minutes = (distanceKm / avgSpeedKmH) * 60;
  if (minutes < 1) return 'Chegando!';
  if (minutes < 60) return `${Math.round(minutes)} min`;
  return `${Math.round(minutes / 60)}h ${Math.round(minutes % 60)}min`;
}

export default function TrackingMap({
  customerLocation = null,
  technicianLocation = null,
  showTechnicians = true, // Mostrar técnicos genéricos quando não há tracking
  mode = 'default', // 'default' | 'tracking' | 'minimal'
  onLocationDetected = null,
  className = '',
  customerName = null, // Nome do cliente para personalização
}) {
  const [userLocation, setUserLocation] = useState(customerLocation);
  const [techLocation, setTechLocation] = useState(technicianLocation);
  const [distance, setDistance] = useState(null);
  const [radarAngle, setRadarAngle] = useState(0);
  const [pulsePhase, setPulsePhase] = useState(0);
  const [neighborhoodName, setNeighborhoodName] = useState(null);

  // Atualiza localização do cliente
  useEffect(() => {
    if (customerLocation) {
      const nearest = findNearestNeighborhood(customerLocation.latitude, customerLocation.longitude);
      setUserLocation({
        ...customerLocation,
        mapX: nearest.mapX,
        mapY: nearest.mapY
      });
      setNeighborhoodName(nearest.name);
    }
  }, [customerLocation]);

  // Atualiza localização do técnico
  useEffect(() => {
    if (technicianLocation?.latitude) {
      const nearest = findNearestNeighborhood(technicianLocation.latitude, technicianLocation.longitude);
      setTechLocation({
        ...technicianLocation,
        mapX: nearest.mapX,
        mapY: nearest.mapY
      });
    } else {
      setTechLocation(null);
    }
  }, [technicianLocation]);

  // Calcula distância
  useEffect(() => {
    if (userLocation?.latitude && techLocation?.latitude) {
      const dist = calculateDistance(
        userLocation.latitude, userLocation.longitude,
        techLocation.latitude, techLocation.longitude
      );
      setDistance(dist);
    }
  }, [userLocation, techLocation]);

  // Animação do radar
  useEffect(() => {
    if (mode !== 'tracking') return;
    const interval = setInterval(() => {
      setRadarAngle(prev => (prev + 3) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [mode]);

  // Animação de pulso
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(prev => (prev + 1) % 3);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isTracking = mode === 'tracking' && techLocation?.online;

  return (
    <div className={`relative ${className}`}>
      {/* Main Dashboard Card */}
      <div className="relative bg-gradient-to-br from-[#0a0f1a] to-[#131d35] rounded-2xl border border-[#243556] overflow-hidden">
        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(157, 209, 241, 0.5) 2px, rgba(157, 209, 241, 0.5) 4px)'
        }} />

        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#243556] bg-[#0d1526]/80">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-[#ff6b35]" />
              <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
              <div className="w-2 h-2 rounded-full bg-[#25d366]" />
            </div>
            <span className="text-[10px] font-mono text-[#9dd1f1]/60 uppercase tracking-widest">
              {isTracking && neighborhoodName
                ? `Atendimento urgente • ${neighborhoodName}`
                : isTracking
                  ? 'Rastreamento Ativo'
                  : 'Central de Operações'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${isTracking ? 'bg-[#ff6b35] animate-pulse' : 'bg-[#25d366] animate-pulse'}`} />
            <span className={`text-[10px] font-mono ${isTracking ? 'text-[#ff6b35]' : 'text-[#25d366]'}`}>
              {isTracking ? 'TRACKING' : 'LIVE'}
            </span>
          </div>
        </div>

        {/* Mensagem personalizada para atendimento urgente */}
        {isTracking && neighborhoodName && (
          <div className="px-4 pt-4 pb-2">
            <div className="bg-gradient-to-r from-[#ff6b35]/10 to-[#f59e0b]/10 border border-[#ff6b35]/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[#ff6b35] animate-pulse">🚨</span>
                <span className="text-xs font-bold text-[#ff6b35] uppercase tracking-wider">
                  Atendimento Urgente
                </span>
              </div>
              <p className="text-sm text-white/90">
                {customerName
                  ? `${customerName}, estamos a caminho do seu endereço em `
                  : 'Técnico a caminho da sua localização em '}
                <span className="font-bold text-[#6bb8e8]">{neighborhoodName}</span>
              </p>
              <p className="text-[10px] text-[#9dd1f1]/50 mt-1">
                Acompanhe em tempo real no mapa abaixo
              </p>
            </div>
          </div>
        )}

        {/* Map Section */}
        <div className="relative p-4 pt-2">
          <div className="relative h-56 rounded-lg bg-[#0d1526] border border-[#243556]/50 overflow-hidden">
            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'linear-gradient(#9dd1f1 1px, transparent 1px), linear-gradient(90deg, #9dd1f1 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }} />

            {/* Radar sweep effect (tracking mode) */}
            {isTracking && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `conic-gradient(from ${radarAngle}deg at 50% 50%, transparent 0deg, rgba(255, 107, 53, 0.15) 30deg, transparent 60deg)`,
                }}
              />
            )}

            {/* Recife map shape */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice">
              <path d="M0,0 L200,0 L200,120 L0,120 Z" fill="#0a0f1a" />
              <path
                d="M20,30 Q40,20 60,35 L80,25 Q100,15 120,30 L140,40 Q160,35 180,50 L185,80 Q170,90 150,85 L130,95 Q110,100 90,90 L70,100 Q50,105 30,95 L15,70 Q10,50 20,30 Z"
                fill="#1a2744"
                stroke="#243556"
                strokeWidth="1"
              />
              <path d="M60,35 Q70,60 60,85" stroke="#6bb8e8" strokeWidth="2" fill="none" opacity="0.3" />
              <path d="M120,30 Q130,55 125,80" stroke="#6bb8e8" strokeWidth="2" fill="none" opacity="0.3" />
            </svg>

            {/* Generic technician markers (default mode) */}
            {showTechnicians && !isTracking && (
              <>
                {[
                  { top: '15%', left: '20%', delay: '0s' },
                  { top: '35%', left: '35%', delay: '0.5s' },
                  { top: '25%', left: '65%', delay: '1s', color: '#f59e0b' },
                  { top: '60%', left: '25%', delay: '1.5s' },
                ].map((pos, i) => (
                  <div key={i} className="absolute flex items-center justify-center" style={{ top: pos.top, left: pos.left }}>
                    <div
                      className="absolute w-6 h-6 rounded-full animate-ping"
                      style={{
                        backgroundColor: `${pos.color || '#25d366'}30`,
                        animationDelay: pos.delay
                      }}
                    />
                    <div
                      className="relative w-2.5 h-2.5 rounded-full border border-[#0d1526]"
                      style={{ backgroundColor: pos.color || '#25d366' }}
                    />
                  </div>
                ))}
              </>
            )}

            {/* Customer marker */}
            {userLocation && (
              <div
                className="absolute z-20 flex flex-col items-center transition-all duration-500"
                style={{
                  top: `${(userLocation.mapY / 120) * 100}%`,
                  left: `${(userLocation.mapX / 200) * 100}%`,
                  transform: 'translate(-50%, -100%)'
                }}
              >
                <div className="relative mb-1 animate-fade-up">
                  <div className="bg-[#ff6b35] text-white text-[9px] font-bold px-2 py-1 rounded-md whitespace-nowrap shadow-lg shadow-[#ff6b35]/30">
                    📍 {isTracking && neighborhoodName ? neighborhoodName : (isTracking ? 'Sua localização' : 'Você está aqui')}
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#ff6b35]" />
                </div>
                <div className="relative">
                  <div className="absolute w-10 h-10 -top-2 -left-2 bg-[#ff6b35]/20 rounded-full animate-ping" />
                  <div className="absolute w-6 h-6 -top-0.5 -left-0.5 bg-[#ff6b35]/40 rounded-full animate-pulse" />
                  <div className="relative w-4 h-4 bg-gradient-to-br from-[#ff6b35] to-[#e55a2b] rounded-full border-2 border-white shadow-lg" />
                </div>
              </div>
            )}

            {/* Technician marker (tracking mode) */}
            {isTracking && techLocation && (
              <div
                className="absolute z-20 flex flex-col items-center transition-all duration-1000 ease-out"
                style={{
                  top: `${(techLocation.mapY / 120) * 100}%`,
                  left: `${(techLocation.mapX / 200) * 100}%`,
                  transform: 'translate(-50%, -100%)'
                }}
              >
                <div className="relative mb-1">
                  <div className="bg-[#25d366] text-white text-[9px] font-bold px-2 py-1 rounded-md whitespace-nowrap shadow-lg shadow-[#25d366]/30 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    Técnico a caminho
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#25d366]" />
                </div>
                <div className="relative">
                  <div className="absolute w-12 h-12 -top-3 -left-3 bg-[#25d366]/20 rounded-full animate-ping" />
                  <div className="absolute w-8 h-8 -top-1 -left-1 bg-[#25d366]/30 rounded-full animate-pulse" />
                  <div className="relative w-5 h-5 bg-gradient-to-br from-[#25d366] to-[#1da851] rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                    <span className="text-[8px]">🔧</span>
                  </div>
                </div>
              </div>
            )}

            {/* Connection line between markers */}
            {isTracking && userLocation && techLocation && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                <defs>
                  <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#25d366" />
                    <stop offset="100%" stopColor="#ff6b35" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <line
                  x1={`${(techLocation.mapX / 200) * 100}%`}
                  y1={`${(techLocation.mapY / 120) * 100 - 8}%`}
                  x2={`${(userLocation.mapX / 200) * 100}%`}
                  y2={`${(userLocation.mapY / 120) * 100 - 8}%`}
                  stroke="url(#routeGradient)"
                  strokeWidth="2"
                  strokeDasharray="8,4"
                  filter="url(#glow)"
                  className="animate-pulse"
                />
              </svg>
            )}

            {/* Legend */}
            <div className="absolute bottom-2 left-2 flex items-center gap-3 bg-[#0a0f1a]/90 backdrop-blur-sm rounded px-2 py-1">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-[#ff6b35] rounded-full" />
                <span className="text-[8px] font-mono text-white/80">Você</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-[#25d366] rounded-full" />
                <span className="text-[8px] font-mono text-[#9dd1f1]/60">
                  {isTracking ? 'Técnico' : 'Técnicos'}
                </span>
              </div>
            </div>

            {/* Distance badge (tracking mode) */}
            {isTracking && distance !== null && (
              <div className="absolute top-2 right-2 bg-[#0a0f1a]/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-[#243556]">
                <div className="text-center">
                  <p className="text-lg font-black text-[#6bb8e8] font-mono">{formatDistance(distance)}</p>
                  <p className="text-[8px] text-[#9dd1f1]/60 uppercase tracking-wider">Distância</p>
                </div>
              </div>
            )}
          </div>

          {/* Stats bar (tracking mode) */}
          {isTracking && distance !== null && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="bg-[#1a2744]/60 rounded-lg p-3 text-center border border-[#243556]/50">
                <p className="text-xl font-black text-[#6bb8e8] font-mono">{formatDistance(distance)}</p>
                <p className="text-[9px] text-[#9dd1f1]/60 uppercase tracking-wider mt-1">Distância</p>
              </div>
              <div className="bg-[#1a2744]/60 rounded-lg p-3 text-center border border-[#243556]/50">
                <p className="text-xl font-black text-[#25d366] font-mono">{estimateArrival(distance)}</p>
                <p className="text-[9px] text-[#9dd1f1]/60 uppercase tracking-wider mt-1">Previsão</p>
              </div>
              <div className="bg-[#1a2744]/60 rounded-lg p-3 text-center border border-[#243556]/50">
                <div className="flex items-center justify-center gap-1">
                  <span className="w-2 h-2 bg-[#25d366] rounded-full animate-pulse" />
                  <p className="text-sm font-bold text-[#25d366]">Online</p>
                </div>
                <p className="text-[9px] text-[#9dd1f1]/60 uppercase tracking-wider mt-1">Status</p>
              </div>
            </div>
          )}

          {/* Waiting for technician (tracking mode, offline) */}
          {mode === 'tracking' && !techLocation?.online && (
            <div className="mt-3 bg-[#1a2744]/60 rounded-lg p-4 text-center border border-[#f59e0b]/30">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-5 h-5 border-2 border-[#f59e0b] border-t-transparent rounded-full animate-spin" />
                <span className="text-[#f59e0b] font-bold">Aguardando técnico...</span>
              </div>
              <p className="text-[#9dd1f1]/60 text-sm">
                O técnico ainda não iniciou o compartilhamento de localização
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
