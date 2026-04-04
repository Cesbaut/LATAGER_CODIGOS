import { useEffect, useRef } from 'react';
import { trackImpression, updateImpressionDuration, trackClick } from '../api/anuncios_api';

/**
 * Módulo Core del SDK de Latager Ads (LatagerAdsSDK)
 * Encapsula la complejidad del rastreo de impactos, cruce de atención y clicks.
 * Listo para ser extraído a un paquete NPM en el futuro para publishers externos.
 * 
 * @param {number|string} currentAdId - El ID del anuncio activo.
 * @param {string} sourceApp - Etiqueta de procedencia de la app cliente.
 * @returns {Object} { containerRef, registerClick } - Las herramientas necesarias para integrarlo visualmente.
 */
export function useLatagerAdTracker(currentAdId, sourceApp = 'latager_codigos') {
    const containerRef = useRef(null);
    const timeoutRef = useRef(null);
    const loggedRef = useRef(false);
    const impIdRef = useRef(null);
    const activeStartRef = useRef(null);
    const accumulatedTimeRef = useRef(0);
    const isIntersectingRef = useRef(false);

    // Reinicio seguro del tracker cuando el anuncio subyacente cambia (rotación)
    useEffect(() => {
        if (impIdRef.current && activeStartRef.current) {
            const finalDuration = accumulatedTimeRef.current + (Date.now() - activeStartRef.current);
            updateImpressionDuration(impIdRef.current, finalDuration);
        }
        loggedRef.current = false;
        impIdRef.current = null;
        activeStartRef.current = null;
        accumulatedTimeRef.current = 0;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }, [currentAdId]);

    // Loop de Sincronización en Vivo (Heartbeat para tiempos estadísticos)
    useEffect(() => {
        const pingInterval = setInterval(() => {
            if (loggedRef.current && impIdRef.current && activeStartRef.current) {
                const currentSessionDur = Date.now() - activeStartRef.current;
                updateImpressionDuration(impIdRef.current, accumulatedTimeRef.current + currentSessionDur);
            }
        }, 2000);
        return () => clearInterval(pingInterval);
    }, []);

    // Monitoreo Óptico y Detección del Comportamiento del Sistema (Visibility API)
    useEffect(() => {
        const el = containerRef.current;
        if (!el || !currentAdId) return;

        const handlePause = () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (loggedRef.current && activeStartRef.current && impIdRef.current) {
                const sessionDur = Date.now() - activeStartRef.current;
                accumulatedTimeRef.current += sessionDur;
                updateImpressionDuration(impIdRef.current, accumulatedTimeRef.current);
                activeStartRef.current = null;
            }
        };

        const handleResume = () => {
            if (isIntersectingRef.current && !document.hidden) {
                if (!loggedRef.current) {
                    activeStartRef.current = Date.now();
                    timeoutRef.current = setTimeout(async () => {
                        try {
                            const res = await trackImpression({
                                ad_id: currentAdId,
                                source_app: sourceApp,
                                duration_ms: 1000,
                                clicked: false
                            });
                            if (res && res.data && res.data.impresion_id) {
                                impIdRef.current = res.data.impresion_id;
                            }
                        } catch (e) {}
                        loggedRef.current = true;
                    }, 1000);
                } else if (!activeStartRef.current) {
                    activeStartRef.current = Date.now();
                }
            }
        };

        const obs = new IntersectionObserver(([entry]) => {
            isIntersectingRef.current = entry.isIntersecting;
            if (entry.isIntersecting) {
                handleResume();
            } else {
                handlePause();
            }
        }, { threshold: 1.0 });

        obs.observe(el);

        const onVisibilityChange = () => {
            if (document.hidden) {
                handlePause();
            } else {
                handleResume();
            }
        };
        document.addEventListener('visibilitychange', onVisibilityChange);

        return () => {
            obs.disconnect();
            document.removeEventListener('visibilitychange', onVisibilityChange);
            handlePause();
        };
    }, [currentAdId, sourceApp]);

    // Utilería para registrar el Click asociada al mismo marco de información
    const registerClick = () => {
        if (currentAdId) {
            trackClick(currentAdId, sourceApp);
        }
    };

    return { containerRef, registerClick };
}
