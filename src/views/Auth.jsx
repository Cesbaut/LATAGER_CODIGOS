import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:8000';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // User Form State
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [faculty, setFaculty] = useState('FI');

    const navigate = useNavigate();

    const GOOGLE_START_URL = `${API_URL}/autenticacion/google_login_start/`;

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axios.post(`${API_URL}/autenticacion/login/`, { username, password });
            localStorage.setItem('authToken', res.data.token);
            toast.success('¡Sesión iniciada correctamente!');
            setTimeout(() => {
                navigate('/');
                window.location.reload(); // Refresh to update Layout user state
            }, 1000);
        } catch (err) {
            let errorMsg = "Credenciales incorrectas o error de conexión.";
            if (err.response?.data?.detail) errorMsg = err.response.data.detail;
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== passwordConfirm) {
            toast.error("Las contraseñas no coinciden.");
            return;
        }
        setIsLoading(true);
        try {
            const res = await axios.post(`${API_URL}/autenticacion/register/`, {
                username, email, password, facultad: faculty
            });
            localStorage.setItem('authToken', res.data.token);
            toast.success("¡Cuenta creada exitosamente!");
            setTimeout(() => {
                navigate('/');
                window.location.reload();
            }, 1000);
        } catch (err) {
            let errorMsg = "Error al crear la cuenta.";
            if (err.response?.data) {
                const data = err.response.data;
                const errors = Object.values(data).flat();
                if (errors.length > 0) errorMsg = errors[0];
            }
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-center animate-fade-in" style={{ padding: '2rem', minHeight: '80vh' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
                <h2 className="text-gradient text-center" style={{ fontSize: '2rem', marginBottom: '2rem' }}>
                    {isLogin ? 'Iniciar Sesión' : 'Registro'}
                </h2>

                <a href={GOOGLE_START_URL} className="btn w-full mb-4" style={{ background: 'white', color: '#333', border: '1px solid #ddd', display: 'flex', justifyContent: 'center' }}>
                    <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" width="18" height="18" style={{ marginRight: '8px' }}>
                        <path fill="#EA4335" d="M9 3.48c1.69 0 2.84.73 3.49 1.34l2.37-2.3C13.55.93 11.43 0 9 0 5.48 0 2.44 2.02 1 4.96l2.88 2.24C4.55 5.08 6.62 3.48 9 3.48z" />
                        <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.18-1.84H9v3.48h4.84c-.21 1.12-.84 2.07-1.79 2.71v2.25h2.9c1.7-1.57 2.69-3.89 2.69-6.6z" />
                        <path fill="#FBBC05" d="M3.88 10.84A5.41 5.41 0 0 1 3.56 9c0-.64.11-1.26.31-1.84L1 4.96A9 9 0 0 0 0 9c0 1.43.34 2.79.94 4l2.94-2.16z" />
                        <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.25c-.8.54-1.82.86-3.06.86-2.35 0-4.33-1.59-5.04-3.73L1 13.04C2.44 15.98 5.48 18 9 18z" />
                    </svg>
                    Continuar con Google
                </a>

                <div className="text-center text-muted mb-4" style={{ fontSize: '0.9rem' }}>
                    o usa tu correo institucional
                </div>

                <form onSubmit={isLogin ? handleLogin : handleRegister}>
                    <div className="form-group">
                        <input
                            className="form-input"
                            type="text"
                            placeholder="Nombre de usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <input
                                className="form-input"
                                type="email"
                                placeholder="Correo institucional"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    <div className="form-group" style={{ position: 'relative' }}>
                        <input
                            className="form-input"
                            type={showPassword ? "text" : "password"}
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {!isLogin && (
                        <>
                            <div className="form-group">
                                <input
                                    className="form-input"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Confirmar contraseña"
                                    value={passwordConfirm}
                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label text-muted" style={{ fontSize: '0.9rem' }}>Facultad</label>
                                <select className="form-select" value={faculty} onChange={(e) => setFaculty(e.target.value)}>
                                    <option value="FI">Ingeniería</option>
                                    <option value="FCA">Contaduría y Adm.</option>
                                    <option value="FC">Ciencias</option>
                                    <option value="FQ">Química</option>
                                    <option value="FD">Derecho</option>
                                    <option value="FM">Medicina</option>
                                    <option value="FA">Arquitectura</option>
                                    <option value="FP">Psicología</option>
                                    <option value="FFyL">Filosofía y Letras</option>
                                    <option value="FCPyS">Ciencias Políticas</option>
                                    <option value="FO">Odontología</option>
                                    <option value="FMVZ">Medicina Veterinaria</option>
                                    <option value="OTRO">Otra</option>
                                </select>
                            </div>
                        </>
                    )}

                    <button type="submit" className="btn btn-primary w-full" disabled={isLoading} style={{ marginTop: '1rem' }}>
                        {isLoading ? 'Cargando...' : isLogin ? <><LogIn size={18} /> Entrar</> : <><UserPlus size={18} /> Registrarse</>}
                    </button>
                </form>

                <div className="text-center mt-4" style={{ marginTop: '1.5rem' }}>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-muted"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        {isLogin ? "¿No tienes cuenta? Regístrate aquí" : "¿Ya tienes cuenta? Inicia sesión"}
                    </button>
                </div>
            </div>
        </div>
    );
}
