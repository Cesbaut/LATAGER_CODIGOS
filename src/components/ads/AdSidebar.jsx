import React, { useState, useEffect, useRef } from 'react';
import { getActiveAds } from '../../api/anuncios_api';
import { useLatagerAdTracker } from '../../sdk/LatagerAdsSDK';
import { ExternalLink } from 'lucide-react';

const SingleAd = ({ ad, sourceApp }) => {
    const { containerRef, registerClick } = useLatagerAdTracker(ad.id, sourceApp);

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
            cursor: ad.link ? 'pointer' : 'default'
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
                href={ad.link || '#'}
                target={ad.link ? "_blank" : "_self"}
                rel="noopener noreferrer"
                onClick={() => { if (ad.link) registerClick(); }}
                style={{ display: 'block', textDecoration: 'none' }}
            >
                <div style={{ position: 'relative', width: '100%', paddingTop: '150%', background: '#0a0a0a', display: 'flex', justifyContent: 'center' }}>
                    <img
                        src={ad.imagen.startsWith('http')
                            ? ad.imagen
                            : `https://cesbaut33.pythonanywhere.com${ad.imagen}`}
                        alt="Latager Ad"
                        style={{
                            position: 'absolute',
                            top: 0, left: 0,
                            width: '100%', height: '100%',
                            objectFit: 'contain',
                            backgroundColor: '#0a0a0a'
                        }}
                    />
                    {ad.link && (
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

export default function AdSidebar({ sourceApp = 'latager_codigos' }) {
    const [ads, setAds] = useState([]);
    const [visibleCount, setVisibleCount] = useState(1); // Mínimo 1

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const res = await getActiveAds();
                // Barajear anuncios una sola vez para toda la barra lateral
                const shuffled = [...res.data].sort(() => Math.random() - 0.5);
                setAds(shuffled);
            } catch (error) {
                console.error("Error fetching ads:", error);
            }
        };
        fetchAds();
    }, []);

    // Calcular cuántos anuncios caben en base a la altura del contenido central
    useEffect(() => {
        const calculateAdsCount = () => {
            const centerContent = document.getElementById('center-content-column');
            if (centerContent) {
                // Obtenemos la altura actual física de la información del comedor
                const contentHeight = centerContent.getBoundingClientRect().height;
                // Cada anuncio mide aprox 420px de alto + 40px de espacio = 460px
                const adHeight = 460;
                // Calculamos cuántos caben enteros sin exceder. Máximo igual al número total de anuncios disponibles.
                const count = Math.max(1, Math.floor(contentHeight / adHeight));
                setVisibleCount(count);
            }
        };

        // Escuchar por cambios de tamaño en el contenido central (si se llena la lista de espera, etc)
        const centerContent = document.getElementById('center-content-column');
        if (!centerContent) return;
        
        // Medir inicialmente
        calculateAdsCount();

        const observer = new ResizeObserver(() => {
            calculateAdsCount();
        });
        observer.observe(centerContent);

        return () => observer.disconnect();
    }, [ads]);

    if (ads.length === 0) return null;

    // Solo mandamos al render los anuncios que caben visualmente y que NO se repitan
    const adsToRender = ads.slice(0, visibleCount);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', width: '280px' }} className="desktop-ad">
            {adsToRender.map((ad) => (
                <SingleAd key={ad.id} ad={ad} sourceApp={sourceApp} />
            ))}
        </div>
    );
}
