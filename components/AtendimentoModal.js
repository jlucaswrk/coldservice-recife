import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * AtendimentoModal - Sistema de Atendimento Urgente
 * Design corporativo, limpo, focado em informação
 */

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

// Bairros para mapa
const NEIGHBORHOODS = [
  { name: "Boa Viagem", lat: -8.1234, lng: -34.9012, mapX: 75, mapY: 85 },
  { name: "Casa Forte", lat: -8.0345, lng: -34.9123, mapX: 55, mapY: 35 },
  { name: "Boa Vista", lat: -8.0623, lng: -34.8812, mapX: 100, mapY: 50 },
  { name: "Espinheiro", lat: -8.0412, lng: -34.8945, mapX: 85, mapY: 40 },
  { name: "Graças", lat: -8.0389, lng: -34.9034, mapX: 70, mapY: 38 },
  { name: "Madalena", lat: -8.0567, lng: -34.9089, mapX: 68, mapY: 52 },
  { name: "Imbiribeira", lat: -8.1089, lng: -34.9156, mapX: 60, mapY: 78 },
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

export default function AtendimentoModal({
  isOpen,
  isMinimized = false,
  onClose,
  onMinimize,
  whatsappNumber = '5581999999999',
  initialLocation = null
}) {
  const [step, setStep] = useState('identify'); // identify | tracking
  const [name, setName] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [customerLocation, setCustomerLocation] = useState(null);
  const [technicianLocation, setTechnicianLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [radarAngle, setRadarAngle] = useState(0);

  const inputRef = useRef(null);
  const pollIntervalRef = useRef(null);

  // Helper para minimizar/maximizar
  const setMinimized = (value) => {
    if (onMinimize) onMinimize(value);
  };

  // Obter localização do cliente
  useEffect(() => {
    if (!isOpen) return;

    if (initialLocation) {
      const nearest = findNearest(initialLocation.lat, initialLocation.lng);
      setCustomerLocation({
        latitude: initialLocation.lat,
        longitude: initialLocation.lng,
        mapX: nearest.mapX,
        mapY: nearest.mapY
      });
      return;
    }

    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nearest = findNearest(position.coords.latitude, position.coords.longitude);
        setCustomerLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          mapX: nearest.mapX,
          mapY: nearest.mapY
        });
      },
      () => {
        fetch('https://ipapi.co/json/')
          .then(res => res.json())
          .then(data => {
            if (data.latitude) {
              const nearest = findNearest(data.latitude, data.longitude);
              setCustomerLocation({
                latitude: data.latitude,
                longitude: data.longitude,
                mapX: nearest.mapX,
                mapY: nearest.mapY,
                isApproximate: true
              });
            }
          })
          .catch(() => {
            setCustomerLocation({
              latitude: -8.0476,
              longitude: -34.8770,
              mapX: 85,
              mapY: 50,
              isApproximate: true
            });
          });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [isOpen, initialLocation]);

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
        setSessionId(data.session.sessionId);
        setStep('tracking');
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

  // Reset ao fechar
  const handleClose = () => {
    setStep('identify');
    setName('');
    setSessionId(null);
    setTechnicianLocation(null);
    setMinimized(false);
    onClose();
  };

  if (!isOpen) return null;

  // Versão minimizada - maior e mais visível
  if (isMinimized) {
    return (
      <div
        className="fixed bottom-24 right-4 z-[100] cursor-pointer"
        onClick={() => setMinimized(false)}
      >
        <div className={`border-2 rounded-2xl p-5 shadow-2xl min-w-[260px] ${
          technicianLocation?.online
            ? 'bg-[#0d1526] border-[#25d366]'
            : 'bg-[#0d1526] border-[#f59e0b]'
        }`}>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center border-2 ${
                technicianLocation?.online
                  ? 'bg-[#25d366]/10 border-[#25d366]'
                  : 'bg-[#f59e0b]/10 border-[#f59e0b]'
              }`}>
                <svg className={`w-7 h-7 ${technicianLocation?.online ? 'text-[#25d366]' : 'text-[#f59e0b]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              {technicianLocation?.online && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#25d366] rounded-full border-2 border-[#0d1526] animate-pulse" />
              )}
            </div>
            <div className="flex-1">
              <p className={`text-lg font-bold ${technicianLocation?.online ? 'text-[#25d366]' : 'text-[#f59e0b]'}`}>
                {technicianLocation?.online ? 'A CAMINHO!' : 'AGUARDANDO'}
              </p>
              {distance !== null && technicianLocation?.online ? (
                <p className="text-white text-base font-medium">
                  {formatDistance(distance)} - {estimateArrival(distance)}
                </p>
              ) : (
                <p className="text-white/60 text-sm">
                  Toque para ver detalhes
                </p>
              )}
            </div>
            <svg className="w-6 h-6 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0a0f1a]/90 backdrop-blur-sm"
        onClick={step === 'tracking' ? () => setMinimized(true) : handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md">
        <div className="bg-[#0d1526] border border-[#243556] rounded-xl overflow-hidden shadow-2xl">

          {/* Header - mais visível e legível */}
          <div className="px-5 py-5 border-b border-[#243556] bg-[#1a2744]/50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white font-black text-xl">
                  {step === 'identify' ? 'Atendimento Urgente' : 'Acompanhamento'}
                </h2>
                <p className="text-white/60 text-base mt-1">
                  {step === 'identify' ? 'Veja onde o técnico está' : `Olá, ${name}!`}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#243556] hover:bg-[#34496d] transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Step 1: Identificação */}
            {step === 'identify' && (
              <div className="space-y-5">
                {/* Input de nome - maior e mais claro */}
                <div>
                  <label className="block text-base text-white mb-3 font-medium">
                    Qual é o seu nome?
                  </label>
                  <input
                    ref={inputRef}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Digite aqui seu nome"
                    className="w-full px-4 py-4 bg-[#1a2744] border-2 border-[#243556] rounded-xl text-white text-lg placeholder-[#9dd1f1]/40 focus:outline-none focus:border-[#6bb8e8] transition-colors"
                    onKeyDown={(e) => e.key === 'Enter' && handleStartTracking()}
                  />
                </div>

                {/* Informações sobre o sistema - mais legível */}
                <div className="bg-[#1a2744]/50 border border-[#243556] rounded-xl p-5 space-y-4">
                  <p className="text-white text-base font-bold">
                    Como funciona:
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#6bb8e8] flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-bold">1</span>
                      </div>
                      <p className="text-white/90 text-base pt-1">
                        Você coloca seu nome e clica no botão verde
                      </p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#6bb8e8] flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-bold">2</span>
                      </div>
                      <p className="text-white/90 text-base pt-1">
                        O técnico abre o aplicativo e liga a localização
                      </p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#6bb8e8] flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-bold">3</span>
                      </div>
                      <p className="text-white/90 text-base pt-1">
                        Você vê no mapa onde ele está e quando chega
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status de localização - mais visível */}
                {customerLocation && (
                  <div className="flex items-center gap-3 bg-[#25d366]/10 border border-[#25d366]/30 rounded-xl p-4">
                    <svg className="w-6 h-6 text-[#25d366]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[#25d366] text-base font-medium">
                      Sua localização foi encontrada {customerLocation.isApproximate && '(aproximada)'}
                    </span>
                  </div>
                )}

                {/* Botão iniciar - maior e mais claro */}
                <button
                  onClick={handleStartTracking}
                  disabled={!name.trim()}
                  className="w-full py-5 bg-[#25d366] hover:bg-[#1da851] disabled:bg-[#243556] disabled:text-[#9dd1f1]/40 text-white text-xl font-bold rounded-xl transition-colors disabled:cursor-not-allowed shadow-lg"
                >
                  {name.trim() ? 'INICIAR AGORA' : 'Digite seu nome acima'}
                </button>
              </div>
            )}

            {/* Step 2: Tracking */}
            {step === 'tracking' && (
              <div className="space-y-4">
                {/* Status do técnico - MUITO mais visível */}
                <div className={`p-4 rounded-xl border-2 ${
                  technicianLocation?.online
                    ? 'bg-[#25d366]/10 border-[#25d366]'
                    : 'bg-[#f59e0b]/10 border-[#f59e0b]'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${
                      technicianLocation?.online ? 'bg-[#25d366]' : 'bg-[#f59e0b] animate-pulse'
                    }`} />
                    <span className={`text-lg font-bold ${
                      technicianLocation?.online ? 'text-[#25d366]' : 'text-[#f59e0b]'
                    }`}>
                      {technicianLocation?.online
                        ? 'TÉCNICO A CAMINHO!'
                        : 'AGUARDANDO O TÉCNICO'}
                    </span>
                  </div>
                  <p className={`mt-2 text-base ${
                    technicianLocation?.online ? 'text-[#25d366]/80' : 'text-[#f59e0b]/80'
                  }`}>
                    {technicianLocation?.online
                      ? 'Você pode ver a localização dele no mapa abaixo'
                      : 'O técnico precisa abrir o app e ligar a localização'}
                  </p>
                </div>

                {/* Mapa */}
                <div className="relative h-44 rounded-lg bg-[#0a0f1a] border border-[#243556] overflow-hidden">
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

                {/* Stats - Maior e mais claro */}
                {technicianLocation?.online && distance !== null && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1a2744] rounded-xl p-4 text-center border-2 border-[#6bb8e8]/30">
                      <p className="text-3xl font-black text-[#6bb8e8]">{formatDistance(distance)}</p>
                      <p className="text-sm text-white/70 font-medium mt-1">de distância</p>
                    </div>
                    <div className="bg-[#1a2744] rounded-xl p-4 text-center border-2 border-[#25d366]/30">
                      <p className="text-3xl font-black text-[#25d366]">{estimateArrival(distance)}</p>
                      <p className="text-sm text-white/70 font-medium mt-1">para chegar</p>
                    </div>
                  </div>
                )}

                {/* Dica quando técnico não está online */}
                {!technicianLocation?.online && (
                  <div className="bg-[#1a2744]/50 rounded-xl p-4 border border-[#243556]">
                    <p className="text-white/80 text-base text-center">
                      Você pode ligar para o técnico pelo WhatsApp enquanto aguarda
                    </p>
                  </div>
                )}

                {/* WhatsApp button - Maior */}
                <button
                  onClick={openWhatsApp}
                  className="w-full py-5 bg-[#25d366] hover:bg-[#1da851] text-white text-xl font-bold rounded-xl transition-colors flex items-center justify-center gap-3 shadow-lg"
                >
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  FALAR NO WHATSAPP
                </button>

                {/* Minimize hint - Mais claro */}
                <p className="text-center text-white/40 text-sm">
                  Toque fora desta janela para minimizar
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
