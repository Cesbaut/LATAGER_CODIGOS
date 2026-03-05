import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Share2, Clock, Award, Info, ChevronRight, ShieldCheck, Zap } from 'lucide-react';
import axios from 'axios';

const COMEDOR_STYLES = [
    {
        name: 'Pabellon',
        slug: 'pabellon',
        desc: 'Comedor Central',
        icon: '🍽️',
        bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        accent: '#32ade6'
    },
    {
        name: 'Cafe Terraza',
        slug: 'cafe-terraza',
        desc: 'Vista Exterior',
        icon: '☕',
        bg: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
        accent: '#2adbd2'
    },
    {
        name: 'Cafesin',
        slug: 'cafesin',
        desc: 'Opciones Rápidas',
        icon: '🥗',
        bg: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b69 100%)',
        accent: '#af52de'
    },
    {
        name: 'Islas',
        slug: 'islas',
        desc: 'Zona Universitaria',
        icon: '🏝️',
        bg: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
        accent: '#34c759'
    },
];

export default function Home({ user }) {
    const [topDonors, setTopDonors] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/codigos/top-donors/')
            .then(res => setTopDonors(res.data))
            .catch(() => { });
    }, []);

    return (
        <div style={{ backgroundColor: '#000000', color: '#ffffff' }}>

            {/* Hero Section */}
            <section style={{
                padding: '120px 24px 80px',
                textAlign: 'center',
                maxWidth: '1000px',
                margin: '0 auto'
            }} className="animate-up">
                <span style={{
                    color: '#ffd60a',
                    fontSize: '14px',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '20px'
                }}>
                    Potenciando la comunidad UNAM
                </span>
                <h1 style={{
                    fontSize: 'clamp(40px, 8vw, 72px)',
                    fontWeight: 700,
                    lineHeight: 1.05,
                    marginBottom: '24px',
                    letterSpacing: '-0.03em'
                }}>
                    Comparte. Ayuda.<br />
                    <span style={{ color: '#86868b' }}>Ningún código se desperdicia.</span>
                </h1>
                <p style={{
                    fontSize: '20px',
                    color: '#86868b',
                    maxWidth: '600px',
                    margin: '0 auto 48px',
                    lineHeight: 1.5
                }}>
                    La plataforma oficial para compartir beneficios alimentarios entre estudiantes.
                    Seguro, rápido y completamente gratuito.
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/donar" className="apple-btn" style={{ background: 'var(--accent-donor)', color: '#fff', padding: '16px 40px', fontSize: '17px', borderRadius: '40px', fontWeight: 600 }}>
                        Donar Código
                    </Link>
                    <a href="#explore" className="apple-btn apple-btn-secondary" style={{ padding: '16px 40px', fontSize: '17px', borderRadius: '40px' }}>
                        Explorar Comedores
                    </a>
                </div>
            </section>

            {/* Guía de la Comunidad + Explorar Comedores (Combined Area) */}
            <div id="explore" style={{ background: '#000000', borderTop: '1px solid rgba(255,255,255,0.05)' }}>

                {/* How it Works Section */}
                <section style={{ padding: '80px 24px 40px' }}>
                    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                            <h2 style={{ fontSize: '42px', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '16px', color: '#fff' }}>¿Cómo empezar?</h2>
                            <p style={{ color: '#86868b', fontSize: '18px' }}>Elige tu rol en la comunidad y conoce el proceso.</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
                            {/* Donor Path */}
                            <div className="glass-card animate-up" style={{
                                padding: '40px',
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                borderRadius: '32px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '24px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ background: 'var(--accent-donor)', width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                        <Share2 size={24} />
                                    </div>
                                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>Soy Donador</h3>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <div style={{ color: 'var(--accent-donor)', fontWeight: 800 }}>01</div>
                                        <p style={{ color: '#86868b', fontSize: '15px', margin: 0 }}>Toma foto al código QR de tu charola.</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <div style={{ color: 'var(--accent-donor)', fontWeight: 800 }}>02</div>
                                        <p style={{ color: '#86868b', fontSize: '15px', margin: 0 }}>Súbelo en la sección de "Donar".</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <div style={{ color: 'var(--accent-donor)', fontWeight: 800 }}>03</div>
                                        <p style={{ color: '#86868b', fontSize: '15px', margin: 0 }}>Sube en el Ranking y gana reputación.</p>
                                    </div>
                                </div>
                                <Link to="/donar" className="apple-btn" style={{
                                    marginTop: 'auto',
                                    textAlign: 'center',
                                    background: 'var(--accent-donor)',
                                    color: '#fff',
                                    fontWeight: 700,
                                    borderRadius: '12px',
                                    padding: '14px'
                                }}>
                                    Empezar a Donar
                                </Link>
                            </div>

                            {/* Receiver Path */}
                            <div className="glass-card animate-up" style={{
                                padding: '40px',
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                borderRadius: '32px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '24px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ background: 'var(--accent-recipient)', width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
                                        <Zap size={24} fill="currentColor" />
                                    </div>
                                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>Soy Receptor</h3>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <div style={{ color: 'var(--accent-recipient)', fontWeight: 800 }}>01</div>
                                        <p style={{ color: '#86868b', fontSize: '15px', margin: 0 }}>Elige un comedor de abajo y únete a la fila.</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <div style={{ color: '#ffd60a', fontWeight: 800 }}>02</div>
                                        <p style={{ color: '#86868b', fontSize: '15px', margin: 0 }}>Acepta el turno cuando llegue la notificación.</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <div style={{ color: '#ffd60a', fontWeight: 800 }}>03</div>
                                        <p style={{ color: '#86868b', fontSize: '15px', margin: 0 }}>Sube tu evidencia para seguir participando.</p>
                                    </div>
                                </div>
                                <a href="#explore" className="apple-btn apple-btn-primary" style={{ marginTop: 'auto', textAlign: 'center' }}>
                                    Buscar un Comedor
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Comedores Showcase */}
                <section style={{ padding: '40px 24px 80px' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#ffd60a', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '12px' }}>Listas de Espera en Tiempo Real</h3>
                            <p style={{ color: '#fff', fontSize: '24px', fontWeight: 700 }}>Selecciona un comedor para empezar</p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
                            {COMEDOR_STYLES.map((c, i) => (
                                <Link key={c.slug} to={`/codigos/${c.slug}`} style={{ textDecoration: 'none' }}>
                                    <div className="glass-card" style={{
                                        padding: '40px',
                                        height: '320px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        background: c.bg,
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }} onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                                        e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.5)';
                                    }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                            e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                                        }}>
                                        {/* Glass Overlay for depth */}
                                        <div style={{
                                            position: 'absolute',
                                            top: 0, left: 0, right: 0, bottom: 0,
                                            background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 100%)',
                                            pointerEvents: 'none'
                                        }} />

                                        <div style={{ position: 'relative', zIndex: 1 }}>
                                            <span style={{ fontSize: '40px', marginBottom: '20px', display: 'block' }}>{c.icon}</span>
                                            <h3 style={{ fontSize: '28px', marginBottom: '8px', color: '#ffffff', fontWeight: 700 }}>{c.name}</h3>
                                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px' }}>{c.desc}</p>
                                        </div>

                                        <div style={{
                                            position: 'relative',
                                            zIndex: 1,
                                            color: c.accent === '#32ade6' ? '#ffd60a' : c.accent,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            fontWeight: 600,
                                            fontSize: '15px'
                                        }}>
                                            Unirse a fila <ChevronRight size={18} />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats / Proof Section */}
                <section style={{ padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div className="glass-card" style={{ padding: '48px', textAlign: 'left', background: '#1c1c1e' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                                <div style={{
                                    background: 'rgba(255, 214, 10, 0.1)',
                                    padding: '12px',
                                    borderRadius: '14px'
                                }}>
                                    <Award size={32} color="#ffd60a" />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '32px', margin: 0 }}>Líderes de la Comunidad</h2>
                                    <p style={{ color: '#86868b', margin: 0 }}>Cuidando el bienestar estudiantil</p>
                                </div>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Rango</th>
                                            <th>Usuario</th>
                                            <th>Donaciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topDonors.map((donor, idx) => (
                                            <tr key={donor.hash_id}>
                                                <td style={{ color: idx < 3 ? '#ffd60a' : '#86868b', fontWeight: 600 }}>#{idx + 1}</td>
                                                <td style={{ fontWeight: 500 }}>{donor.user.username}</td>
                                                <td style={{ color: '#30d158', fontWeight: 600 }}>{donor.donated_count}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section style={{ padding: '100px 24px', textAlign: 'center' }}>
                    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '64px' }}>
                        <div>
                            <div style={{ marginBottom: '24px', display: 'inline-flex', padding: '16px', borderRadius: '20px', background: 'rgba(48, 209, 88, 0.1)' }}>
                                <ShieldCheck size={40} color="#30d158" />
                            </div>
                            <h3 style={{ fontSize: '22px', marginBottom: '12px' }}>Seguridad Primero</h3>
                            <p style={{ color: '#86868b', lineHeight: 1.6, fontSize: '16px' }}>Verificación por evidencia para asegurar que la ayuda llegue a quien la necesita.</p>
                        </div>
                        <div>
                            <div style={{ marginBottom: '24px', display: 'inline-flex', padding: '16px', borderRadius: '20px', background: 'rgba(255, 214, 10, 0.1)' }}>
                                <Zap size={40} color="#ffd60a" />
                            </div>
                            <h3 style={{ fontSize: '22px', marginBottom: '12px' }}>Respuesta Rápida</h3>
                            <p style={{ color: '#86868b', lineHeight: 1.6, fontSize: '16px' }}>Sistema de turnos optimizado con notificaciones en tiempo real.</p>
                        </div>
                        <div>
                            <div style={{ marginBottom: '24px', display: 'inline-flex', padding: '16px', borderRadius: '20px', background: 'rgba(255, 214, 10, 0.1)' }}>
                                <Share2 size={40} color="#ffd60a" />
                            </div>
                            <h3 style={{ fontSize: '22px', marginBottom: '12px' }}>Impacto Directo</h3>
                            <p style={{ color: '#86868b', lineHeight: 1.6, fontSize: '16px' }}>Cada donación es un apoyo tangible para un compañero universitario.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
