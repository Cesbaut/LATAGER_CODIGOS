import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { Star, CheckCircle, Smartphone, GraduationCap, Link as LinkIcon, User, Award, MessageSquare } from 'lucide-react';

const API_URL = 'http://localhost:8000';

export default function UserProfile() {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        axios.get(`${API_URL}/api/codigos/profile/${username}/`)
            .then(res => setProfile(res.data))
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    }, [username]);

    if (isLoading) return (
        <div className="container flex-center" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <div className="animate-spin" style={{ marginBottom: '16px' }}>
                    <User size={40} color="var(--accent-primary)" />
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>Cargando perfil...</p>
            </div>
        </div>
    );

    if (!profile) return (
        <div className="container animate-up" style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center' }}>
            <div className="glass-card" style={{ padding: '64px 32px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff' }}>Perfil no encontrado</h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '16px' }}>El usuario que buscas no existe o ha sido desactivado.</p>
            </div>
        </div>
    );

    return (
        <div className="container animate-up" style={{ maxWidth: '800px', margin: '40px auto' }}>
            {/* Header Section */}
            <div className="glass-card" style={{ padding: '64px 40px', textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                    width: '120px', height: '120px', borderRadius: '40px',
                    background: 'var(--accent-primary)',
                    color: '#000',
                    margin: '0 auto 32px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '48px', fontWeight: 800,
                    boxShadow: '0 20px 40px rgba(255, 214, 10, 0.2)',
                    transform: 'rotate(-5deg)'
                }}>
                    {profile.user.username.charAt(0).toUpperCase()}
                </div>

                <h1 style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-0.05em', color: '#fff', marginBottom: '8px' }}>
                    {profile.user.username}
                </h1>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '6px 16px', borderRadius: '12px', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600 }}>
                    <Award size={16} color="var(--accent-primary)" /> Miembro de LaTaGer Códigos
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '48px' }}>
                    <div style={{ background: '#2c2c2e', padding: '24px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left' }}>
                        <p style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Donaciones</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ color: 'var(--accent-green)' }}><CheckCircle size={28} /></div>
                            <h3 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#fff' }}>{profile.donated_count}</h3>
                        </div>
                    </div>
                    <div style={{ background: '#2c2c2e', padding: '24px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left' }}>
                        <p style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Recibidos</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ color: 'var(--accent-primary)' }}><Star size={28} fill="var(--accent-primary)" /></div>
                            <h3 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#fff' }}>{profile.received_count}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Information & Reviews Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.5fr', gap: '32px', alignItems: 'start' }}>

                {/* Info Card */}
                <div className="glass-card" style={{ padding: '32px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Smartphone size={18} color="var(--accent-primary)" /> Info de Usuario
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Facultad</span>
                            <span style={{ fontSize: '16px', fontWeight: 600, color: '#fff' }}>{profile.faculty || 'No especificada'}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Teléfono</span>
                            <span style={{ fontSize: '16px', fontWeight: 600, color: '#fff' }}>{profile.phone || 'Privado'}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>¿Usa Horarios?</span>
                            <span style={{ fontSize: '16px', fontWeight: 600, color: '#fff' }}>{profile.has_horarios ? 'Sí, usuario verificado' : 'No'}</span>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="glass-card" style={{ padding: '32px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <MessageSquare size={18} color="var(--accent-primary)" /> Reseñas Recibidas
                    </h3>

                    {profile.reviews_received?.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {profile.reviews_received.map((rev, idx) => (
                                <div key={idx} style={{ background: '#2c2c2e', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <RouterLink
                                            to={`/usuario/${rev.from_user.username}`}
                                            style={{ fontWeight: 700, fontSize: '14px', color: 'var(--accent-primary)', textDecoration: 'none' }}
                                        >
                                            @{rev.from_user.username}
                                        </RouterLink>
                                        <div style={{ display: 'flex', gap: '2px' }}>
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={12}
                                                    fill={i < rev.stars ? "var(--accent-primary)" : "none"}
                                                    color={i < rev.stars ? "var(--accent-primary)" : "#424245"}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.5, color: '#fff', fontStyle: 'italic' }}>
                                        "{rev.comment || 'Sin comentario.'}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                            <MessageSquare size={32} style={{ marginBottom: '12px', opacity: 0.3 }} />
                            <p style={{ fontSize: '15px' }}>Este usuario aún no tiene reseñas.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

