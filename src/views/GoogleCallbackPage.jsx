import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const GoogleCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        const isNew = searchParams.get('is_new');

        if (token) {
            localStorage.setItem('authToken', token);

            if (isNew === 'true') {
                navigate('/set-username');
            } else {
                navigate('/');
                setTimeout(() => window.location.reload(), 100);
            }
        } else {
            console.error("No token found in URL");
            navigate('/autenticacion');
        }
    }, [searchParams, navigate]);

    return (
        <div className="flex-center animate-fade-in" style={{ height: '80vh' }}>
            <div className="text-muted" style={{ fontSize: '1.2rem' }}>
                Procesando inicio de sesión con Google...
            </div>
        </div>
    );
};

export default GoogleCallbackPage;
