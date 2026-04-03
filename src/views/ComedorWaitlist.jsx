import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Users, AlertTriangle, Loader2, Gift, Send, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { requestNotificationPermission } from '../utils/notifications';

export default function ComedorWaitlist({ user }) {
    const { comedor } = useParams();
    const navigate = useNavigate();
    const [waitlist, setWaitlist] = useState([]);
    const [activeDonations, setActiveDonations] = useState(0);
    const [totalToday, setTotalToday] = useState(0);
    const [inProcess, setInProcess] = useState([]);
    const [isJoining, setIsJoining] = useState(false);

    const comedorName = comedor.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    useEffect(() => {
        fetchQueue();
        const interval = setInterval(fetchQueue, 10000);
        return () => clearInterval(interval);
    }, [comedorName]);

    const fetchQueue = async () => {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        try {
            const res = await axios.get(`${apiUrl}/api/codigos/queue/${comedorName}/`);
            setWaitlist(res.data.waiting || []);
            setActiveDonations(res.data.active_donations_count || 0);
            setTotalToday(res.data.total_today_count || 0);
            setInProcess(res.data.in_process || []);
        } catch (e) { console.error(e); }
    };

    const joinWaitlist = async () => {
        if (!user) { navigate('/autenticacion'); return; }
        setIsJoining(true);
        const token = localStorage.getItem('authToken');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        try {
            await axios.post(`${apiUrl}/api/codigos/waitlist/`, { comedor: comedorName }, {
                headers: { Authorization: `Token ${token}` }
            });
            // Request notification permission right when joining
            requestNotificationPermission();
            await fetchQueue();
        } catch (e) {
            const errorMsg = e.response?.data?.[0] || e.response?.data?.error || "Error al unirse a la fila";
            toast.error(errorMsg);
        } finally {
            setIsJoining(false);
        }
    };

    const leaveWaitlist = async () => {
        if (!window.confirm("¿Estás seguro de que deseas salir de la lista de espera?")) return;
        const token = localStorage.getItem('authToken');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        try {
            await axios.post(`${apiUrl}/api/codigos/waitlist/leave/`, { comedor: comedorName }, {
                headers: { Authorization: `Token ${token}` }
            });
            await fetchQueue();
        } catch (e) {
            toast.error("Error al salir de la lista de espera.");
        }
    };

    const isUserInQueue = waitlist.some(e => e.user.id === user?.id);
    const isUserNotified = waitlist.some(e => e.user.id === user?.id && e.status === 'Notified');

    return (
        <div className="container animate-up" style={{ maxWidth: '800px', margin: '0 auto' }}>

            {/* Header Card */}
            <div className="glass-card" style={{ padding: 'var(--hero-padding)', textAlign: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '44px', marginBottom: '12px', fontWeight: 800, letterSpacing: '-0.03em' }}>
                    Comedor {comedorName}
                </h1>

                {/* Stats Pills */}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '40px', flexWrap: 'wrap' }}>
                    <span className="stat-pill">
                        <Users size={14} color="var(--text-secondary)" /> {waitlist.length} en espera
                    </span>
                    <span className="stat-pill stat-pill-green">
                        <Gift size={14} /> {activeDonations} activos
                    </span>
                    <span className="stat-pill stat-pill-cyan">
                        <CheckCircle size={14} /> {totalToday} hoy
                    </span>
                </div>

                {/* Action Buttons */}
                {user ? (
                    <div>
                        {isUserNotified ? (
                            <div style={{ background: 'rgba(48, 209, 88, 0.08)', border: '1px solid rgba(48, 209, 88, 0.2)', borderRadius: '24px', padding: '32px', marginBottom: '16px' }}>
                                <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--accent-green)', marginBottom: '20px' }}>
                                    ¡Es tu turno! 🎉
                                </p>
                                <button onClick={() => navigate('/turno')} className="apple-btn apple-btn-green" style={{ padding: '15px 40px', fontSize: '17px' }}>
                                    Ir a Recibir Código
                                </button>
                            </div>
                        ) : isUserInQueue ? (
                            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '32px' }}>
                                <p style={{ fontSize: '17px', marginBottom: '24px', color: 'var(--text-secondary)' }}>
                                    Ya estás en la fila. Te avisaremos cuando sea tu turno.
                                </p>
                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                    <button onClick={() => navigate('/turno')} className="apple-btn apple-btn-primary" style={{ padding: '12px 32px' }}>
                                        Ver mi posición
                                    </button>
                                    <button onClick={leaveWaitlist} className="apple-btn apple-btn-danger" style={{ padding: '12px 32px' }}>
                                        Abandonar Fila
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <button
                                    onClick={joinWaitlist}
                                    className="apple-btn apple-btn-primary"
                                    disabled={isJoining}
                                    style={{ padding: '16px 48px', fontSize: '17px', fontWeight: 600, minWidth: '220px' }}
                                >
                                    {isJoining ? <><Loader2 size={18} className="animate-spin" /> Uniéndote...</> : 'Unirse a la Fila'}
                                </button>
                                <button
                                    onClick={() => navigate('/donar', { state: { comedor: comedorName } })}
                                    className="apple-btn"
                                    style={{ padding: '16px 48px', fontSize: '17px', fontWeight: 600, minWidth: '220px', background: 'var(--accent-donor-glass)', color: 'var(--accent-donor)', border: '1px solid var(--accent-donor-glass)' }}
                                >
                                    <Send size={18} /> Donar Aquí
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '24px', padding: '32px' }}>
                        <AlertTriangle size={32} color="var(--text-secondary)" style={{ margin: '0 auto 16px auto', display: 'block' }} />
                        <p style={{ marginBottom: '24px', fontSize: '17px', color: 'var(--text-secondary)' }}>Debes iniciar sesión para unirte a la fila.</p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/autenticacion" className="apple-btn apple-btn-primary" style={{ padding: '12px 32px' }}>
                                Iniciar Sesión
                            </Link>
                            <button
                                onClick={() => navigate('/donar', { state: { comedor: comedorName } })}
                                className="apple-btn"
                                style={{ padding: '12px 32px', background: 'var(--accent-donor-glass)', color: 'var(--accent-donor)' }}
                            >
                                Solo Donar
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* In-Process */}
            {inProcess.length > 0 && (
                <div className="glass-card" style={{ marginBottom: '24px', padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <div style={{ background: 'rgba(0, 113, 227, 0.1)', padding: '8px', borderRadius: '10px' }}>
                            <Loader2 className="animate-spin" size={20} color="var(--accent-primary)" />
                        </div>
                        <h2 style={{ fontSize: '22px', margin: 0, fontWeight: 700 }}>Intercambios en Curso</h2>
                    </div>
                    <div style={{
                        display: 'flex',
                        overflowX: 'auto',
                        gap: '16px',
                        paddingBottom: '16px',
                        WebkitOverflowScrolling: 'touch',
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(255,255,255,0.1) transparent'
                    }}>
                        {inProcess.map(p => (
                            <div key={p.id} style={{
                                flex: '0 0 280px',
                                background: 'rgba(255,255,255,0.03)',
                                padding: '16px',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }}>
                                <div style={{ fontSize: '24px' }}>🎁</div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ margin: 0, fontWeight: 600, fontSize: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        <span style={{ color: 'var(--accent-donor)' }}>@{p.donor_username}</span>
                                        <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}> → </span>
                                        <span style={{ color: 'var(--accent-recipient)' }}>@{p.receiver_username}</span>
                                    </p>
                                    <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: p.status === 'Accepted' ? 'var(--accent-green)' : 'var(--accent-donor)' }} />
                                        <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: p.status === 'Accepted' ? 'var(--accent-green)' : 'var(--accent-donor)' }}>
                                            {p.status === 'Accepted' ? 'Recibido' : 'Transfiriendo'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Waitlist Table */}
            <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '32px 32px 24px 32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'rgba(0, 113, 227, 0.1)', padding: '8px', borderRadius: '10px' }}>
                        <Users size={20} color="var(--accent-primary)" />
                    </div>
                    <h2 style={{ fontSize: '22px', margin: 0, fontWeight: 700 }}>Lista de Espera ({waitlist.length})</h2>
                </div>

                {waitlist.length > 0 ? (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th style={{ width: '80px' }}>#</th>
                                <th>Usuario</th>
                                <th style={{ textAlign: 'right' }}>Hora de unión</th>
                            </tr>
                        </thead>
                        <tbody>
                            {waitlist.map((entry, idx) => (
                                <tr key={entry.id}>
                                    <td>
                                        <span style={{
                                            width: '28px', height: '28px', borderRadius: '50%',
                                            background: idx === 0 ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                                            color: idx === 0 ? 'black' : 'var(--text-secondary)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '13px', fontWeight: 700
                                        }}>
                                            {idx + 1}
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{ fontWeight: 600, fontSize: '16px' }}>{entry.user.username}</span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <span style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                            <Clock size={14} /> {new Date(entry.joined_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ textAlign: 'center', padding: '64px 20px' }}>
                        <Users size={48} color="var(--text-muted)" style={{ opacity: 0.2, marginBottom: '16px' }} />
                        <p style={{ color: 'var(--text-secondary)', fontSize: '17px' }}>No hay nadie en la fila para este comedor.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
