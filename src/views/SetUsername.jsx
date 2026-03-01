import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:8000';

const SetUsername = () => {
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username.trim()) return;

        setIsLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            await axios.post(`${API_URL}/autenticacion/user/update/`,
                { username: username.trim() },
                { headers: { Authorization: `Token ${token}` } }
            );
            toast.success('¡Nombre de usuario actualizado!');
            navigate('/');
            setTimeout(() => window.location.reload(), 100);
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Error al actualizar el usuario';
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-center animate-fade-in" style={{ height: '80vh', padding: '1rem' }}>
            <div className="glass-panel text-center" style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem' }}>
                <h2 className="text-gradient mb-3" style={{ fontSize: '1.8rem' }}>Bienvenido</h2>
                <p className="text-muted mb-4">Elige un nombre de usuario para continuar.</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            className="form-input text-center"
                            type="text"
                            placeholder="tu_usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-full" disabled={!username.trim() || isLoading} style={{ marginTop: '1rem' }}>
                        {isLoading ? 'Guardando...' : 'Comenzar ahora'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SetUsername;
