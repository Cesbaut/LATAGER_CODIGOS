import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { Timer, CheckCircle, Phone, MapPin, Star, Trophy, Download, Loader2, XCircle, Clock, ChevronRight, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:8000';

function TurnCard({ initialStatus, fetchAllStatuses, handleDownload }) {
    const [status, setStatus] = useState(initialStatus);
    const [isAccepting, setIsAccepting] = useState(false);
    const [acceptedData, setAcceptedData] = useState(null);
    const [secondsLeft, setSecondsLeft] = useState(null);
    const [isPulsing, setIsPulsing] = useState(false);
    const navigate = useNavigate();

    // Sync status if initialStatus changes from parent polling
    useEffect(() => {
        setStatus(initialStatus);
        if (initialStatus?.remaining_seconds !== undefined) {
            setSecondsLeft(Math.floor(initialStatus.remaining_seconds));
        }
    }, [initialStatus]);

    // Local countdown interval
    useEffect(() => {
        if (secondsLeft === null || secondsLeft <= 0) return;

        const timer = setInterval(() => {
            setSecondsLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                if (prev % 60 === 0 || prev < 60) {
                    setIsPulsing(true);
                    setTimeout(() => setIsPulsing(false), 300);
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [secondsLeft > 0]);

    const handleAccept = async () => {
        setIsAccepting(true);
        try {
            const token = localStorage.getItem('authToken');
            const res = await axios.post(`${API_URL}/api/codigos/waitlist/${status.id}/accept/`, {}, {
                headers: { Authorization: `Token ${token}` }
            });
            setAcceptedData(res.data);
            toast.success(`¡Código para ${status.comedor} aceptado!`);
        } catch (err) {
            toast.error("Error al aceptar el código.");
        } finally {
            setIsAccepting(false);
        }
    };

    const handleLeave = async () => {
        if (!window.confirm(`¿Estás seguro de que deseas salir de la fila para ${status.comedor}? Perderás tu lugar actual.`)) return;

        const token = localStorage.getItem('authToken');
        try {
            await axios.post(`${API_URL}/api/codigos/waitlist/leave/`, { comedor: status.comedor }, {
                headers: { Authorization: `Token ${token}` }
            });
            toast.success(`Has salido de la lista de ${status.comedor}.`);
            fetchAllStatuses(); // Refresh the list
        } catch (err) {
            console.error(err);
            toast.error("Error al salir de la lista.");
        }
    };

    const isNotified = status.status === 'Notified';
    const isAccepted = status.status === 'Accepted' || acceptedData;
    const isPassed = status.status === 'Passed';

    return (
        <div className="glass-card animate-up" style={{ padding: '40px', marginBottom: '32px', border: isNotified ? '2px solid var(--accent-red)' : '1px solid rgba(255,255,255,0.05)' }}>

            {/* Status: Waiting */}
            {status.status === 'Waiting' && (
                <div style={{ textAlign: 'center' }}>
                    <header style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '12px', color: '#fff' }}>
                            {status.comedor}
                        </h2>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                            <span className="stat-pill" style={{ background: 'rgba(255, 214, 10, 0.1)', color: 'var(--accent-primary)', fontSize: '16px', padding: '6px 16px', borderRadius: '12px' }}>
                                <Clock size={16} style={{ marginRight: '6px' }} /> Turno #{status.position}
                            </span>
                        </div>
                    </header>

                    <div style={{ background: '#2c2c2e', padding: '24px', borderRadius: '20px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                            Estamos asignando códigos para este comedor. Mantente atento a las notificaciones.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                        <div className="pulse-circle" style={{ width: '10px', height: '10px', background: 'var(--accent-primary)', borderRadius: '50%', marginBottom: '8px', boxShadow: '0 0 15px var(--accent-primary)' }}></div>
                        <button onClick={handleLeave} className="apple-btn apple-btn-secondary" style={{ padding: '10px 24px', fontSize: '14px', background: 'rgba(255, 69, 58, 0.1)', color: 'var(--accent-red)', border: 'none' }}>
                            Cancelar este turno
                        </button>
                    </div>
                </div>
            )}

            {/* Status: Notified */}
            {isNotified && !acceptedData && (
                <div style={{ textAlign: 'center' }}>
                    <header style={{ marginBottom: '24px' }}>
                        <div style={{ background: 'rgba(255, 69, 58, 0.1)', color: 'var(--accent-red)', padding: '8px 16px', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            <XCircle size={14} /> ¡Turno Listo en {status.comedor}!
                        </div>
                        <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '8px', color: '#fff' }}>
                            ¡Es Tu Momento!
                        </h2>
                    </header>

                    {/* Compact Timer */}
                    <div style={{ position: 'relative', width: '160px', height: '160px', margin: '24px auto' }}>
                        <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
                            <circle cx="80" cy="80" r="72" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
                            <circle
                                cx="80" cy="80" r="72"
                                stroke={secondsLeft < 60 ? 'var(--accent-red)' : 'var(--accent-primary)'}
                                strokeWidth="8" fill="none"
                                strokeDasharray={2 * Math.PI * 72}
                                strokeDashoffset={(2 * Math.PI * 72) * (1 - (secondsLeft || 0) / 600)}
                                strokeLinecap="round"
                                style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease' }}
                            />
                        </svg>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                            <p style={{ fontSize: '36px', fontWeight: 800, margin: 0, color: secondsLeft < 60 ? 'var(--accent-red)' : '#fff', fontVariantNumeric: 'tabular-nums' }}>
                                {Math.floor((secondsLeft || 0) / 60)}:{Math.floor((secondsLeft || 0) % 60).toString().padStart(2, '0')}
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button className="apple-btn apple-btn-primary" style={{ width: '100%', height: '56px', fontSize: '18px' }} onClick={handleAccept} disabled={isAccepting}>
                            {isAccepting ? <Loader2 className="animate-spin" /> : 'ACEPTAR CÓDIGO'}
                        </button>
                        <button onClick={handleLeave} className="apple-btn apple-btn-secondary" style={{ width: '100%', height: '48px', fontSize: '14px' }}>
                            Pasar turno / Salir
                        </button>
                    </div>
                </div>
            )}

            {/* Status: Accepted */}
            {isAccepted && (
                <div style={{ textAlign: 'center' }}>
                    <header style={{ marginBottom: '24px' }}>
                        <div style={{ background: 'rgba(48, 209, 88, 0.1)', color: 'var(--accent-green)', padding: '8px 16px', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            <CheckCircle size={14} /> {status.comedor}
                        </div>
                        <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff' }}>Código Obtenido</h2>
                    </header>

                    <div style={{ background: '#fff', padding: '16px', borderRadius: '24px', display: 'inline-block', marginBottom: '24px' }}>
                        <img
                            src={acceptedData?.qr_image ? `${API_URL}${acceptedData.qr_image}` : (status.qr_image ? `${API_URL}${status.qr_image}` : "/placeholder-qr.png")}
                            alt="QR" style={{ width: '200px', height: '200px', objectFit: 'contain' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <button onClick={() => handleDownload(acceptedData?.qr_image ? `${API_URL}${acceptedData.qr_image}` : (status.qr_image ? `${API_URL}${status.qr_image}` : null))} className="apple-btn apple-btn-secondary" style={{ height: '48px', fontSize: '14px' }}>
                            <Download size={16} /> Guardar
                        </button>
                        <button className="apple-btn apple-btn-primary" style={{ height: '48px', fontSize: '14px' }} onClick={() => navigate(`/evidencia/${acceptedData?.donation_id || status.donation_id || 'new'}`)}>
                            Sube Evidencia
                        </button>
                    </div>
                </div>
            )}

            {/* Status: Passed */}
            {isPassed && (
                <div style={{ textAlign: 'center' }}>
                    <XCircle size={40} color="var(--accent-red)" style={{ marginBottom: '16px' }} />
                    <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Turno Expirado</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>El tiempo para {status.comedor} se agotó.</p>
                </div>
            )}
        </div>
    );
}

export default function ActiveTurn({ user }) {
    const [statuses, setStatuses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchStatuses = async () => {
        if (!user) return;
        try {
            const token = localStorage.getItem('authToken');
            const res = await axios.get(`${API_URL}/api/codigos/waitlist/my_status/`, {
                headers: { Authorization: `Token ${token}` }
            });
            // res.data is now an array
            setStatuses(Array.isArray(res.data) ? res.data : [res.data]);
        } catch (err) {
            console.error("Error fetching status", err);
            if (err.response?.status === 404) {
                setStatuses([]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStatuses();
        const interval = setInterval(fetchStatuses, 15000);
        return () => clearInterval(interval);
    }, [user]);

    const handleDownload = async (imageUrl) => {
        if (!imageUrl) return;
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `codigo-latager-${new Date().getTime()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            window.open(imageUrl, '_blank');
        }
    };

    if (isLoading) return (
        <div className="container flex-center" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <Loader2 size={40} className="animate-spin" color="var(--accent-primary)" />
                <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Cargando tus turnos...</p>
            </div>
        </div>
    );

    if (statuses.length === 0) {
        return (
            <div className="container animate-up" style={{ maxWidth: '600px', margin: '60px auto' }}>
                <div className="glass-card" style={{ padding: '64px 32px', textAlign: 'center' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.05)', width: '80px', height: '80px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
                        <XCircle size={40} color="var(--text-muted)" />
                    </div>
                    <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '16px', color: '#fff' }}>Sin Turnos Activos</h2>
                    <p style={{ fontSize: '17px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.5 }}>
                        No te encuentras en ninguna lista de espera actualmente. Explora los comedores disponibles para unirte a uno.
                    </p>
                    <button onClick={() => navigate('/')} className="apple-btn apple-btn-primary" style={{ padding: '16px 48px', fontSize: '17px' }}>
                        Ver Comedores
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container animate-up" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ textAlign: 'center', padding: 'var(--hero-padding)', marginBottom: '32px' }}>
                <h1 style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-0.05em', color: '#fff', marginBottom: '12px' }}>
                    Tus Beneficios
                </h1>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '8px 20px', borderRadius: '14px', color: 'var(--accent-primary)', fontWeight: 700 }}>
                    <Layers size={18} /> {statuses.length} {statuses.length === 1 ? 'Lista activa' : 'Listas activas'}
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: statuses.length > 1 ? 'repeat(auto-fit, minmax(350px, 1fr))' : '1fr', gap: '32px' }}>
                {statuses.map(s => (
                    <TurnCard
                        key={s.id}
                        initialStatus={s}
                        fetchAllStatuses={fetchStatuses}
                        handleDownload={handleDownload}
                    />
                ))}
            </div>

            {/* Instructions Section */}
            <div className="glass-card animate-up" style={{ marginTop: '64px', padding: '48px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '32px', textAlign: 'center', letterSpacing: '-0.02em' }}>
                    Guía Rápida de Uso
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '32px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ background: 'rgba(255, 214, 10, 0.1)', width: '56px', height: '56px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                            <Clock size={28} color="var(--accent-primary)" />
                        </div>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>1. Espera activa</h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            Mantén esta pestaña abierta. Te avisaremos cuando un código esté listo.
                        </p>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <div style={{ background: 'rgba(255, 214, 10, 0.1)', width: '56px', height: '56px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                            <Timer size={28} color="var(--accent-primary)" />
                        </div>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>2. Notificación</h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            Tendrás 10 min para aceptar tu código. ¡No te distraigas!
                        </p>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <div style={{ background: 'rgba(255, 214, 10, 0.1)', width: '56px', height: '56px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                            <CheckCircle size={28} color="var(--accent-primary)" />
                        </div>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>3. Canjea tu QR</h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            Descarga el QR y preséntalo en el comedor para recibir tu comida.
                        </p>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <div style={{ background: 'rgba(255, 214, 10, 0.1)', width: '56px', height: '56px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                            <Star size={28} color="var(--accent-primary)" />
                        </div>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>4. Sube Evidencia</h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            Toma una foto de tu charola para que la comunidad siga creciendo.
                        </p>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '48px', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', maxWidth: '500px', margin: '0 auto', opacity: 0.6 }}>
                    Tu participación responsable ayuda a cientos de estudiantes cada día. ¡Buen provecho!
                </p>
            </div>
        </div>
    );
}

