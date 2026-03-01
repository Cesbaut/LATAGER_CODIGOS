import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Star, CheckCircle, Smartphone, GraduationCap, Link } from 'lucide-react';

export default function UserProfile() {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/codigos/profile/${username}/`)
            .then(res => setProfile(res.data))
            .catch(err => console.error(err));
    }, [username]);

    if (!profile) return <div className="text-center pt-20">Cargando perfil...</div>;

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="glass-panel text-center" style={{ padding: '3rem 2rem' }}>

                <div style={{
                    width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                    margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold'
                }}>
                    {profile.user.username.charAt(0).toUpperCase()}
                </div>

                <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{profile.user.username}</h1>
                <p className="text-muted" style={{ marginBottom: '2rem' }}>
                    Miembro de LaTaGer Códigos
                </p>

                <div className="grid-2" style={{ gap: '1.5rem', textAlign: 'left', marginBottom: '3rem' }}>
                    <div className="glass-panel flex" style={{ padding: '1.5rem', gap: '1rem', alignItems: 'center', display: 'flex' }}>
                        <CheckCircle className="text-secondary" size={32} />
                        <div>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Códigos Donados</p>
                            <h3 style={{ fontSize: '1.5rem' }}>{profile.donated_count}</h3>
                        </div>
                    </div>
                    <div className="glass-panel flex" style={{ padding: '1.5rem', gap: '1rem', alignItems: 'center', display: 'flex' }}>
                        <CheckCircle className="text-primary" size={32} />
                        <div>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Códigos Recibidos</p>
                            <h3 style={{ fontSize: '1.5rem' }}>{profile.received_count}</h3>
                        </div>
                    </div>
                </div>

                <div style={{ textAlign: 'left' }}>
                    <h3 className="mb-4 text-gradient">Información del Usuario</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <GraduationCap className="text-muted" />
                            <span><span className="text-muted">Facultad: </span> {profile.faculty || 'No especificada'}</span>
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Smartphone className="text-muted" />
                            <span><span className="text-muted">Teléfono: </span> {profile.phone || 'Privado'}</span>
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Link className="text-muted" />
                            <span><span className="text-muted">¿Usa LaTaGer Horarios?: </span> {profile.has_horarios ? 'Sí' : 'No'}</span>
                        </li>
                    </ul>

                    <h3 className="mb-4 text-gradient">Comentarios y Reseñas</h3>
                    {profile.reviews_received?.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {profile.reviews_received.map((rev, idx) => (
                                <div key={idx} className="glass-panel" style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.5)' }}>
                                    <div className="flex-center" style={{ justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>@{rev.from_user.username}</span>
                                        <div className="flex-center" style={{ gap: '2px' }}>
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    fill={i < rev.stars ? "var(--primary)" : "none"}
                                                    className={i < rev.stars ? "text-primary" : "text-muted"}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.95rem', fontStyle: 'italic', color: '#444' }}>
                                        "{rev.comment || 'Sin comentarios.'}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted text-center" style={{ fontStyle: 'italic' }}>Este usuario aún no tiene reseñas.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
