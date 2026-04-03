import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        const status = searchParams.get('status');

        if (status === 'success' && token) {
            localStorage.setItem('authToken', token);
            toast.success("¡Sesión sincronizada!");
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } else {
            toast.error("Fallo al autenticar.");
            navigate('/autenticacion');
        }
    }, [searchParams, navigate]);

    return (
        <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="text-center animate-up">
                <div className="apple-spinner mx-auto mb-4"></div>
                <h2 style={{ color: '#fff', fontSize: '24px' }}>Sincronizando...</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Estamos estableciendo la sesión segura para Latager Codigos.</p>
            </div>
        </div>
    );
};

export default AuthCallback;
