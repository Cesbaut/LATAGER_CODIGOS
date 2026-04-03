import React, { useEffect } from 'react';

const AUTH_APP_URL = `${import.meta.env.VITE_AUTH_APP_URL || (window.location.hostname.includes('latager.com') ? 'https://autenticacion.latager.com' : 'http://localhost:3000')}/login`;

export default function Auth() {
    useEffect(() => {
        // Redirigir a la aplicación centralizada de autenticación
        const callbackUrl = `${window.location.origin}/autenticacion-callback`;
        const redirectUrl = `${AUTH_APP_URL}?redirect_uri=${encodeURIComponent(callbackUrl)}&from=Latager-Codigos`;
        window.location.replace(redirectUrl);
    }, []);

    return (
        <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="text-center animate-up">
                <div className="apple-spinner mx-auto mb-4"></div>
                <h2 style={{ color: '#fff', fontSize: '24px' }}>Redirigiendo a Latager ID</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Estamos verificando tu identidad de forma centralizada...</p>
            </div>
        </div>
    );
}
