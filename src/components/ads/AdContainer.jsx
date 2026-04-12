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
            borderRadius: '24px',
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease',
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
                <div className="ad-image-wrapper">
                    <img
                        src={currentAd.imagen.startsWith('http')
                            ? currentAd.imagen
                            : `https://cesbaut33.pythonanywhere.com${currentAd.imagen}`}
                        alt="Latager Ad"
                        style={{
                            position: 'absolute',
                            top: 0, left: 0,
                            width: '100%', height: '100%',
                            objectFit: 'contain',
                            backgroundColor: '#0a0a0a'
                        }}
                    />
                    {currentAd.link && (
                        <div className="ad-overlay">
                            {currentAd.descripcion && (
                                <p className="ad-description">{currentAd.descripcion}</p>
                            )}
                            <div className="ad-visit-action">
                                <ExternalLink size={18} />
                                <span>Visitar</span>
                            </div>
                        </div>
                    )}
                </div>
            </a>

            <style>{`
                .ad-image-wrapper {
                    position: relative;
                    width: 100%;
                    padding-top: 150%;
                    background: #000;
                    overflow: hidden;
                }
                .ad-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.7);
                    color: white;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    text-align: center;
                    opacity: 0;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(4px);
                    z-index: 5;
                }
                .ad-image-wrapper:hover .ad-overlay {
                    opacity: 1;
                }
                .ad-description {
                    font-size: 0.85rem;
                    line-height: 1.4;
                    margin-bottom: 15px;
                    font-weight: 500;
                }
                .ad-visit-action {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 800;
                    font-size: 0.95rem;
                    background: var(--accent-primary, #0071e3);
                    padding: 8px 16px;
                    border-radius: 12px;
                    color: black;
                }
            `}</style>
        </div>
    );
};

export default AdContainer;
