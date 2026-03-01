import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Users, AlertTriangle } from 'lucide-react';

export default function ComedorWaitlist({ user }) {
    const { comedor } = useParams();
    const navigate = useNavigate();
    const [waitlist, setWaitlist] = useState([]);
    const [myStatus, setMyStatus] = useState(null);

    // Convert URL slug to Capitalized string as per backend enum
    const comedorName = comedor.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    useEffect(() => {
        fetchQueue();
        const interval = setInterval(fetchQueue, 10000); // Poll every 10 seconds
        return () => clearInterval(interval);
    }, [comedorName]);

    const fetchQueue = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/codigos/queue/${comedorName}/`);
            setWaitlist(res.data);
            if (user) {
                // Also fetch personal status here if needed
                // For now, simplicity we do waitlist.find()
            }
        } catch (e) { console.error(e) }
    };

    const joinWaitlist = async () => {
        if (!user) {
            navigate('/autenticacion'); // Backend URL
            return;
        }
        // API Call to join
        const token = localStorage.getItem('authToken');
        try {
            await axios.post('http://localhost:8000/api/codigos/waitlist/', { comedor: comedorName }, {
                headers: { Authorization: `Token ${token}` }
            });
            fetchQueue();
        } catch (e) {
            alert("Error joining waitlist");
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                    Comedor {comedorName}
                </h1>
                <p className="text-muted" style={{ marginBottom: '2rem' }}>
                    Lista de espera en tiempo real.
                </p>

                {user ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                        {waitlist.some(e => e.user.id === user.id && e.status === 'Notified') ? (
                            <div className="alert-box animate-pulse" style={{ borderColor: 'var(--primary)', background: 'rgba(var(--primary-rgb), 0.1)' }}>
                                <h3 className="text-primary mb-2">¡Es tu turno en este comedor!</h3>
                                <button onClick={() => navigate('/turno')} className="btn btn-primary btn-lg w-full">
                                    IR A RECIBIR CÓDIGO AHORA
                                </button>
                            </div>
                        ) : waitlist.some(e => e.user.id === user.id) ? (
                            <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.03)', borderRadius: '12px', width: '100%' }}>
                                <p className="text-muted">Ya estás en la fila. Te avisaremos cuando sea tu turno.</p>
                                <button onClick={() => navigate('/turno')} className="btn btn-secondary mt-2">Ver mi posición</button>
                            </div>
                        ) : (
                            <button onClick={joinWaitlist} className="btn btn-primary btn-lg">
                                Unirse a la Fila de Espera
                            </button>
                        )}
                    </div>
                ) : (
                    <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                        <AlertTriangle className="text-muted mb-2" style={{ margin: '0 auto' }} />
                        <p className="text-muted mb-3">Debes autenticarte para poder ingresar a la lista de espera.</p>
                        <Link to="/autenticacion" className="btn btn-secondary">
                            Autenticarse para Unirse
                        </Link>
                    </div>
                )}
            </div>

            <div className="glass-panel delay-1" style={{ marginTop: '2rem', padding: '2rem' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <Users className="text-secondary" /> Personas en Espera ({waitlist.length})
                </h2>

                {waitlist.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {waitlist.map((entry, idx) => (
                            <li key={entry.id} style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span className="badge badge-purple" style={{ fontSize: '1rem', width: '30px', textAlign: 'center' }}>{idx + 1}</span>
                                    <span style={{ fontWeight: 500 }}>{entry.user.username}</span>
                                </div>
                                <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                                    Añadido {new Date(entry.joined_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-muted" style={{ padding: '2rem' }}>Actualmente no hay nadie en la fila para este comedor.</p>
                )}
            </div>
        </div>
    );
}
