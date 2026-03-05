import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogIn, UserPlus, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
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
                window.location.reload();
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
        <div className="container animate-up" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '48px 32px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ background: 'rgba(0, 113, 227, 0.1)', width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                        {isLogin ? <LogIn color="var(--accent-blue)" size={32} /> : <UserPlus color="var(--accent-blue)" size={32} />}
                    </div>
                    <h2 style={{ fontSize: '32px', marginBottom: '8px', color: '#fff' }}>
                        {isLogin ? 'Bienvenido' : 'Crear Cuenta'}
                    </h2>
                    <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
                        {isLogin ? 'Ingresa tus credenciales para continuar.' : 'Únete a nuestra comunidad universitaria.'}
                    </p>
                </div>

                <a href={GOOGLE_START_URL} className="apple-btn apple-btn-secondary" style={{ width: '100%', marginBottom: '24px', gap: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                        <path fill="#EA4335" d="M9 3.48c1.69 0 2.84.73 3.49 1.34l2.37-2.3C13.55.93 11.43 0 9 0 5.48 0 2.44 2.02 1 4.96l2.88 2.24C4.55 5.08 6.62 3.48 9 3.48z" />
                        <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.18-1.84H9v3.48h4.84c-.21 1.12-.84 2.07-1.79 2.71v2.25h2.9c1.7-1.57 2.69-3.89 2.69-6.6z" />
                        <path fill="#FBBC05" d="M3.88 10.84A5.41 5.41 0 0 1 3.56 9c0-.64.11-1.26.31-1.84L1 4.96A9 9 0 0 0 0 9c0 1.43.34 2.79.94 4l2.94-2.16z" />
                        <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.25c-.8.54-1.82.86-3.06.86-2.35 0-4.33-1.59-5.04-3.73L1 13.04C2.44 15.98 5.48 18 9 18z" />
                    </svg>
                    <span style={{ color: '#fff' }}>Continuar con Google</span>
                </a>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>o usa tu cuenta</span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                </div>

                <form onSubmit={isLogin ? handleLogin : handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                            className="form-input"
                            style={{ paddingLeft: '44px' }}
                            type="text"
                            placeholder="Usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    {!isLogin && (
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                className="form-input"
                                style={{ paddingLeft: '44px' }}
                                type="email"
                                placeholder="Correo institucional"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                            className="form-input"
                            style={{ paddingLeft: '44px', paddingRight: '44px' }}
                            type={showPassword ? "text" : "password"}
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {!isLogin && (
                        <>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input
                                    className="form-input"
                                    style={{ paddingLeft: '44px' }}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Confirmar contraseña"
                                    value={passwordConfirm}
                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginLeft: '4px' }}>Facultad</label>
                                <select
                                    className="form-input"
                                    style={{ appearance: 'none', background: '#1c1c1e url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'none\' stroke=\'%2386868b\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m3 4 3 3 3-3\'/%3E%3C/svg%3E") no-repeat right 16px center' }}
                                    value={faculty}
                                    onChange={(e) => setFaculty(e.target.value)}
                                >
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

                    <button type="submit" className="apple-btn apple-btn-primary" disabled={isLoading} style={{ width: '100%', marginTop: '16px', height: '48px', fontSize: '16px', fontWeight: 600 }}>
                        {isLoading ? 'Cargando...' : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '32px' }}>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-blue)', fontWeight: 500, fontSize: '15px' }}
                    >
                        {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Entra"}
                    </button>
                </div>
            </div>
        </div>
    );
}
