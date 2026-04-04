import axios from 'axios';

const isProd = window.location.hostname.includes('latager.com');
const API_BASE_URL = import.meta.env.VITE_API_URL || (isProd ? 'https://cesbaut33.pythonanywhere.com' : 'http://localhost:8000');

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const getActiveAds = () => {
    return api.get('api/anuncios/activos/');
};

export const trackImpression = (data) => {
    return api.post('api/anuncios/track-impression/', data).catch(()=>{});
};

export const trackClick = (adId, sourceApp = 'latager_codigos') => {
    return api.post('api/pub/anuncios/track-click/', { ad_id: adId, source_app: sourceApp }).catch(()=>{});
};

export const updateImpressionDuration = (impresionId, durationMs) => {
    return api.post('api/pub/anuncios/update-duration/', { impresion_id: impresionId, duration_ms: durationMs }).catch(()=>{});
};
