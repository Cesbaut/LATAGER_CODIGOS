import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Camera, Star, Send, CheckCircle, Loader2, MessageSquare, Utensils } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:8000';

export default function EvidenceRating() {
    const { donationId } = useParams();
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [donorId, setDonorId] = useState(null);
    const [evidenceId, setEvidenceId] = useState(null);
    const [ratingId, setRatingId] = useState(null);
    const [isLoadingExisting, setIsLoadingExisting] = useState(true);

    useEffect(() => {
        const fetchExisting = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const res = await axios.get(`${API_URL}/api/codigos/donations/${donationId}/`, {
                    headers: { Authorization: `Token ${token}` }
                });

                const donationData = res.data;
                setDonorId(donationData.donor.id);

                // If evidence already exists
                if (donationData.evidence) {
                    setEvidenceId(donationData.evidence.id);
                    const evidenceImg = donationData.evidence.image;
                    setPreview(evidenceImg.startsWith('http') ? evidenceImg : `${API_URL}${evidenceImg}`);
                }

                // If rating already exists
                const existingRating = donationData.ratings?.find(r => r.from_user.id === donationData.assigned_to?.id);
                if (existingRating) {
                    setRatingId(existingRating.id);
                    setRating(existingRating.stars);
                    setComment(existingRating.comment || '');
                }
            } catch (err) {
                console.error("Error fetching donation/existing evidence:", err);
                toast.error("No se pudo cargar la información de la donación.");
            } finally {
                setIsLoadingExisting(false);
            }
        };

        fetchExisting();
    }, [donationId]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!evidenceId && !image) {
            toast.error("Por favor, sube una foto de tu comida como evidencia.");
            return;
        }

        if (!donorId) {
            toast.error("No se pudo obtener la información del donador para la calificación.");
            return;
        }

        setIsSubmitting(true);
        const token = localStorage.getItem('authToken');
        const formData = new FormData();
        formData.append('donation', donationId);
        formData.append('image', image);

        try {
            if (image) {
                const url = evidenceId ? `${API_URL}/api/codigos/evidence/${evidenceId}/` : `${API_URL}/api/codigos/evidence/`;
                const method = evidenceId ? 'patch' : 'post';

                await axios({
                    method,
                    url,
                    data: formData,
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            const ratingPayload = {
                donation: donationId,
                stars: rating,
                comment: comment,
                to_user: donorId,
            };

            const ratingUrl = ratingId ? `${API_URL}/api/codigos/ratings/${ratingId}/` : `${API_URL}/api/codigos/ratings/`;
            const ratingMethod = ratingId ? 'patch' : 'post';

            await axios({
                method: ratingMethod,
                url: ratingUrl,
                data: ratingPayload,
                headers: { Authorization: `Token ${token}` }
            });

            setIsSuccess(true);
            toast.success(ratingId ? "¡Actualizado con éxito!" : "¡Evidencia enviada y calificación registrada!");
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            console.error(err);
            toast.error("Hubo un error al enviar la información.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingExisting) return (
        <div className="container flex-center" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <Loader2 size={40} className="animate-spin" color="var(--accent-primary)" />
                <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Cargando...</p>
            </div>
        </div>
    );

    if (isSuccess) {
        return (
            <div className="container animate-up" style={{ maxWidth: '600px', margin: '80px auto' }}>
                <div className="glass-card" style={{ padding: '64px 32px', textAlign: 'center' }}>
                    <div style={{ background: 'rgba(48, 209, 88, 0.1)', width: '80px', height: '80px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
                        <CheckCircle size={40} color="var(--accent-green)" />
                    </div>
                    <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px', color: '#fff' }}>¡Todo listo!</h2>
                    <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.5 }}>
                        Gracias por ayudar a que la comunidad sea confiable. Tu evidencia ha sido guardada.
                    </p>
                    <button onClick={() => navigate('/')} className="apple-btn apple-btn-primary" style={{ padding: '16px 48px', fontSize: '17px' }}>
                        Volver al Inicio
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container animate-up" style={{ maxWidth: '640px', margin: '40px auto' }}>
            <div className="glass-card" style={{ padding: '48px 40px' }}>
                <header style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '12px', color: '#fff' }}>
                        Evidencia y Calificación
                    </h1>
                    <p style={{ fontSize: '17px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        Ayuda al donador a saber que su código fue bien aprovechado subiendo una foto de tu comida.
                    </p>
                </header>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                    {/* Visual Evidence Area */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', marginLeft: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <Camera size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                            Foto de tu comida
                        </label>
                        <div
                            style={{
                                border: preview ? '2px solid var(--accent-primary)' : '2px dashed rgba(255, 255, 255, 0.1)',
                                borderRadius: '24px',
                                padding: preview ? '12px' : '64px 24px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                background: 'rgba(255, 255, 255, 0.02)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                overflow: 'hidden',
                                position: 'relative'
                            }}
                            onClick={() => document.getElementById('fileEvidence').click()}
                        >
                            {preview ? (
                                <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden' }}>
                                    <img
                                        src={preview}
                                        alt="Evidencia"
                                        style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '400px', objectFit: 'contain' }}
                                    />
                                    <div style={{
                                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                        background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        opacity: 0, transition: 'opacity 0.2s'
                                    }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                                        <div className="apple-btn apple-btn-secondary" style={{ padding: '10px 20px', fontSize: '14px' }}>
                                            Cambiar Foto
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ color: 'var(--text-secondary)' }}>
                                    <div style={{ background: 'rgba(255, 214, 10, 0.1)', width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                                        <Camera size={32} color="var(--accent-primary)" />
                                    </div>
                                    <p style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>Subir foto de la comida</p>
                                    <p style={{ fontSize: '14px' }}>Haz clic aquí para seleccionar una imagen</p>
                                </div>
                            )}
                            <input id="fileEvidence" type="file" hidden accept="image/*" onChange={handleImageChange} />
                        </div>
                    </div>

                    {/* Rating Selection */}
                    <div style={{ textAlign: 'center', background: '#2c2c2e', padding: '32px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>
                            ¿Qué tan bueno fue el código?
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <Star
                                    key={star}
                                    size={40}
                                    style={{
                                        cursor: 'pointer',
                                        fill: star <= rating ? 'var(--accent-primary)' : 'none',
                                        color: star <= rating ? 'var(--accent-primary)' : '#424245',
                                        transition: 'transform 0.2s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                    onClick={() => setRating(star)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Detailed Comment */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', marginLeft: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <MessageSquare size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                            Añade un comentario (Opcional)
                        </label>
                        <textarea
                            className="form-input"
                            style={{ minHeight: '120px', background: '#1c1c1e', paddingTop: '16px' }}
                            placeholder="¿El código funcionó bien? ¿Qué tal estuvo la comida?"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="apple-btn apple-btn-primary"
                        disabled={isSubmitting || isLoadingExisting}
                        style={{ height: '60px', fontSize: '18px', fontWeight: 800, marginTop: '8px' }}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin" size={20} /> Enviando...
                            </>
                        ) : (
                            <>{ratingId ? 'Actualizar Información' : 'Enviar Todo'}</>
                        )}
                    </button>

                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', padding: '0 20px' }}>
                        Tu feedback ayuda a mantener la integridad de LaTaGer. ¡Gracias por participar!
                    </p>
                </form>
            </div>
        </div>
    );
}

