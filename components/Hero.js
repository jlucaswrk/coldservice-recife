import { useState, useEffect, useRef } from "react";
import { siteConfig, googleReviews } from "@/lib/content";
import { buildWhatsAppUrl } from "@/lib/dtr";


// Bairros de Recife aproximados por coordenadas
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
  { name: "São José", lat: -8.0712, lng: -34.8823, mapX: 100, mapY: 58 },
  { name: "Santo Amaro", lat: -8.0534, lng: -34.8801, mapX: 108, mapY: 48 },
  { name: "Imbiribeira", lat: -8.1089, lng: -34.9156, mapX: 60, mapY: 78 },
  { name: "Pina", lat: -8.0934, lng: -34.8834, mapX: 105, mapY: 72 },
  { name: "Brasília Teimosa", lat: -8.0856, lng: -34.8689, mapX: 125, mapY: 68 },
];

// Função ULTRA PRECISA para obter localização estilo Uber/iFood
function getHighAccuracyPosition(options = {}) {
  const {
    targetAccuracy = 10,     // 10 metros - precisão estilo Uber
    goodEnoughAccuracy = 15, // Aceita após estabilizar
    minStableReadings = 3,   // Mínimo de leituras estáveis
    timeout = 60000          // 60 segundos máximo
  } = options;

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    let watchId = null;
    let bestPosition = null;
    let lastPositions = [];

    const cleanup = () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      clearTimeout(timeoutId);
    };

    // Verifica se a posição estabilizou
    const isStable = () => {
      if (lastPositions.length < minStableReadings) return false;
      const recentAccuracies = lastPositions.slice(-minStableReadings).map(p => p.coords.accuracy);
      const avgAccuracy = recentAccuracies.reduce((a, b) => a + b, 0) / recentAccuracies.length;
      const variance = recentAccuracies.reduce((sum, acc) => sum + Math.pow(acc - avgAccuracy, 2), 0) / recentAccuracies.length;
      return variance < 25 && avgAccuracy <= goodEnoughAccuracy;
    };

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const accuracy = position.coords.accuracy;
        lastPositions.push(position);

        if (!bestPosition || accuracy < bestPosition.coords.accuracy) {
          bestPosition = position;
        }

        // Para quando atingir precisão alvo ou estabilizar
        if (accuracy <= targetAccuracy || isStable()) {
          cleanup();
          resolve(bestPosition);
        }
      },
      (error) => {
        cleanup();
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: timeout,
        maximumAge: 0  // NUNCA usa cache
      }
    );

    const timeoutId = setTimeout(() => {
      cleanup();
      if (bestPosition) {
        resolve(bestPosition);
      } else {
        reject(new Error('Timeout'));
      }
    }, timeout);
  });
}

// Dicas de cuidado com geladeira
const FRIDGE_TIPS = [
  "Deixe espaço de 10cm atrás da geladeira para ventilação adequada",
  "Limpe a borracha da porta com água e sabão neutro a cada 15 dias",
  "Nunca coloque alimentos quentes direto na geladeira",
  "Descongele o freezer quando o gelo passar de 1cm de espessura",
  "Mantenha a geladeira longe do fogão e de áreas com sol direto",
  "Verifique se a porta fecha bem — papel preso não deve cair",
  "Ajuste a temperatura entre 3°C e 5°C para conservar melhor",
  "Não bloqueie as saídas de ar internas com alimentos",
  "Limpe a serpentina traseira a cada 6 meses para maior eficiência",
  "Evite abrir a porta muitas vezes — isso força o motor",
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

// Geocodificação reversa usando OpenStreetMap Nominatim
async function reverseGeocode(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'pt-BR',
          'User-Agent': 'ColdServiceRecife/1.0'
        }
      }
    );
    const data = await response.json();

    if (data.address) {
      // Prioridade: bairro > suburb > city_district > town > city
      const neighborhood = data.address.suburb ||
                          data.address.neighbourhood ||
                          data.address.city_district ||
                          data.address.town ||
                          data.address.city ||
                          "Região Metropolitana";

      const city = data.address.city || data.address.town || data.address.municipality || "";

      return { neighborhood, city };
    }
  } catch (error) {
    // Falha silenciosa - usa fallback
  }

  return null;
}

export default function Hero({ content, onOpenAtendimento, onLocationUpdate }) {
  const { headline, subheadline, ctaText, urgencyBadge } = content.hero;

  const [userLocation, setUserLocation] = useState(null);
  const [neighborhood, setNeighborhood] = useState(null);
  const [locationStatus, setLocationStatus] = useState("loading"); // loading, ip-found, precise-found, asking-permission, denied, error
  const [currentTip, setCurrentTip] = useState(0);
  const [tipFading, setTipFading] = useState(false);
  const [showOnboard, setShowOnboard] = useState(false);
  const [onboardReady, setOnboardReady] = useState(false); // Para evitar SSR/crawlers
  const hasAskedPermission = useRef(false);

  // Marca como pronto para mostrar onboard apenas no client (crawlers não veem)
  useEffect(() => {
    // Delay para garantir que crawlers não capturem o modal
    const timer = setTimeout(() => {
      setOnboardReady(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Localização inicial - verifica permissão e decide estratégia
  useEffect(() => {
    async function initLocation() {
      // Fallback padrão caso todas as APIs falhem
      const useFallback = () => {
        const defaultNeighborhood = RECIFE_NEIGHBORHOODS.find(n => n.name === "Boa Vista");
        setUserLocation({ lat: -8.0623, lng: -34.8812, mapX: defaultNeighborhood.mapX, mapY: defaultNeighborhood.mapY });
        setNeighborhood("Recife");
        setLocationStatus("ip-found");
      };

      // Verifica se já tem permissão de GPS
      let permissionState = "prompt";
      if (navigator.permissions) {
        try {
          const result = await navigator.permissions.query({ name: "geolocation" });
          permissionState = result.state;
        } catch (e) {
          // Alguns navegadores não suportam
        }
      }

      // Se já tem permissão, vai direto para GPS (mais preciso)
      if (permissionState === "granted" && navigator.geolocation) {
        hasAskedPermission.current = true;
        try {
          const position = await getHighAccuracyPosition();
          const { latitude, longitude } = position.coords;
          const geoResult = await reverseGeocode(latitude, longitude);
          const nearest = findNearestNeighborhood(latitude, longitude);

          if (geoResult) {
            setUserLocation({ lat: latitude, lng: longitude, accuracy: position.coords.accuracy, mapX: nearest.mapX, mapY: nearest.mapY });
            setNeighborhood(geoResult.neighborhood);
          } else {
            setUserLocation({ lat: latitude, lng: longitude, accuracy: position.coords.accuracy, mapX: nearest.mapX, mapY: nearest.mapY });
            setNeighborhood(nearest.name);
          }
          setLocationStatus("precise-found");
        } catch (error) {
          // Se falhar, usa IP como fallback
          getIPLocation();
        }
        return;
      }

      // Sem permissão prévia - usa IP primeiro
      getIPLocation();

      async function getIPLocation() {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);

          const response = await fetch("https://ipapi.co/json/", {
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          const data = await response.json();

          if (data.latitude && data.longitude) {
            const nearest = findNearestNeighborhood(data.latitude, data.longitude);

            // Usa o nome da cidade retornado pelo IP ou faz geocodificação reversa
            let locationName = data.city || nearest.name;

            // Se o IP retornou uma cidade genérica, tenta geocodificação para mais detalhes
            if (data.city && !data.city.includes("Recife")) {
              const geoResult = await reverseGeocode(data.latitude, data.longitude);
              if (geoResult) {
                locationName = geoResult.neighborhood;
              }
            }

            setUserLocation({ lat: data.latitude, lng: data.longitude, mapX: nearest.mapX, mapY: nearest.mapY });
            setNeighborhood(locationName);
            setLocationStatus("ip-found");
          } else {
            useFallback();
          }
        } catch (error) {
          useFallback();
        }
      }
    }

    initLocation();
  }, []);

  // Notificar parent sobre mudanças de localização
  useEffect(() => {
    if (userLocation && onLocationUpdate) {
      onLocationUpdate(userLocation);
    }
  }, [userLocation, onLocationUpdate]);

  // Browser Geolocation - pede permissão após ter o IP (apenas se ainda não pediu)
  useEffect(() => {
    if (locationStatus !== "ip-found" || hasAskedPermission.current) return;
    if (!navigator.geolocation) return;

    hasAskedPermission.current = true;

    async function requestPreciseLocation() {
      // Verifica o estado da permissão antes de pedir
      let permissionState = "prompt";

      if (navigator.permissions) {
        try {
          const result = await navigator.permissions.query({ name: "geolocation" });
          permissionState = result.state;
        } catch (e) {
          // Alguns navegadores não suportam permissions.query para geolocation
        }
      }

      // Se já foi negada ou concedida, não faz nada (já tratado no primeiro useEffect)
      if (permissionState === "denied" || permissionState === "granted") {
        return;
      }

      // Se é "prompt" (ainda não decidiu), mostra o onboard
      setShowOnboard(true);
      setLocationStatus("asking-permission");

      // Delay para o usuário ver o onboard antes do modal do navegador aparecer
      setTimeout(async () => {
        try {
          const position = await getHighAccuracyPosition();
          const { latitude, longitude } = position.coords;

          // Tenta geocodificação reversa para nome real do bairro
          const geoResult = await reverseGeocode(latitude, longitude);

          if (geoResult) {
            // Usa posição no mapa baseada no bairro mais próximo da lista (para o visual)
            const nearest = findNearestNeighborhood(latitude, longitude);
            setUserLocation({ lat: latitude, lng: longitude, accuracy: position.coords.accuracy, mapX: nearest.mapX, mapY: nearest.mapY });
            // Mostra o nome real do bairro
            setNeighborhood(geoResult.neighborhood);
          } else {
            // Fallback para o método antigo
            const nearest = findNearestNeighborhood(latitude, longitude);
            setUserLocation({ lat: latitude, lng: longitude, accuracy: position.coords.accuracy, mapX: nearest.mapX, mapY: nearest.mapY });
            setNeighborhood(nearest.name);
          }

          setLocationStatus("precise-found");
          setShowOnboard(false);
        } catch (error) {
          // Mantém a localização do IP e fecha o modal
          setLocationStatus("ip-found");
          setShowOnboard(false);
        }
      }, 1500);
    }

    requestPreciseLocation();
  }, [locationStatus]);

  // Rotating tips effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTipFading(true);
      setTimeout(() => {
        setCurrentTip((prev) => (prev + 1) % FRIDGE_TIPS.length);
        setTipFading(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-[#0d1526]">
      {/* Location Permission Onboard Modal - só renderiza no client após delay (SEO safe) */}
      {onboardReady && showOnboard && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <div className="relative bg-gradient-to-br from-[#1a2744] to-[#0d1526] border border-[#6bb8e8]/40 rounded-2xl p-6 shadow-2xl shadow-[#6bb8e8]/20 max-w-sm w-full animate-fade-up">
            {/* Ícone de localização */}
            <div className="flex justify-center mb-4">
              <div className="relative w-16 h-16 bg-gradient-to-br from-[#6bb8e8] to-[#4a9fd4] rounded-full flex items-center justify-center shadow-lg shadow-[#6bb8e8]/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>

            {/* Texto */}
            <div className="text-center mb-5">
              <h3 className="text-white font-bold text-xl mb-2">
                De onde você é?
              </h3>
              <p className="text-[#9dd1f1]/80 text-sm leading-relaxed">
                Compartilhe sua localização para encontrarmos o técnico mais perto de você.
              </p>
            </div>

            {/* Instrução */}
            <div className="flex items-center justify-center gap-2 bg-[#6bb8e8]/10 border border-[#6bb8e8]/20 rounded-xl px-4 py-3 mb-4">
              <div className="w-2 h-2 bg-[#6bb8e8] rounded-full animate-pulse" />
              <span className="text-[#9dd1f1] text-sm">
                Clique em "Permitir" no navegador
              </span>
            </div>

            {/* Botão Pular */}
            <button
              onClick={() => {
                setShowOnboard(false);
                setLocationStatus("ip-found");
              }}
              className="w-full text-center text-[#9dd1f1]/60 hover:text-[#9dd1f1] text-sm py-2 transition-colors"
            >
              Pular
            </button>
          </div>
        </div>
      )}

      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#6bb8e8]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#ff6b35]/10 rounded-full blur-3xl" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#9dd1f1 1px, transparent 1px), linear-gradient(90deg, #9dd1f1 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left animate-fade-up">
            {/* Urgency Badge */}
            <div className="inline-flex items-center gap-2 bg-[#25d366]/20 backdrop-blur-sm border border-[#25d366]/30 rounded-full px-3 py-1.5 mb-6">
              <span className="w-2 h-2 bg-[#25d366] rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-[#25d366]">{urgencyBadge || "Técnicos disponíveis agora"}</span>
            </div>

            {/* Headline */}
            <h1 className="heading-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-white mb-4">
              {headline.split(" ").map((word, i) => (
                <span key={i} className={i === 0 || word.toLowerCase() === "geladeira" ? "text-gradient-orange" : ""}>
                  {word}{" "}
                </span>
              ))}
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-[#9dd1f1]/80 mb-6 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {subheadline}
            </p>

            {/* CTAs */}
            {/* CTAs - WCAG AA Compliant (4.5:1+ contrast ratio) */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-6">
              <a
                href={`tel:${siteConfig.phoneClean}`}
                className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#c54a1c] to-[#a83d15] text-white px-5 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#c54a1c]/30 animate-pulse-glow"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="whitespace-nowrap">{siteConfig.phone}</span>
              </a>

              <a
                href={buildWhatsAppUrl(siteConfig.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 bg-[#128c4a] hover:bg-[#0d6e3a] text-white px-5 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#128c4a]/30"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="whitespace-nowrap">{ctaText || "Chamar no WhatsApp"}</span>
              </a>
            </div>

            {/* Google Reviews Badge */}
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1a2744] to-[#243556] border-2 border-[#0d1526] flex items-center justify-center text-[#9dd1f1] font-bold text-xs"
                  >
                    {["M", "J", "A", "C"][i]}
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-3.5 h-3.5 text-[#f59e0b]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="font-mono font-bold text-white text-sm">{googleReviews.rating}</span>
                </div>
                <span className="text-xs text-[#9dd1f1]/60">{googleReviews.totalReviews} avaliações no Google</span>
              </div>
            </div>
          </div>

          {/* Hero Visual - Operations Dashboard */}
          <div className="relative animate-slide-in-right mt-8 lg:mt-0">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#6bb8e8]/20 to-[#ff6b35]/20 rounded-3xl blur-2xl" />

              {/* Main Dashboard Card */}
              <div className="relative bg-gradient-to-br from-[#0a0f1a] to-[#131d35] rounded-2xl border border-[#243556] overflow-hidden">
                {/* Scanline effect */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(157, 209, 241, 0.5) 2px, rgba(157, 209, 241, 0.5) 4px)'
                }} />

                {/* Header Bar */}
                <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-[#243556] bg-[#0d1526]/80">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#ff6b35]" />
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#f59e0b]" />
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#25d366]" />
                    </div>
                    <span className="text-[8px] sm:text-[10px] font-mono text-[#9dd1f1]/60 uppercase tracking-widest">Central de Operações</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <div className="w-1.5 h-1.5 bg-[#25d366] rounded-full animate-pulse" />
                    <span className="text-[8px] sm:text-[10px] font-mono text-[#25d366]">LIVE</span>
                  </div>
                </div>

                {/* Map Section */}
                <div className="relative p-3 sm:p-4">
                  {/* Stylized Recife Map */}
                  <div className="relative h-36 sm:h-48 rounded-lg bg-[#0d1526] border border-[#243556]/50 overflow-hidden">
                    {/* Grid overlay */}
                    <div className="absolute inset-0 opacity-20" style={{
                      backgroundImage: 'linear-gradient(#9dd1f1 1px, transparent 1px), linear-gradient(90deg, #9dd1f1 1px, transparent 1px)',
                      backgroundSize: '20px 20px'
                    }} />

                    {/* Recife coastline shape (stylized) */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice">
                      {/* Water */}
                      <path d="M0,0 L200,0 L200,120 L0,120 Z" fill="#0a0f1a" />
                      {/* Land mass - stylized Recife */}
                      <path
                        d="M20,30 Q40,20 60,35 L80,25 Q100,15 120,30 L140,40 Q160,35 180,50 L185,80 Q170,90 150,85 L130,95 Q110,100 90,90 L70,100 Q50,105 30,95 L15,70 Q10,50 20,30 Z"
                        fill="#1a2744"
                        stroke="#243556"
                        strokeWidth="1"
                      />
                      {/* Rios/bridges */}
                      <path d="M60,35 Q70,60 60,85" stroke="#6bb8e8" strokeWidth="2" fill="none" opacity="0.3" />
                      <path d="M120,30 Q130,55 125,80" stroke="#6bb8e8" strokeWidth="2" fill="none" opacity="0.3" />
                    </svg>

                    {/* Technician markers with pulse */}
                    <div className="absolute flex items-center justify-center" style={{ top: '15%', left: '20%' }}>
                      <div className="absolute w-6 h-6 bg-[#25d366]/30 rounded-full animate-ping" />
                      <div className="relative w-2.5 h-2.5 bg-[#25d366] rounded-full border border-[#0d1526]" />
                    </div>
                    <div className="absolute flex items-center justify-center" style={{ top: '35%', left: '35%' }}>
                      <div className="absolute w-6 h-6 bg-[#25d366]/30 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                      <div className="relative w-2.5 h-2.5 bg-[#25d366] rounded-full border border-[#0d1526]" />
                    </div>
                    <div className="absolute flex items-center justify-center" style={{ top: '25%', left: '65%' }}>
                      <div className="absolute w-6 h-6 bg-[#f59e0b]/30 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
                      <div className="relative w-2.5 h-2.5 bg-[#f59e0b] rounded-full border border-[#0d1526]" />
                    </div>
                    <div className="absolute flex items-center justify-center" style={{ top: '60%', left: '25%' }}>
                      <div className="absolute w-6 h-6 bg-[#25d366]/30 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
                      <div className="relative w-2.5 h-2.5 bg-[#25d366] rounded-full border border-[#0d1526]" />
                    </div>

                    {/* USER LOCATION MARKER - "Você está aqui" */}
                    {userLocation && (
                      <div
                        className="absolute z-20 flex flex-col items-center"
                        style={{
                          top: `${(userLocation.mapY / 120) * 100}%`,
                          left: `${(userLocation.mapX / 200) * 100}%`,
                          transform: 'translate(-50%, -100%)'
                        }}
                      >
                        {/* Tooltip */}
                        <div className="relative mb-1 animate-fade-up">
                          <div className="bg-[#ff6b35] text-white text-[9px] font-bold px-2 py-1 rounded-md whitespace-nowrap shadow-lg">
                            📍 Você está aqui
                          </div>
                          {/* Arrow */}
                          <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#ff6b35]" />
                        </div>
                        {/* Pin */}
                        <div className="relative">
                          <div className="absolute w-10 h-10 -top-2 -left-2 bg-[#ff6b35]/20 rounded-full animate-ping" />
                          <div className="absolute w-6 h-6 -top-0.5 -left-0.5 bg-[#ff6b35]/40 rounded-full animate-pulse" />
                          <div className="relative w-4 h-4 bg-gradient-to-br from-[#ff6b35] to-[#e55a2b] rounded-full border-2 border-white shadow-lg" />
                        </div>
                      </div>
                    )}

                    {/* Legend */}
                    <div className="absolute bottom-2 left-2 flex items-center gap-2 bg-[#0a0f1a]/90 backdrop-blur-sm rounded px-2 py-1">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-[#ff6b35] rounded-full" />
                        <span className="text-[8px] font-mono text-white/80">Você</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-[#25d366] rounded-full" />
                        <span className="text-[8px] font-mono text-[#9dd1f1]/60">Técnicos</span>
                      </div>
                    </div>

                    {/* Loading state */}
                    {locationStatus === "loading" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#0a0f1a]/50 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-[#ff6b35] border-t-transparent rounded-full animate-spin" />
                          <span className="text-xs font-mono text-[#9dd1f1]">Localizando você...</span>
                        </div>
                      </div>
                    )}

                    {/* Precise location badge */}
                    {locationStatus === "precise-found" && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-[#25d366]/20 backdrop-blur-sm rounded px-2 py-1">
                        <svg className="w-3 h-3 text-[#25d366]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-[8px] font-mono text-[#25d366]">GPS Preciso</span>
                      </div>
                    )}
                  </div>

                  {/* Location Status + CTA - WCAG AA Compliant */}
                  <div className="mt-3">
                    {(locationStatus === "ip-found" || locationStatus === "precise-found" || locationStatus === "asking-permission") && neighborhood && onOpenAtendimento && (
                      <button
                        onClick={onOpenAtendimento}
                        className="group block w-full bg-gradient-to-r from-[#c54a1c] to-[#a83d15] hover:from-[#a83d15] hover:to-[#8f3412] rounded-xl p-2.5 sm:p-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#c54a1c]/20"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-base sm:text-xl">🚨</span>
                            </div>
                            <div className="text-left">
                              <p className="text-white font-bold text-xs sm:text-sm">
                                Atendimento Urgente{neighborhood ? ` para ${neighborhood}` : ''}
                              </p>
                              <p className="text-white/80 text-[10px] sm:text-xs">Acompanhe o técnico em tempo real</p>
                            </div>
                          </div>
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:translate-x-1 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    )}

                    {locationStatus === "error" && onOpenAtendimento && (
                      <button
                        onClick={onOpenAtendimento}
                        className="group block w-full bg-gradient-to-r from-[#c54a1c] to-[#a83d15] hover:from-[#a83d15] hover:to-[#8f3412] rounded-xl p-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#c54a1c]/20"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                              <span className="text-xl">🚨</span>
                            </div>
                            <div className="text-left">
                              <p className="text-white font-bold text-sm">Atendimento Urgente</p>
                              <p className="text-white/80 text-xs">Acompanhe o técnico em tempo real</p>
                            </div>
                          </div>
                          <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    )}

                    {locationStatus === "loading" && (
                      <div className="w-full bg-[#1a2744]/50 rounded-xl p-3 border border-[#243556]/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#243556] rounded-lg flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-[#9dd1f1] border-t-transparent rounded-full animate-spin" />
                          </div>
                          <div>
                            <p className="text-white/60 font-medium text-sm">Detectando sua localização...</p>
                            <p className="text-[#9dd1f1]/40 text-xs">Para enviar um técnico mais rápido</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Rotating Tips - Oculto no mobile */}
              <div className="mt-4 hidden lg:block">
                <div className="bg-[#1a2744]/60 backdrop-blur-sm rounded-xl px-4 py-3 border border-[#243556]/50">
                  <div className="flex items-center gap-3">
                    {/* Lightbulb icon */}
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-lg flex items-center justify-center shadow-lg shadow-[#f59e0b]/20">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                      </svg>
                    </div>
                    {/* Tip text */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-mono text-[#f59e0b] uppercase tracking-wider mb-0.5">Dica ColdService</p>
                      <p
                        className={`text-sm text-[#9dd1f1]/90 leading-snug transition-opacity duration-300 ${tipFading ? 'opacity-0' : 'opacity-100'}`}
                      >
                        {FRIDGE_TIPS[currentTip]}
                      </p>
                    </div>
                  </div>
                  {/* Progress dots */}
                  <div className="flex items-center justify-center gap-1 mt-2">
                    {FRIDGE_TIPS.map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 h-1 rounded-full transition-all duration-300 ${i === currentTip ? 'bg-[#f59e0b] w-3' : 'bg-[#243556]'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-12 md:h-16" viewBox="0 0 1440 96" fill="none" preserveAspectRatio="none">
          <path d="M0 96L60 85.3C120 74.7 240 53.3 360 48C480 42.7 600 53.3 720 58.7C840 64 960 64 1080 58.7C1200 53.3 1320 42.7 1380 37.3L1440 32V96H1380C1320 96 1200 96 1080 96C960 96 840 96 720 96C600 96 480 96 360 96C240 96 120 96 60 96H0Z" fill="#f8f9fa"/>
        </svg>
      </div>
    </section>
  );
}
