import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook de Geolocalização ULTRA PRECISA
 *
 * Usa Fused Location Provider nativo via Capacitor quando disponível,
 * com fallback inteligente para Web Geolocation API.
 *
 * Precisão esperada:
 * - Capacitor (Android): 3-5m (Fused Location Provider)
 * - Web com GPS: 10-30m
 * - Web com WiFi/Cell: 50-100m
 */

// Importação dinâmica do Capacitor (só carrega se disponível)
let Geolocation = null;
let Capacitor = null;

async function loadCapacitor() {
  try {
    const capacitorCore = await import('@capacitor/core');
    const capacitorGeo = await import('@capacitor/geolocation');
    Capacitor = capacitorCore.Capacitor;
    Geolocation = capacitorGeo.Geolocation;
    return true;
  } catch (e) {
    // Capacitor não disponível (ambiente web puro)
    return false;
  }
}

export function useNativeGeolocation(options = {}) {
  const {
    targetAccuracy = 10,        // 10m - precisão alvo
    goodEnoughAccuracy = 15,    // 15m - aceita após estabilizar
    minStableReadings = 3,      // leituras estáveis necessárias
    timeout = 60000,            // 60s máximo
    enableHighAccuracy = true,
    onAccuracyUpdate = null,    // callback para atualizar UI
  } = options;

  const [location, setLocation] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [source, setSource] = useState(null); // 'native' | 'web' | 'ip'

  const watchIdRef = useRef(null);
  const bestPositionRef = useRef(null);
  const positionsRef = useRef([]);
  const isNativeRef = useRef(false);

  // Verifica se a posição estabilizou
  const isStable = useCallback(() => {
    const positions = positionsRef.current;
    if (positions.length < minStableReadings) return false;

    const recent = positions.slice(-minStableReadings);
    const accuracies = recent.map(p => p.accuracy);
    const avg = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
    const variance = accuracies.reduce((sum, acc) => sum + Math.pow(acc - avg, 2), 0) / accuracies.length;

    return variance < 25 && avg <= goodEnoughAccuracy;
  }, [minStableReadings, goodEnoughAccuracy]);

  // Atualiza a melhor posição
  const updatePosition = useCallback((coords, isFinal = false) => {
    const position = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      accuracy: coords.accuracy,
      altitude: coords.altitude,
      altitudeAccuracy: coords.altitudeAccuracy,
      heading: coords.heading,
      speed: coords.speed,
      timestamp: Date.now(),
    };

    positionsRef.current.push(position);

    // Guarda a melhor posição
    if (!bestPositionRef.current || coords.accuracy < bestPositionRef.current.accuracy) {
      bestPositionRef.current = position;
    }

    setLocation(bestPositionRef.current);
    setAccuracy(Math.round(bestPositionRef.current.accuracy));

    if (onAccuracyUpdate) {
      onAccuracyUpdate(Math.round(bestPositionRef.current.accuracy), isRefining);
    }

    if (isFinal) {
      setIsRefining(false);
      setIsLoading(false);
    }

    return position;
  }, [onAccuracyUpdate, isRefining]);

  // Para o watch
  const stopWatch = useCallback(async () => {
    if (watchIdRef.current !== null) {
      if (isNativeRef.current && Geolocation) {
        await Geolocation.clearWatch({ id: watchIdRef.current });
      } else if (navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      watchIdRef.current = null;
    }
  }, []);

  // Inicia a captura de localização com Capacitor nativo
  const startNativeWatch = useCallback(async () => {
    try {
      // Solicita permissão
      const permission = await Geolocation.requestPermissions();
      if (permission.location !== 'granted') {
        throw new Error('Permissão de localização negada');
      }

      setSource('native');
      setIsRefining(true);

      const timeoutId = setTimeout(async () => {
        await stopWatch();
        if (bestPositionRef.current) {
          updatePosition(bestPositionRef.current, true);
        }
      }, timeout);

      watchIdRef.current = await Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
          timeout: timeout,
          maximumAge: 0,
        },
        (position, err) => {
          if (err) {
            console.error('Erro geolocation nativa:', err);
            return;
          }

          if (position) {
            const coords = position.coords;
            updatePosition(coords);

            // Condições de parada
            if (coords.accuracy <= targetAccuracy || isStable()) {
              clearTimeout(timeoutId);
              stopWatch();
              updatePosition(bestPositionRef.current, true);
            }
          }
        }
      );
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      setIsRefining(false);
      throw err;
    }
  }, [targetAccuracy, timeout, updatePosition, isStable, stopWatch]);

  // Inicia a captura com Web Geolocation API (fallback)
  const startWebWatch = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocalização não suportada');
      setIsLoading(false);
      return;
    }

    setSource('web');
    setIsRefining(true);

    const timeoutId = setTimeout(() => {
      stopWatch();
      if (bestPositionRef.current) {
        updatePosition(bestPositionRef.current, true);
      }
    }, timeout);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const coords = position.coords;
        updatePosition(coords);

        if (coords.accuracy <= targetAccuracy || isStable()) {
          clearTimeout(timeoutId);
          stopWatch();
          updatePosition(bestPositionRef.current, true);
        }
      },
      (err) => {
        clearTimeout(timeoutId);
        setError(err.message);
        setIsLoading(false);
        setIsRefining(false);

        // Fallback para IP
        fetchIPLocation();
      },
      {
        enableHighAccuracy: true,
        timeout: timeout,
        maximumAge: 0,
      }
    );
  }, [targetAccuracy, timeout, updatePosition, isStable, stopWatch]);

  // Fallback para localização via IP
  const fetchIPLocation = useCallback(async () => {
    try {
      setSource('ip');
      const response = await fetch('https://ipapi.co/json/', {
        signal: AbortSignal.timeout(5000),
      });
      const data = await response.json();

      if (data.latitude && data.longitude) {
        setLocation({
          latitude: data.latitude,
          longitude: data.longitude,
          accuracy: 5000, // ~5km para IP
          isApproximate: true,
        });
        setAccuracy(null);
      }
    } catch (e) {
      // Fallback para Recife
      setLocation({
        latitude: -8.0476,
        longitude: -34.8770,
        accuracy: 10000,
        isApproximate: true,
      });
    } finally {
      setIsLoading(false);
      setIsRefining(false);
    }
  }, []);

  // Função principal para obter localização
  const getLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    bestPositionRef.current = null;
    positionsRef.current = [];

    // Tenta carregar Capacitor
    const hasCapacitor = await loadCapacitor();
    isNativeRef.current = hasCapacitor && Capacitor?.isNativePlatform();

    if (isNativeRef.current) {
      console.log('Usando Fused Location Provider nativo');
      try {
        await startNativeWatch();
      } catch (e) {
        console.log('Fallback para Web Geolocation');
        startWebWatch();
      }
    } else {
      console.log('Usando Web Geolocation API');
      startWebWatch();
    }
  }, [startNativeWatch, startWebWatch]);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      stopWatch();
    };
  }, [stopWatch]);

  return {
    location,
    accuracy,
    error,
    isLoading,
    isRefining,
    source,
    getLocation,
    stopWatch,
    isNative: isNativeRef.current,
  };
}

export default useNativeGeolocation;
