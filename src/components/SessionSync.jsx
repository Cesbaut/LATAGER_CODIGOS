import React, { useEffect } from 'react';

const AUTH_APP_URL = import.meta.env.VITE_AUTH_APP_URL || 'http://localhost:3000';
const AUTH_APP_CHECK_URL = `${AUTH_APP_URL}/check-session`;

const SessionSync = () => {
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.origin !== AUTH_APP_URL) return;

            const { type, status, token } = event.data;

            if (type === 'SESSION_STATUS') {
                const localToken = localStorage.getItem('authToken');

                // Solo sincronizar si hay una sesión activa nueva o diferente
                if (status === 'active' && token && localToken !== token) {
                    localStorage.setItem('authToken', token);
                    window.location.reload();
                }
                // NUNCA borrar sesión local ni reiniciar si status es 'none' 
                // para evitar bucles infinitos por políticas de privacidad del navegador.
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    return (
        <iframe 
            src={AUTH_APP_CHECK_URL} 
            style={{ display: 'none' }} 
            title="SSO Sync"
        />
    );
};

export default SessionSync;
