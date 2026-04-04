import React, { useEffect, useRef } from 'react';

const isProd = window.location.hostname.includes('latager.com');
const AUTH_APP_URL = import.meta.env.VITE_AUTH_APP_URL || (isProd ? 'https://autenticacion.latager.com' : 'http://localhost:3000');
const AUTH_APP_CHECK_URL = `${AUTH_APP_URL}/check-session`;

const SessionSync = () => {
    const iframeRef = useRef(null);

    const syncToAuthApp = (token) => {
        if (!iframeRef.current?.contentWindow) return;
        iframeRef.current.contentWindow.postMessage(
            { type: 'SYNC_TOKEN', token: token || null },
            AUTH_APP_URL
        );
    };

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.origin !== AUTH_APP_URL) return;
            const { type, status, token } = event.data;
            if (type !== 'SESSION_STATUS') return;

            const localToken = localStorage.getItem('authToken');
            const isCallbackPage = window.location.pathname.includes('auth-callback') 
                || window.location.pathname.includes('autenticacion-callback');
            if (isCallbackPage) return;

            // Sincronización POSITIVA: Login detectado en central
            if (status === 'active' && token && localToken !== token) {
                console.log("Sincronización SSO: Detectado inicio de sesión.");
                localStorage.setItem('authToken', token);
                setTimeout(() => window.location.reload(), 100);
            }
            
            // Sincronización NEGATIVA: Logout detectado en central
            if (status === 'none' && localToken) {
                console.log("Sincronización SSO: Detectado cierre de sesión.");
                localStorage.removeItem('authToken');
                setTimeout(() => window.location.reload(), 100);
            }
        };

        let channel;
        try {
            channel = new BroadcastChannel('latager_session');
            channel.onmessage = (event) => {
                const { type, token } = event.data;
                if (type === 'SESSION_CHANGE') {
                    const localToken = localStorage.getItem('authToken');
                    if ((token && localToken !== token) || (!token && localToken)) {
                        if (token) localStorage.setItem('authToken', token);
                        else localStorage.removeItem('authToken');
                        window.location.reload();
                    }
                }
            };
        } catch(e) {}

        window.addEventListener('message', handleMessage);
        return () => {
            window.removeEventListener('message', handleMessage);
            if (channel) channel.close();
        };
    }, []);

    const handleIframeLoad = () => {
        const localToken = localStorage.getItem('authToken');
        if (localToken) {
            syncToAuthApp(localToken);
        }
    };

    return (
        <iframe
            ref={iframeRef}
            src={AUTH_APP_CHECK_URL}
            style={{ display: 'none' }}
            title="SSO Sync"
            onLoad={handleIframeLoad}
        />
    );
};

export default SessionSync;
