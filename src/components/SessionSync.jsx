import React, { useEffect } from 'react';

const isProd = window.location.hostname.includes('latager.com');
const AUTH_APP_URL = import.meta.env.VITE_AUTH_APP_URL || (isProd ? 'https://autenticacion.latager.com' : 'http://localhost:3000');
const AUTH_APP_CHECK_URL = `${AUTH_APP_URL}/check-session`;

const SessionSync = () => {
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.origin !== AUTH_APP_URL) return;

            const { type, status, token } = event.data;

            if (type === 'SESSION_STATUS') {
                const localToken = localStorage.getItem('authToken');

                // Sincronización Positiva: Se inició sesión en otro sitio
                if (status === 'active' && token && localToken !== token) {
                    localStorage.setItem('authToken', token);
                    window.location.reload();
                }
                
                // Sincronización Negativa: Se cerró sesión de forma GLOBAL
                // Solo actuamos si nosotros teníamos sesión y el centro dice que ya no existe
                if (status === 'none' && localToken) {
                    localStorage.removeItem('authToken');
                    window.location.reload();
                }
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
