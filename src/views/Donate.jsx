import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, CheckCircle, Loader2, Smartphone, Utensils, Info } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function Donate({ user }) {
    const navigate = useNavigate();
    const location = useLocation();

    // Initial value from location state if available
    const [comedor, setComedor] = useState(location.state?.comedor || 'Pabellon');
    const [phone, setPhone] = useState('');
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) { toast.error('Por favor, sube la imagen del QR'); return; }

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
            toast.success('¡Código donado exitosamente! Se notificará cuando sea recibido.');
            navigate('/');
        } catch (error) {
            const errorMsg = error.response?.data?.[0] || error.response?.data?.error || 'Error donando código.';
            toast.error(errorMsg);
            console.error(error);
        }
        setIsSubmitting(false);
    };

    if (!user) {
        return (
            <div className="container animate-up" style={{ maxWidth: '600px', margin: '80px auto' }}>
                <div className="glass-card" style={{ padding: '64px 32px', textAlign: 'center' }}>
                    <div style={{ background: 'var(--accent-donor-glass)', width: '80px', height: '80px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
                        <Info size={40} color="var(--accent-donor)" />
                    </div>
                    <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px', color: '#fff' }}>Requiere Autenticación</h2>
                    <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.5 }}>
                        Para poder donar códigos QR necesitas iniciar sesión. Esto nos ayuda a gestionar el ranking y asegurar que la ayuda llegue a todos.
                    </p>
                    <Link to="/autenticacion" className="apple-btn apple-btn-donor" style={{ padding: '16px 48px', fontSize: '17px' }}>
                        Ir a Iniciar Sesión
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container animate-up" style={{ maxWidth: '640px', margin: '40px auto' }}>
            <div className="glass-card" style={{ padding: '48px 40px' }}>
                <header style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '12px', color: '#fff' }}>
                        Donar Código
                    </h1>
                    <p style={{ fontSize: '17px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        Sube la captura de pantalla de tu código QR de UNAM para ayudar a un compañero.
                    </p>
                </header>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        {/* Comedor Select */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', marginLeft: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <Utensils size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                                Comedor
                            </label>
                            <select
                                className="form-input"
                                style={{
                                    appearance: 'none',
                                    background: '#1c1c1e url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'none\' stroke=\'%2386868b\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m3 4 3 3 3-3\'/%3E%3C/svg%3E") no-repeat right 16px center'
                                }}
                                value={comedor}
                                onChange={(e) => setComedor(e.target.value)}
                            >
                                <option value="Pabellon">Pabellón</option>
                                <option value="Cafe Terraza">Café Terraza</option>
                                <option value="Cafesin">Cafesin</option>
                                <option value="Islas">Islas</option>
                            </select>
                        </div>

                        {/* Phone Input */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', marginLeft: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <Smartphone size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                                Teléfono
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Opcional"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Image Upload Area */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', marginLeft: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Captura del QR
                        </label>
                        <div
                            style={{
                                border: image ? '2px solid var(--accent-donor)' : '2px dashed rgba(255, 255, 255, 0.1)',
                                borderRadius: '24px',
                                padding: image ? '12px' : '48px 24px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                background: 'rgba(255, 255, 255, 0.02)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                overflow: 'hidden',
                                position: 'relative'
                            }}
                            onClick={() => document.getElementById('fileUpload').click()}
                            onMouseEnter={e => !image && (e.currentTarget.style.borderColor = 'rgba(255, 159, 10, 0.4)')}
                            onMouseLeave={e => !image && (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
                        >
                            {image ? (
                                <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden' }}>
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '400px', objectFit: 'contain' }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: 0, left: 0, right: 0, bottom: 0,
                                        background: 'rgba(0,0,0,0.4)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        opacity: 0,
                                        transition: 'opacity 0.2s'
                                    }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                                        <div className="apple-btn apple-btn-secondary" style={{ padding: '10px 20px', fontSize: '14px' }}>
                                            Cambiar Imagen
                                        </div>
                                    </div>
                                    <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'var(--accent-donor)', color: '#fff', padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 700 }}>
                                        LISTO
                                    </div>
                                </div>
                            ) : (
                                <div style={{ color: 'var(--text-secondary)' }}>
                                    <div style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        width: '64px', height: '64px',
                                        borderRadius: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 20px auto'
                                    }}>
                                        <UploadCloud size={32} color="var(--accent-donor)" />
                                    </div>
                                    <p style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>Subir captura de pantalla</p>
                                    <p style={{ fontSize: '14px' }}>Formatos aceptados: JPG, PNG o capturas directas</p>
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

                    <button
                        type="submit"
                        className="apple-btn apple-btn-donor"
                        disabled={isSubmitting}
                        style={{ width: '100%', height: '56px', fontSize: '18px', fontWeight: 700, marginTop: '12px' }}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin" size={20} /> Procesando...
                            </>
                        ) : (
                            'Confirmar Donación'
                        )}
                    </button>

                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', padding: '0 20px' }}>
                        Al donar, asegúrate de que el código no haya sido usado previamente. Tu ayuda es invaluable para la comunidad.
                    </p>
                </form>
            </div>
        </div>
    );
}
