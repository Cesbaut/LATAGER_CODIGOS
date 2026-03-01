import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Camera, Star, Send, CheckCircle } from 'lucide-react';
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

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        axios.get(`${API_URL}/api/codigos/donations/${donationId}/`, {
            headers: { Authorization: `Token ${token}` }
        })
            .then(res => {
                setDonorId(res.data.donor.id);
            })
            .catch(err => console.error("Error fetching donor info:", err));
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
        if (!image) {
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
            // 1. Upload Evidence
            await axios.post(`${API_URL}/api/codigos/evidence/`, formData, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            // 2. Post Rating
            await axios.post(`${API_URL}/api/codigos/ratings/`, {
                donation: donationId,
                stars: rating,
                comment: comment,
                to_user: donorId,
            }, {
                headers: { Authorization: `Token ${token}` }
            });

            setIsSuccess(true);
            toast.success("¡Evidencia enviada y calificación registrada!");
            setTimeout(() => navigate('/'), 3000);
        } catch (err) {
            console.error(err);
            toast.error("Hubo un error al enviar la información.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex-center" style={{ height: '70vh', flexDirection: 'column' }}>
                <div className="glass-panel text-center" style={{ padding: '3rem' }}>
                    <CheckCircle size={60} color="#2e7d32" style={{ marginBottom: '1rem' }} />
                    <h2 className="text-gradient">¡Todo listo!</h2>
                    <p className="text-muted">Gracias por ayudar a que la comunidad sea confiable.</p>
                    <button onClick={() => navigate('/')} className="btn btn-primary mt-4">Volver al inicio</button>
                </div>
            </div>
        );
    }

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
            <div className="glass-panel" style={{ maxWidth: '500px', margin: '0 auto', padding: '2.5rem' }}>
                <h1 className="text-gradient text-center mb-4">Evidencia y Calificación</h1>
                <p className="text-muted text-center mb-4">Ayuda al donador a saber que su código fue bien aprovechado subiendo una foto de tu comida.</p>

                <form onSubmit={handleSubmit}>
                    <div className="evidence-upload mb-4">
                        <label className="upload-box" style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: '2rem',
                            border: '2px dashed #ddd',
                            borderRadius: '15px',
                            cursor: 'pointer',
                            background: preview ? `url(${preview}) center/cover no-repeat` : 'rgba(0,0,0,0.02)'
                        }}>
                            {!preview && (
                                <>
                                    <Camera size={40} className="text-muted mb-2" />
                                    <span className="text-muted">Haz clic para subir foto</span>
                                </>
                            )}
                            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                        </label>
                    </div>

                    <div className="rating-section text-center mb-4">
                        <label className="text-muted mb-2 block">¿Qué tan bueno fue el código?</label>
                        <div className="flex-center" style={{ gap: '5px' }}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <Star
                                    key={star}
                                    size={30}
                                    style={{ cursor: 'pointer', fill: star <= rating ? '#FFD700' : 'none', color: star <= rating ? '#FFD700' : '#ccc' }}
                                    onClick={() => setRating(star)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <textarea
                            className="form-input"
                            style={{ minHeight: '100px', paddingTop: '10px' }}
                            placeholder="Añade un comentario (opcional)..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={isSubmitting}
                        style={{ height: '50px', marginTop: '1rem' }}
                    >
                        {isSubmitting ? 'Enviando...' : <><Send size={18} /> Enviar Todo</>}
                    </button>
                </form>
            </div>
        </div>
    );
}
