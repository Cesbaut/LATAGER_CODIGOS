import React, { useEffect } from 'react';

const AUTH_APP_CHECK_URL = 'http://localhost:3000/check-session';

const SessionSync = () => {
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.origin !== 'http://localhost:3000') return;

            const { type, status, token } = event.data;

            if (type === 'SESSION_STATUS') {
                const localToken = localStorage.getItem('authToken');

                if (status === 'none' && localToken) {
                    localStorage.removeItem('authToken');
                    window.location.reload();
                } else if (status === 'active' && token && localToken !== token) {
                    localStorage.setItem('authToken', token);
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
