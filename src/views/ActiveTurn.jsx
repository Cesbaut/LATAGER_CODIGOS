import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Timer, CheckCircle, Phone, MapPin, Star, Trophy, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:8000';

export default function ActiveTurn({ user }) {
    const [status, setStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAccepting, setIsAccepting] = useState(false);
    const [acceptedData, setAcceptedData] = useState(null);
    const navigate = useNavigate();

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
            console.error("Download failed", err);
            window.open(imageUrl, '_blank');
        }
    };

    const fetchStatus = async () => {
        if (!user) return;
        try {
            const token = localStorage.getItem('authToken');
            const res = await axios.get(`${API_URL}/api/codigos/waitlist/my_status/`, {
                headers: { Authorization: `Token ${token}` }
            });
            setStatus(res.data);
        } catch (err) {
            console.error("Error fetching status", err);
            if (err.response?.status === 404) {
                setStatus({ message: 'Not in waitlist' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 15000); // Poll every 15s
        return () => clearInterval(interval);
    }, [user]);

    const handleAccept = async () => {
        setIsAccepting(true);
        try {
            const token = localStorage.getItem('authToken');
            const res = await axios.post(`${API_URL}/api/codigos/waitlist/${status.id}/accept/`, {}, {
                headers: { Authorization: `Token ${token}` }
            });
            setAcceptedData(res.data);
            toast.success("¡Código aceptado!");
        } catch (err) {
            toast.error("Error al aceptar el código.");
        } finally {
            setIsAccepting(false);
        }
    };

    if (isLoading) return <div className="flex-center" style={{ height: '60vh' }}>Cargando estado de tu turno...</div>;

    if (!status || status.message === 'Not in waitlist') {
        return (
            <div className="flex-center animate-fade-in" style={{ height: '60vh', flexDirection: 'column' }}>
                <div className="glass-panel text-center" style={{ padding: '3rem' }}>
                    <h2 className="text-muted">No estás en ninguna lista de espera</h2>
                    <button onClick={() => navigate('/')} className="btn btn-primary mt-4">Ver Comedores</button>
                </div>
            </div>
        );
    }

    const isNotified = status.status === 'Notified';
    const isAccepted = status.status === 'Accepted' || acceptedData;
    const isPassed = status.status === 'Passed';

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
            <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', padding: '2.5rem' }}>
                <h1 className="text-gradient text-center mb-4">Tu Beneficio</h1>

                {status.status === 'Waiting' && (
                    <div className="text-center">
                        <div className="flex-center mb-4" style={{ gap: '10px' }}>
                            <Timer size={40} className="text-primary" />
                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Turno #{status.position}</span>
                        </div>
                        <p className="text-muted">Estás en la lista de espera para <strong>{status.comedor}</strong>.</p>
                        <p className="text-muted">Te avisaremos por correo y aquí mismo cuando sea tu turno.</p>
                        <div className="pulse-circle" style={{ margin: '2rem auto' }}></div>
                    </div>
                )}

                {isNotified && !acceptedData && (
                    <div className="text-center">
                        <div className="alert-box mb-4">
                            <h2 style={{ color: '#d32f2f', marginBottom: '0.5rem' }}>¡Es tu turno!</h2>
                            <p>Tienes 10 minutos para aceptar este código antes de que pase al siguiente.</p>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '1rem 0' }}>
                                {Math.floor(status.remaining_seconds / 60)}:{Math.floor(status.remaining_seconds % 60).toString().padStart(2, '0')}
                            </div>
                        </div>

                        {status.donor_info && (
                            <div className="donor-card mb-4" style={{ background: 'rgba(0,0,0,0.03)', padding: '1.5rem', borderRadius: '15px', textAlign: 'left' }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Sobre el Donador:</h3>
                                <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '10px', marginBottom: '0.5rem' }}>
                                    <Star className="text-primary" size={18} />
                                    <span
                                        onClick={() => navigate(`/usuario/${status.donor_info.username}`)}
                                        style={{ cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
                                    >
                                        {status.donor_info.username}
                                    </span>
                                    {status.donor_info.is_top_donor && <span className="badge-gold"><Trophy size={14} /> Top Donador</span>}
                                </div>
                                <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '10px', marginBottom: '0.5rem' }}>
                                    <MapPin size={18} className="text-muted" />
                                    <span className="text-muted">Facultad: {status.donor_info.faculty}</span>
                                </div>
                                <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '10px' }}>
                                    <CheckCircle size={18} className="text-muted" />
                                    <span className="text-muted">Donaciones realizadas: {status.donor_info.donated_count}</span>
                                </div>
                            </div>
                        )}

                        <button
                            className="btn btn-primary w-full"
                            style={{ height: '60px', fontSize: '1.2rem' }}
                            onClick={handleAccept}
                            disabled={isAccepting}
                        >
                            {isAccepting ? 'Aceptando...' : 'Aceptar Beneficio'}
                        </button>
                    </div>
                )}

                {(isAccepted || acceptedData) && (
                    <div className="text-center animate-fade-in">
                        <div className="flex-center mb-4" style={{ color: '#2e7d32', gap: '8px' }}>
                            <CheckCircle size={32} />
                            <h2 style={{ margin: 0 }}>¡Código Obtenido!</h2>
                        </div>

                        <div className="qr-container mb-4" style={{ background: 'white', padding: '1rem', borderRadius: '20px', display: 'inline-block' }}>
                            <img
                                src={acceptedData?.qr_image ? `${API_URL}${acceptedData.qr_image}` : (status.qr_image ? `${API_URL}${status.qr_image}` : "/placeholder-qr.png")}
                                alt="Código QR de Alimentos"
                                style={{ width: '250px', height: '250px', objectFit: 'contain' }}
                            />
                        </div>

                        <div className="contact-box mb-4" style={{ background: 'rgba(0,0,0,0.03)', padding: '1.5rem', borderRadius: '15px' }}>
                            <p className="text-muted mb-2">Contacto del Donador:</p>
                            <div className="flex-center" style={{ gap: '10px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                <Phone size={20} className="text-primary" />
                                <span>{acceptedData?.donor_phone || status.donor_info?.phone || "Revisa tu correo"}</span>
                            </div>
                        </div>

                        <div className="flex-center" style={{ gap: '1rem' }}>
                            <button
                                onClick={() => handleDownload(acceptedData?.qr_image ? `${API_URL}${acceptedData.qr_image}` : (status.qr_image ? `${API_URL}${status.qr_image}` : null))}
                                className="btn w-full"
                                style={{ background: '#eee', color: '#333' }}
                            >
                                <Download size={18} /> Descargar
                            </button>
                            <button className="btn btn-primary w-full" onClick={() => navigate(`/evidencia/${acceptedData?.donation_id || status.donation_id || 'new'}`)}>
                                Subir Evidencia
                            </button>
                        </div>
                    </div>
                )}

                {isPassed && (
                    <div className="text-center animate-fade-in">
                        <div className="alert-box mb-4" style={{ borderColor: '#d32f2f' }}>
                            <h2 style={{ color: '#d32f2f', marginBottom: '1rem' }}>Tiempo Agotado</h2>
                            <p className="text-muted">Lo sentimos, el tiempo para aceptar este código ha expirado y ha pasado a la siguiente persona en la lista.</p>
                        </div>
                        <button onClick={() => navigate('/')} className="btn btn-primary">Volver a Intentar</button>
                    </div>
                )}
            </div>
        </div>
    );
}
