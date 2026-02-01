import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * AtendimentoModal - Sistema de Atendimento Urgente
 * Mobile-first design com 100dvh para evitar cortes do navegador
 * Persistência de sessão em localStorage
 */

const STORAGE_KEY = 'coldservice_atendimento';

// Haversine formula
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
  if (minutes < 60) return `~${Math.round(minutes)} min`;
  return `~${Math.round(minutes / 60)}h`;
}

// Bairros para mapa - Coordenadas de Recife
const NEIGHBORHOODS = [
  { name: "Boa Viagem", lat: -8.1234, lng: -34.9012, mapX: 75, mapY: 85 },
  { name: "Casa Forte", lat: -8.0345, lng: -34.9123, mapX: 55, mapY: 35 },
  { name: "Boa Vista", lat: -8.0623, lng: -34.8812, mapX: 100, mapY: 50 },
  { name: "Espinheiro", lat: -8.0412, lng: -34.8945, mapX: 85, mapY: 40 },
  { name: "Graças", lat: -8.0389, lng: -34.9034, mapX: 70, mapY: 38 },
  { name: "Madalena", lat: -8.0567, lng: -34.9089, mapX: 68, mapY: 52 },
  { name: "Imbiribeira", lat: -8.1089, lng: -34.9156, mapX: 60, mapY: 78 },
  { name: "Centro", lat: -8.0476, lng: -34.8770, mapX: 90, mapY: 55 },
];

function findNearest(lat, lng) {
  let nearest = NEIGHBORHOODS[0];
  let minDist = Infinity;
  for (const n of NEIGHBORHOODS) {
    const dist = Math.sqrt(Math.pow(n.lat - lat, 2) + Math.pow(n.lng - lng, 2));
    if (dist < minDist) { minDist = dist; nearest = n; }
  }
  return nearest;
}

// Helpers para localStorage
function saveSession(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...data,
      timestamp: Date.now()
    }));
  } catch (e) {
    console.error('Error saving session:', e);
  }
}

function loadSession() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;

    const parsed = JSON.parse(data);
    // Sessão expira em 2 horas
    if (Date.now() - parsed.timestamp > 2 * 60 * 60 * 1000) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch (e) {
    console.error('Error loading session:', e);
    return null;
  }
}

function clearSession() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing session:', e);
  }
}

export default function AtendimentoModal({
  isOpen,
  isMinimized = false,
  onClose,
  onMinimize,
  whatsappNumber = '5581986804024',
  initialLocation = null
}) {
  const [step, setStep] = useState('identify'); // identify | tracking
  const [name, setName] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [customerLocation, setCustomerLocation] = useState(null);
  const [technicianLocation, setTechnicianLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [radarAngle, setRadarAngle] = useState(0);
  const [neighborhoodName, setNeighborhoodName] = useState(null);
  const [hasActiveSession, setHasActiveSession] = useState(false);

  const inputRef = useRef(null);
  const pollIntervalRef = useRef(null);
  const initializedRef = useRef(false);

  // Helper para minimizar/maximizar
  const setMinimized = (value) => {
    if (onMinimize) onMinimize(value);
  };

  // Carregar sessão do localStorage na inicialização
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const saved = loadSession();
    if (saved && saved.name && saved.sessionId) {
      setName(saved.name);
      setSessionId(saved.sessionId);
      setStep('tracking');
      setHasActiveSession(true);
      if (saved.neighborhoodName) {
        setNeighborhoodName(saved.neighborhoodName);
      }
      if (saved.customerLocation) {
        setCustomerLocation(saved.customerLocation);
      }
    }
  }, []);

  // Usar localização do Hero quando disponível
  useEffect(() => {
    if (initialLocation && initialLocation.lat && initialLocation.lng) {
      const nearest = findNearest(initialLocation.lat, initialLocation.lng);
      const newLocation = {
        latitude: initialLocation.lat,
        longitude: initialLocation.lng,
        mapX: nearest.mapX,
        mapY: nearest.mapY
      };
      setCustomerLocation(newLocation);
      setNeighborhoodName(nearest.name);

      // Salvar localização na sessão se houver
      if (sessionId) {
        const saved = loadSession();
        if (saved) {
          saveSession({
            ...saved,
            customerLocation: newLocation,
            neighborhoodName: nearest.name
          });
        }
      }
    }
  }, [initialLocation, sessionId]);

  // Focus no input quando abre
  useEffect(() => {
    if (isOpen && step === 'identify' && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, step]);

  // Poll para localização do técnico
  useEffect(() => {
    if (step !== 'tracking' || !sessionId) return;

    const fetchTechLocation = async () => {
      try {
        const res = await fetch(`/api/technician-location?technicianId=tech_001`);
        const data = await res.json();

        if (!data.error && data.online && data.latitude) {
          const nearest = findNearest(data.latitude, data.longitude);
          setTechnicianLocation({
            ...data,
            mapX: nearest.mapX,
            mapY: nearest.mapY
          });
        } else {
          setTechnicianLocation(prev => prev ? { ...prev, online: false } : null);
        }
      } catch (e) {
        console.error('Error fetching technician location:', e);
      }
    };

    fetchTechLocation();
    pollIntervalRef.current = setInterval(fetchTechLocation, 5000);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [step, sessionId]);

  // Calcular distância
  useEffect(() => {
    if (customerLocation?.latitude && technicianLocation?.latitude) {
      const dist = calculateDistance(
        customerLocation.latitude, customerLocation.longitude,
        technicianLocation.latitude, technicianLocation.longitude
      );
      setDistance(dist);
    }
  }, [customerLocation, technicianLocation]);

  // Animação radar
  useEffect(() => {
    if (step !== 'tracking') return;
    const interval = setInterval(() => setRadarAngle(prev => (prev + 2) % 360), 50);
    return () => clearInterval(interval);
  }, [step]);

  // Iniciar atendimento
  const handleStartTracking = async () => {
    if (!name.trim()) return;

    try {
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name.trim(),
          technicianId: 'tech_001'
        })
      });
      const data = await res.json();

      if (data.success) {
        const newSessionId = data.session.sessionId;
        setSessionId(newSessionId);
        setStep('tracking');
        setHasActiveSession(true);

        // Salvar no localStorage
        saveSession({
          name: name.trim(),
          sessionId: newSessionId,
          customerLocation,
          neighborhoodName
        });
      }
    } catch (e) {
      console.error('Error creating session:', e);
    }
  };

  // Abrir WhatsApp
  const openWhatsApp = useCallback(() => {
    let message = `Olá! Sou ${name || 'cliente'} e estou aguardando o atendimento de urgência.`;
    if (customerLocation) {
      message += `\n\nMinha localização: https://maps.google.com/?q=${customerLocation.latitude},${customerLocation.longitude}`;
    }
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  }, [name, customerLocation, whatsappNumber]);

  // Fechar modal - NÃO reinicia sessão, apenas minimiza se em tracking
  const handleClose = () => {
    if (step === 'tracking' && hasActiveSession) {
      // Se está em tracking, apenas minimiza
      setMinimized(true);
    } else {
      // Se está em identify sem sessão ativa, fecha normalmente
      onClose();
    }
  };

  // Encerrar sessão completamente
  const handleEndSession = () => {
    clearSession();
    setStep('identify');
    setName('');
    setSessionId(null);
    setTechnicianLocation(null);
    setHasActiveSession(false);
    setMinimized(false);
    onClose();
  };

  // Mostrar widget flutuante quando há sessão ativa e modal fechado
  if (!isOpen && hasActiveSession) {
    return (
      <div
        className="fixed bottom-24 right-4 z-[100] cursor-pointer"
        onClick={() => {
          onMinimize?.(false);
          // Reabrir modal
          if (onClose) {
            // Trigger para abrir - usamos um truque aqui
            const event = new CustomEvent('openAtendimento');
            window.dispatchEvent(event);
          }
        }}
      >
        <div className={`border-2 rounded-2xl p-4 shadow-2xl min-w-[240px] ${
          technicianLocation?.online
            ? 'bg-[#0d1526] border-[#25d366]'
            : 'bg-[#0d1526] border-[#f59e0b]'
        }`}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${
                technicianLocation?.online
                  ? 'bg-[#25d366]/10 border-[#25d366]'
                  : 'bg-[#f59e0b]/10 border-[#f59e0b]'
              }`}>
                <svg className={`w-6 h-6 ${technicianLocation?.online ? 'text-[#25d366]' : 'text-[#f59e0b]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              {technicianLocation?.online && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#25d366] rounded-full border-2 border-[#0d1526] animate-pulse" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-base font-bold truncate ${technicianLocation?.online ? 'text-[#25d366]' : 'text-[#f59e0b]'}`}>
                {technicianLocation?.online ? 'A CAMINHO!' : 'AGUARDANDO'}
              </p>
              <p className="text-white/60 text-xs truncate">{name}</p>
            </div>
            <svg className="w-5 h-5 text-white/40 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  if (!isOpen) return null;

  // Versão minimizada
  if (isMinimized) {
    return (
      <div
        className="fixed bottom-24 right-4 z-[100] cursor-pointer"
        onClick={() => setMinimized(false)}
      >
        <div className={`border-2 rounded-2xl p-4 shadow-2xl min-w-[240px] ${
          technicianLocation?.online
            ? 'bg-[#0d1526] border-[#25d366]'
            : 'bg-[#0d1526] border-[#f59e0b]'
        }`}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${
                technicianLocation?.online
                  ? 'bg-[#25d366]/10 border-[#25d366]'
                  : 'bg-[#f59e0b]/10 border-[#f59e0b]'
              }`}>
                <svg className={`w-6 h-6 ${technicianLocation?.online ? 'text-[#25d366]' : 'text-[#f59e0b]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              {technicianLocation?.online && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#25d366] rounded-full border-2 border-[#0d1526] animate-pulse" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-base font-bold truncate ${technicianLocation?.online ? 'text-[#25d366]' : 'text-[#f59e0b]'}`}>
                {technicianLocation?.online ? 'A CAMINHO!' : 'AGUARDANDO'}
              </p>
              {distance !== null && technicianLocation?.online ? (
                <p className="text-white text-sm font-medium">
                  {formatDistance(distance)} - {estimateArrival(distance)}
                </p>
              ) : (
                <p className="text-white/60 text-xs">Toque para ver</p>
              )}
            </div>
            <svg className="w-5 h-5 text-white/40 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0a0f1a]/90 backdrop-blur-sm"
        onClick={() => step === 'tracking' ? setMinimized(true) : handleClose()}
      />

      {/* Modal - Mobile-first com dvh */}
      <div className="relative w-full sm:max-w-md max-h-[100dvh] sm:max-h-[90vh] overflow-hidden">
        <div className="bg-[#0d1526] sm:rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[100dvh] sm:max-h-[90vh]">

          {/* Header - Compacto */}
          <div className="flex-shrink-0 px-4 py-3 border-b border-[#243556] bg-[#1a2744]/50">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h2 className="text-white font-bold text-lg truncate">
                  {step === 'identify' ? 'Atendimento Urgente' : `Urgente - ${neighborhoodName || 'Recife'}`}
                </h2>
                <p className="text-white/60 text-sm truncate">
                  {step === 'identify' ? 'Acompanhe o técnico em tempo real' : `Olá, ${name}!`}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full bg-[#243556] hover:bg-[#34496d] transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-4">
            {/* Step 1: Identificação */}
            {step === 'identify' && (
              <div className="space-y-4">
                {/* Input de nome */}
                <div>
                  <label className="block text-sm text-white mb-2 font-medium">
                    Qual é o seu nome?
                  </label>
                  <input
                    ref={inputRef}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Digite seu nome"
                    className="w-full px-4 py-3 bg-[#1a2744] border-2 border-[#243556] rounded-xl text-white text-base placeholder-[#9dd1f1]/40 focus:outline-none focus:border-[#6bb8e8] transition-colors"
                    onKeyDown={(e) => e.key === 'Enter' && handleStartTracking()}
                  />
                </div>

                {/* Como funciona - Compacto */}
                <div className="bg-[#1a2744]/50 border border-[#243556] rounded-xl p-4">
                  <p className="text-white text-sm font-bold mb-3">Como funciona:</p>
                  <div className="space-y-2">
                    {[
                      'Digite seu nome e clique no botão',
                      'O técnico liga a localização no app',
                      'Você vê no mapa onde ele está'
                    ].map((text, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#6bb8e8] flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">{i + 1}</span>
                        </div>
                        <p className="text-white/80 text-sm">{text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status de localização */}
                {customerLocation && (
                  <div className="rounded-xl p-3 border bg-[#25d366]/10 border-[#25d366]/30">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#25d366] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-[#25d366] text-sm font-medium">
                        Localização: {neighborhoodName || 'Recife'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Botão iniciar */}
                <button
                  onClick={handleStartTracking}
                  disabled={!name.trim()}
                  className="w-full py-4 bg-[#128c4a] hover:bg-[#0d6e3a] disabled:bg-[#3d4a5c] disabled:text-[#9db5c7] text-white text-lg font-bold rounded-xl transition-colors disabled:cursor-not-allowed"
                >
                  {name.trim() ? 'INICIAR AGORA' : 'Digite seu nome'}
                </button>
              </div>
            )}

            {/* Step 2: Tracking */}
            {step === 'tracking' && (
              <div className="space-y-3">
                {/* Card de localização do cliente */}
                {neighborhoodName && (
                  <div className="bg-gradient-to-r from-[#ff6b35]/10 to-[#f59e0b]/10 border border-[#ff6b35]/30 rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[#ff6b35] animate-pulse">🚨</span>
                      <span className="text-sm font-bold text-[#ff6b35]">URGENTE</span>
                    </div>
                    <p className="text-sm text-white mt-1">
                      Estamos indo até você em <span className="font-bold text-[#6bb8e8]">{neighborhoodName}</span>
                    </p>
                  </div>
                )}

                {/* Status do técnico */}
                <div className={`p-3 rounded-xl border-2 ${
                  technicianLocation?.online
                    ? 'bg-[#25d366]/10 border-[#25d366]'
                    : 'bg-[#f59e0b]/10 border-[#f59e0b]'
                }`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      technicianLocation?.online ? 'bg-[#25d366]' : 'bg-[#f59e0b] animate-pulse'
                    }`} />
                    <span className={`text-base font-bold ${
                      technicianLocation?.online ? 'text-[#25d366]' : 'text-[#f59e0b]'
                    }`}>
                      {technicianLocation?.online ? 'TÉCNICO A CAMINHO!' : 'AGUARDANDO TÉCNICO'}
                    </span>
                  </div>
                  <p className={`mt-1 text-sm ${
                    technicianLocation?.online ? 'text-[#25d366]/80' : 'text-[#f59e0b]/80'
                  }`}>
                    {technicianLocation?.online
                      ? 'Acompanhe a localização no mapa'
                      : 'O técnico precisa ligar o app'}
                  </p>
                </div>

                {/* Mapa - Altura fixa */}
                <div className="relative h-36 rounded-lg bg-[#0a0f1a] border border-[#243556] overflow-hidden">
                  {/* Grid */}
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'linear-gradient(#9dd1f1 1px, transparent 1px), linear-gradient(90deg, #9dd1f1 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }} />

                  {/* Radar sweep */}
                  {technicianLocation?.online && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `conic-gradient(from ${radarAngle}deg at 50% 50%, transparent 0deg, rgba(37, 211, 102, 0.08) 30deg, transparent 60deg)`,
                      }}
                    />
                  )}

                  {/* Map shape */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice">
                    <path d="M0,0 L200,0 L200,120 L0,120 Z" fill="#0a0f1a" />
                    <path
                      d="M20,30 Q40,20 60,35 L80,25 Q100,15 120,30 L140,40 Q160,35 180,50 L185,80 Q170,90 150,85 L130,95 Q110,100 90,90 L70,100 Q50,105 30,95 L15,70 Q10,50 20,30 Z"
                      fill="#1a2744"
                      stroke="#243556"
                      strokeWidth="1"
                    />
                  </svg>

                  {/* Customer marker */}
                  {customerLocation && (
                    <div
                      className="absolute z-20"
                      style={{
                        top: `${(customerLocation.mapY / 120) * 100}%`,
                        left: `${(customerLocation.mapX / 200) * 100}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <div className="relative">
                        <div className="absolute w-6 h-6 -top-1 -left-1 bg-[#ff6b35]/20 rounded-full animate-ping" />
                        <div className="w-4 h-4 bg-[#ff6b35] rounded-full border-2 border-white shadow-lg" />
                      </div>
                    </div>
                  )}

                  {/* Technician marker */}
                  {technicianLocation?.online && (
                    <div
                      className="absolute z-20 transition-all duration-1000 ease-out"
                      style={{
                        top: `${(technicianLocation.mapY / 120) * 100}%`,
                        left: `${(technicianLocation.mapX / 200) * 100}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <div className="relative">
                        <div className="absolute w-8 h-8 -top-1.5 -left-1.5 bg-[#25d366]/20 rounded-full animate-ping" />
                        <div className="w-5 h-5 bg-[#25d366] rounded-full border-2 border-white shadow-lg" />
                      </div>
                    </div>
                  )}

                  {/* Connection line */}
                  {technicianLocation?.online && customerLocation && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                      <defs>
                        <linearGradient id="routeLine2" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#25d366" />
                          <stop offset="100%" stopColor="#ff6b35" />
                        </linearGradient>
                      </defs>
                      <line
                        x1={`${(technicianLocation.mapX / 200) * 100}%`}
                        y1={`${(technicianLocation.mapY / 120) * 100}%`}
                        x2={`${(customerLocation.mapX / 200) * 100}%`}
                        y2={`${(customerLocation.mapY / 120) * 100}%`}
                        stroke="url(#routeLine2)"
                        strokeWidth="2"
                        strokeDasharray="6,4"
                        opacity="0.6"
                      />
                    </svg>
                  )}

                  {/* Legend */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-3 bg-[#0a0f1a]/80 rounded px-2 py-1">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-[#ff6b35] rounded-full" />
                      <span className="text-[9px] font-mono text-[#9dd1f1]/60">Você</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-[#25d366] rounded-full" />
                      <span className="text-[9px] font-mono text-[#9dd1f1]/60">Técnico</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                {technicianLocation?.online && distance !== null && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#1a2744] rounded-xl p-3 text-center border border-[#6bb8e8]/30">
                      <p className="text-2xl font-black text-[#6bb8e8]">{formatDistance(distance)}</p>
                      <p className="text-xs text-white/70">de distância</p>
                    </div>
                    <div className="bg-[#1a2744] rounded-xl p-3 text-center border border-[#25d366]/30">
                      <p className="text-2xl font-black text-[#25d366]">{estimateArrival(distance)}</p>
                      <p className="text-xs text-white/70">para chegar</p>
                    </div>
                  </div>
                )}

                {/* Dica quando técnico offline */}
                {!technicianLocation?.online && (
                  <div className="bg-[#1a2744]/50 rounded-xl p-3 border border-[#243556]">
                    <p className="text-white/80 text-sm text-center">
                      Fale com o técnico pelo WhatsApp
                    </p>
                  </div>
                )}

                {/* WhatsApp button */}
                <button
                  onClick={openWhatsApp}
                  className="w-full py-4 bg-[#128c4a] hover:bg-[#0d6e3a] text-white text-lg font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WHATSAPP
                </button>

                {/* Encerrar sessão */}
                <button
                  onClick={handleEndSession}
                  className="w-full py-2 text-white/40 hover:text-white/60 text-sm transition-colors"
                >
                  Encerrar atendimento
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
