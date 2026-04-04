import React, { useState, useEffect } from 'react';
import { getActiveAds } from '../../api/anuncios_api';
import { useLatagerAdTracker } from '../../sdk/LatagerAdsSDK';
import { ExternalLink } from 'lucide-react';

const AdContainer = ({ sourceApp = 'latager_codigos' }) => {
    const [ads, setAds] = useState([]);
    const [currentAdIndex, setCurrentAdIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const res = await getActiveAds();
                // Aleatoriedad al cargar
                const shuffled = [...res.data].sort(() => Math.random() - 0.5);
                setAds(shuffled);
            } catch (error) {
                console.error("Error fetching ads:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAds();
    }, []);

    // Rotación de anuncios cada 60 segundos
    useEffect(() => {
        if (ads.length > 1) {
            const interval = setInterval(() => {
                setCurrentAdIndex((prev) => (prev + 1) % ads.length);
            }, 60000);
            return () => clearInterval(interval);
        }
    }, [ads]);

    // Usamos el SDK núcleo abstrayendo IntersectionObserver y Visibility API
    const currentAdId = (!isLoading && ads.length > 0) ? ads[currentAdIndex]?.id : null;
    const { containerRef, registerClick } = useLatagerAdTracker(currentAdId, sourceApp);

    if (isLoading || ads.length === 0) return null;

    const currentAd = ads[currentAdIndex];

    const handleClick = () => {
        if (currentAd.link) {
            registerClick();
        }
    };

    return (
        <div ref={containerRef} style={{
            position: 'relative',
            width: '100%',
            maxWidth: '280px',
            margin: '0 auto',
            borderRadius: '16px',
            overflow: 'hidden',
            background: 'var(--bg-glass-layer)',
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: currentAd.link ? 'pointer' : 'default'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.7)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
        }}
        >
            <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                background: 'rgba(0,0,0,0.6)',
                padding: '4px 8px',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.7)',
                borderBottomRightRadius: '10px',
                zIndex: 2,
                fontWeight: 600,
                letterSpacing: '1px'
            }}>
                PUBLICIDAD
            </div>

            <a
                href={currentAd.link || '#'}
                target={currentAd.link ? "_blank" : "_self"}
                rel="noopener noreferrer"
                onClick={handleClick}
                style={{ display: 'block', textDecoration: 'none' }}
            >
                {/* paddingTop: 150% hace la imagen vertical estilo banner 2:3 en lugar de cuadrada 1:1 */}
                <div style={{ position: 'relative', width: '100%', paddingTop: '150%', background: '#0a0a0a', display: 'flex', justifyContent: 'center' }}>
                    <img
                        src={currentAd.imagen.startsWith('http')
                            ? currentAd.imagen
                            : `https://cesbaut33.pythonanywhere.com${currentAd.imagen}`}
                        alt="Latager Ad"
                        style={{
                            position: 'absolute',
                            top: 0, left: 0,
                            width: '100%', height: '100%',
                            objectFit: 'contain', /* contain para mostrar la imagen completa al centro si no es misma escala */
                            backgroundColor: '#0a0a0a'
                        }}
                    />
                    {currentAd.link && (
                        <div style={{
                            position: 'absolute',
                            bottom: 0, left: 0, right: 0,
                            padding: '16px 12px',
                            background: 'linear-gradient(to top, rgba(0,0,0,0.95), transparent)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            color: 'white',
                            fontSize: '15px',
                            fontWeight: 700,
                            opacity: 0.95
                        }}>
                            <ExternalLink size={18} />
                            <span>Visitar</span>
                        </div>
                    )}
                </div>
            </a>
        </div>
    );
};

export default AdContainer;
