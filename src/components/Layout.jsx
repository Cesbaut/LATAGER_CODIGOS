import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Utensils, QrCode, LogOut, LogIn, Gift, User as UserIcon } from 'lucide-react';

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
                            gap: '10px'
                        }}>
                            <div style={{
                                background: '#ffd60a',
                                borderRadius: '8px',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Utensils size={18} color="black" />
                            </div>
                            <span style={{
                                fontSize: '20px',
                                fontWeight: 700,
                                letterSpacing: '-0.03em',
                                color: '#ffffff'
                            }}>LaTaGer</span>
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
                                        window.location.reload();
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
