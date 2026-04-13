import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Utensils, QrCode, LogOut, LogIn, Gift, User as UserIcon } from 'lucide-react';

import Logo from '../assets/lata';

export default function Layout({ user }) {
    const location = useLocation();
    const COMEDORES = ['Pabellon', 'Cafe Terraza', 'Cafesin', 'Islas'];

    return (
        <div style={{ backgroundColor: '#000000', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header className="nav-container">
                <div className="nav-content">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                        <Link to="/" style={{
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <Logo style={{ color: '#ffcc00', width: '30px', height: '30px' }} />
                            <div style={{ display: 'flex', gap: '4px', alignItems: 'baseline' }}>
                                <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.3px' }}>Latager</span>
                                <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'rgba(255,255,255,0.4)', letterSpacing: '-0.3px' }}>Códigos</span>
                            </div>
                        </Link>

                        <nav className="nav-links desktop-only" style={{ display: 'flex', gap: '24px' }}>
                            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                                Inicio
                            </Link>
                            {COMEDORES.map(c => (
                                <Link
                                    key={c}
                                    to={`/codigos/${c.toLowerCase().replace(' ', '-')}`}
                                    className={`nav-link ${location.pathname.includes(c.toLowerCase()) ? 'active' : ''}`}
                                >
                                    {c}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        {user ? (
                            <>
                                <Link to="/turno" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <QrCode size={18} />
                                    <span className="desktop-only">Mi Turno</span>
                                </Link>
                                <Link to="/mis-donaciones" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Gift size={18} />
                                    <span className="desktop-only">Donar</span>
                                </Link>
                                <div className="desktop-only" style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                                <Link to={`/usuario/${user.username}`} className="apple-btn apple-btn-secondary" style={{ padding: '8px 16px', fontSize: '12px' }}>
                                    <UserIcon size={14} />
                                    <span>{user.username}</span>
                                </Link>
                                <button
                                    onClick={() => {
                                        localStorage.removeItem('authToken');
                                        const isProd = window.location.hostname.includes('latager.com');
                                        const authUrl = import.meta.env.VITE_AUTH_APP_URL || (isProd ? 'https://autenticacion.latager.com' : 'http://localhost:3000');
                                        window.location.href = `${authUrl}/logout?redirect_uri=${encodeURIComponent(window.location.origin)}`;
                                    }}
                                    className="apple-btn"
                                    style={{ padding: '8px', background: 'transparent', opacity: 0.6 }}
                                >
                                    <LogOut size={18} color="white" />
                                </button>
                            </>
                        ) : (
                            <Link to="/autenticacion" className="apple-btn apple-btn-primary" style={{ padding: '8px 20px', fontSize: '13px', fontWeight: 600 }}>
                                <LogIn size={15} />
                                <span>Entrar</span>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <main style={{ flex: 1 }}>
                <Outlet />
            </main>

            <footer style={{
                padding: '80px 24px 40px',
                textAlign: 'center',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                backgroundColor: '#000000'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <p style={{ color: '#86868b', fontSize: '14px' }}>
                        © 2026 LaTaGer. Plataforma de Apoyo Estudiantil UNAM.
                    </p>
                    <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '24px' }}>
                        <a href="#" className="nav-link" style={{ fontSize: '12px' }}>Privacidad</a>
                        <a href="#" className="nav-link" style={{ fontSize: '12px' }}>Términos</a>
                        <a href="#" className="nav-link" style={{ fontSize: '12px' }}>Contacto</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
