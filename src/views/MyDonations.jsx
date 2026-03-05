import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Gift, Clock, Star, AlertCircle, CheckCircle, Trash2, Camera } from 'lucide-react';
import { toast } from 'react-hot-toast';

const API_URL = 'http://localhost:8000';

export default function MyDonations({ user }) {
    const [donations, setDonations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [ratingForm, setRatingForm] = useState({ donationId: null, stars: 5, comment: '' });
    const [submittingRating, setSubmittingRating] = useState(false);

    useEffect(() => {
        const fetchMyDonations = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return;
            try {
                const res = await axios.get(`${API_URL}/api/codigos/donations/my_donations/`, {
                    headers: { Authorization: `Token ${token}` }
                });
                setDonations(res.data);
            } catch (err) {
                console.error("Error fetching my donations", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyDonations();
    }, []);

    const handleRateUser = async (e) => {
        e.preventDefault();
        setSubmittingRating(true);
        const token = localStorage.getItem('authToken');
        const donation = donations.find(d => d.id === ratingForm.donationId);

        try {
            await axios.post(`${API_URL}/api/codigos/ratings/`, {
                donation: ratingForm.donationId,
                stars: ratingForm.stars,
                comment: ratingForm.comment,
                to_user: donation.assigned_to.id
            }, {
                headers: { Authorization: `Token ${token}` }
            });

            // Refresh donations
            const res = await axios.get(`${API_URL}/api/codigos/donations/my_donations/`, {
                headers: { Authorization: `Token ${token}` }
            });
            setDonations(res.data);
            setRatingForm({ donationId: null, stars: 5, comment: '' });
            toast.success("Calificación enviada correctamente.");
        } catch (err) {
            console.error("Error submitting rating", err);
            toast.error("Error al enviar la calificación.");
        } finally {
            setSubmittingRating(false);
        }
    };

    const handleCancelDonation = async (donationId) => {
        if (!window.confirm("¿Estás seguro de que quieres cancelar esta donación? El código ya no estará disponible para otros estudiantes.")) return;

        const token = localStorage.getItem('authToken');
        try {
            await axios.delete(`${API_URL}/api/codigos/donations/${donationId}/`, {
                headers: { Authorization: `Token ${token}` }
            });

            // Local update
            setDonations(prev => prev.filter(d => d.id !== donationId));
            toast.success("Donación cancelada.");
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.[0] || err.response?.data?.error || "Error al cancelar la donación.";
            toast.error(errorMsg);
        }
    };

    const formatImageUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `${API_URL}${url}`;
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Available': return <span className="stat-pill stat-pill-cyan">Disponible</span>;
            case 'Reserved': return <span className="stat-pill" style={{ background: 'rgba(255, 149, 0, 0.1)', color: '#ff9500' }}>Reservado</span>;
            case 'Accepted': return <span className="stat-pill stat-pill-green">Recibido</span>;
            case 'Passed': return <span className="stat-pill" style={{ background: 'rgba(255, 69, 58, 0.1)', color: 'var(--accent-red)' }}>Expiró</span>;
            default: return <span className="stat-pill">{status}</span>;
        }
    };

    if (isLoading) return (
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
            <div className="animate-spin" style={{ display: 'inline-block', marginBottom: '16px' }}>
                <Clock size={32} color="var(--accent-donor)" />
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>Cargando tus donaciones...</p>
        </div>
    );

    return (
        <div className="container animate-up" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ textAlign: 'center', padding: 'var(--hero-padding)', marginBottom: '32px' }}>
                <div style={{ background: 'var(--accent-donor-glass)', width: '80px', height: '80px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
                    <Gift size={40} color="var(--accent-donor)" />
                </div>
                <h1 style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '12px' }}>Mis Donaciones</h1>
                <p style={{ fontSize: '20px', color: 'var(--text-secondary)' }}>Historial de tu impacto en la comunidad.</p>
            </header>

            {donations.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {donations.map((don) => {
                        const myRatingToReceiver = don.ratings.find(r => r.from_user?.id === user?.id);
                        const receiverRatingToMe = don.ratings.find(r => r.to_user === user?.id);

                        return (
                            <div key={don.id} className="glass-card" style={{ padding: '32px' }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
                                    <div style={{ flex: '1', minWidth: '300px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                            <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>{don.comedor}</h3>
                                            {getStatusBadge(don.status)}
                                        </div>

                                        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Clock size={16} />
                                            Donado el {new Date(don.created_at).toLocaleDateString()} a las {new Date(don.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>

                                        {don.status === 'Available' && (
                                            <button
                                                onClick={() => handleCancelDonation(don.id)}
                                                className="apple-btn apple-btn-danger"
                                                style={{ marginBottom: '24px', padding: '10px 20px', fontSize: '14px' }}
                                            >
                                                <Trash2 size={16} /> Cancelar Donación
                                            </button>
                                        )}

                                        {don.assigned_to && (
                                            <div style={{ background: '#2c2c2e', padding: '16px', borderRadius: '16px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <p style={{ margin: '0 0 12px 0', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>Receptor</p>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '44px', height: '44px', background: 'var(--accent-donor)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '18px', borderRadius: '50%' }}>
                                                        {don.assigned_to.username[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <Link to={`/usuario/${don.assigned_to.username}`} style={{ textDecoration: 'none', color: '#fff', fontWeight: 700, fontSize: '16px' }}>@{don.assigned_to.username}</Link>
                                                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>{don.assigned_to.profile?.faculty || 'Facultad no especificada'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {receiverRatingToMe && (
                                            <div style={{ marginBottom: '24px' }}>
                                                <p style={{ margin: '0 0 10px', fontSize: '15px', fontWeight: 600 }}>Calificación Recibida:</p>
                                                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '16px', borderLeft: '3px solid var(--accent-donor)' }}>
                                                    <div style={{ display: 'flex', gap: '3px', marginBottom: '8px' }}>
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={14} fill={i < receiverRatingToMe.stars ? "var(--accent-donor)" : "none"} color={i < receiverRatingToMe.stars ? "var(--accent-donor)" : "#424245"} />
                                                        ))}
                                                    </div>
                                                    <p style={{ margin: 0, fontStyle: 'italic', fontSize: '14px', color: 'var(--text-main)', lineHeight: 1.5 }}>"{receiverRatingToMe.comment || 'Sin comentario'}"</p>
                                                </div>
                                            </div>
                                        )}

                                        {don.status === 'Accepted' && don.evidence && !myRatingToReceiver && (
                                            <div style={{ background: '#2c2c2e', padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                {ratingForm.donationId === don.id ? (
                                                    <form onSubmit={handleRateUser}>
                                                        <p style={{ fontWeight: 700, marginBottom: '16px', fontSize: '15px' }}>Califica al estudiante:</p>
                                                        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                                                            {[1, 2, 3, 4, 5].map(star => (
                                                                <Star
                                                                    key={star}
                                                                    size={28}
                                                                    style={{ cursor: 'pointer' }}
                                                                    fill={star <= ratingForm.stars ? 'var(--accent-donor)' : 'none'}
                                                                    color={star <= ratingForm.stars ? 'var(--accent-donor)' : '#424245'}
                                                                    onClick={() => setRatingForm({ ...ratingForm, stars: star })}
                                                                />
                                                            ))}
                                                        </div>
                                                        <textarea
                                                            className="form-input"
                                                            style={{ minHeight: '100px', marginBottom: '20px', background: '#1c1c1e' }}
                                                            placeholder="¿El estudiante fue puntual?"
                                                            value={ratingForm.comment}
                                                            onChange={(e) => setRatingForm({ ...ratingForm, comment: e.target.value })}
                                                        />
                                                        <div style={{ display: 'flex', gap: '12px' }}>
                                                            <button type="submit" disabled={submittingRating} className="apple-btn apple-btn-donor" style={{ flex: 1, fontWeight: 700 }}>
                                                                {submittingRating ? 'Enviando...' : 'Calificar'}
                                                            </button>
                                                            <button type="button" onClick={() => setRatingForm({ ...ratingForm, donationId: null })} className="apple-btn apple-btn-secondary">
                                                                Cancelar
                                                            </button>
                                                        </div>
                                                    </form>
                                                ) : (
                                                    <button onClick={() => setRatingForm({ ...ratingForm, donationId: don.id })} className="apple-btn apple-btn-donor" style={{ width: '100%', fontWeight: 700 }}>
                                                        <Star size={18} /> Calificar Estudiante
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {myRatingToReceiver && (
                                            <div style={{ marginTop: '16px' }}>
                                                <p style={{ margin: '0 0 10px', fontSize: '15px', fontWeight: 600 }}>Tu Calificación:</p>
                                                <div style={{ display: 'flex', gap: '3px', marginBottom: '8px' }}>
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={14} fill={i < myRatingToReceiver.stars ? "#fff" : "none"} color={i < myRatingToReceiver.stars ? "#fff" : "#424245"} />
                                                    ))}
                                                </div>
                                                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>"{myRatingToReceiver.comment || 'Sin comentario'}"</p>
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '240px' }}>
                                        <div>
                                            <p style={{ fontSize: '11px', fontWeight: 800, marginBottom: '12px', textAlign: 'center', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>QR SUBIDO</p>
                                            <img src={formatImageUrl(don.image)} alt="QR" style={{ width: '100%', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', padding: '6px', background: '#fff' }} />
                                        </div>

                                        {don.status === 'Accepted' && (
                                            <div>
                                                <p style={{ fontSize: '11px', fontWeight: 800, marginBottom: '12px', textAlign: 'center', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>EVIDENCIA</p>
                                                {don.evidence ? (
                                                    <a href={formatImageUrl(don.evidence.image)} target="_blank" rel="noreferrer" style={{ display: 'block' }}>
                                                        <img src={formatImageUrl(don.evidence.image)} alt="Evidencia" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '16px', border: '2px solid var(--accent-green)', cursor: 'pointer' }} />
                                                    </a>
                                                ) : (
                                                    <div style={{ height: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#1c1c1e', borderRadius: '16px', color: 'var(--text-muted)', border: '1px dashed rgba(255,255,255,0.1)', padding: '24px', textAlign: 'center' }}>
                                                        <Camera size={28} style={{ marginBottom: '12px', opacity: 0.5 }} />
                                                        <p style={{ fontSize: '12px', margin: 0, lineHeight: 1.4 }}>Esperando foto del receptor...</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="glass-card" style={{ padding: '80px 40px', textAlign: 'center' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.05)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
                        <Gift size={40} color="var(--text-muted)" />
                    </div>
                    <p style={{ marginBottom: '32px', fontSize: '20px', color: 'var(--text-secondary)' }}>Aún no has donado ningún código.</p>
                    <Link to="/donar" className="apple-btn apple-btn-donor" style={{ padding: '16px 48px', fontSize: '17px', fontWeight: 700 }}>
                        Hacer mi primera donación
                    </Link>
                </div>
            )}
        </div>
    );
}
