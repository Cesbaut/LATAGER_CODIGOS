import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, CheckCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Donate({ user }) {
    const [comedor, setComedor] = useState('Pabellon');
    const [phone, setPhone] = useState('');
    const [image, setImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) { alert('Sube la imagen del QR'); return; }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('comedor', comedor);
        formData.append('image', image);
        if (phone) formData.append('phone', phone); // Optional

        const token = localStorage.getItem('authToken');
        try {
            await axios.post('http://localhost:8000/api/codigos/donations/', formData, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Código donado exitosamente! Se notificará cuando sea recibido.');
            navigate('/');
        } catch (error) {
            alert('Error donando código.');
            console.error(error);
        }
        setIsSubmitting(false);
    };

    if (!user) {
        return (
            <div className="glass-panel text-center animate-fade-in" style={{ padding: '4rem 2rem', maxWidth: '600px', margin: '0 auto' }}>
                <h2 className="text-gradient mb-4">Requiere Autenticación</h2>
                <p className="text-muted mb-4">Para poder donar códigos QR necesitas iniciar sesión, esto para entrar al top y evitar usos maliciosos.</p>
                <Link to="/autenticacion" className="btn btn-primary">Ir a Iniciar Sesión</Link>
            </div>
        );
    }

    return (
        <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="glass-panel" style={{ padding: '3rem' }}>
                <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'center' }}>
                    Donar Código de Alimentos
                </h1>
                <p className="text-muted text-center" style={{ marginBottom: '2.5rem' }}>
                    Sube la captura de pantalla de tu código QR de UNAM.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Comedor del QR</label>
                        <select className="form-select" value={comedor} onChange={(e) => setComedor(e.target.value)}>
                            <option value="Pabellon">Pabellón</option>
                            <option value="Cafe Terraza">Café Terraza</option>
                            <option value="Cafesin">Cafesin</option>
                            <option value="Islas">Islas</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Teléfono (Opcional - Para comunicación rápida)</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. 555-555-5555"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <div className="form-group" style={{ marginTop: '1.5rem', marginBottom: '2.5rem' }}>
                        <label className="form-label mb-2">Imagen del Código QR</label>
                        <div style={{
                            border: '2px dashed var(--border)',
                            borderRadius: '12px',
                            padding: '2rem',
                            textAlign: 'center',
                            cursor: 'pointer',
                            background: 'rgba(0,0,0,0.2)'
                        }} onClick={() => document.getElementById('fileUpload').click()}>
                            {image ? (
                                <div style={{ color: 'var(--secondary)' }}>
                                    <CheckCircle size={40} style={{ margin: '0 auto 1rem' }} />
                                    <p>{image.name}</p>
                                </div>
                            ) : (
                                <div className="text-muted">
                                    <UploadCloud size={40} style={{ margin: '0 auto 1rem' }} />
                                    <p>Haz clic para subir la captura de pantalla</p>
                                </div>
                            )}
                            <input
                                id="fileUpload"
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting} style={{ width: '100%' }}>
                        {isSubmitting ? 'Procesando...' : 'Donar Código'}
                    </button>
                </form>
            </div>
        </div>
    );
}
