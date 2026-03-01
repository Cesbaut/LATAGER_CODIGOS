import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Utensils, QrCode, LogIn, LogOut, Home, User as UserIcon } from 'lucide-react';

export default function Layout({ user }) {
    const location = useLocation();
    const COMEDORES = ['Pabellon', 'Cafe Terraza', 'Cafesin', 'Islas'];

    return (
        <div className="min-h-screen">
            <nav className="glass-panel" style={{ margin: '1rem', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Utensils className="text-gradient" />
                        <h2 className="text-gradient" style={{ margin: 0 }}>LaTaGer Códigos</h2>
                    </Link>

                    <div style={{ display: 'flex', gap: '1rem', marginLeft: '2rem' }}>
                        <Link to="/" className={`btn btn-secondary ${location.pathname === '/' ? 'active' : ''}`} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                            <Home size={18} /> Inicio
                        </Link>
                        {COMEDORES.map(c => (
                            <Link key={c} to={`/codigos/${c.toLowerCase().replace(' ', '-')}`} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                                {c}
                            </Link>
                        ))}
                        <a href="/horarios" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Horarios</a>
                        {user && (
                            <Link to="/turno" className={`btn btn-primary ${location.pathname === '/turno' ? 'active' : ''}`} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', background: 'var(--primary)', color: 'white' }}>
                                <QrCode size={18} /> Mi Turno
                            </Link>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {user ? (
                        <>
                            <Link to={`/usuario/${user.username}`} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                                <UserIcon size={18} /> {user.username}
                            </Link>
                            <button
                                onClick={() => {
                                    localStorage.removeItem('authToken');
                                    window.location.reload();
                                }}
                                className="btn btn-secondary"
                                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                            >
                                <LogOut size={18} /> Salir
                            </button>
                        </>
                    ) : (
                        <Link to="/autenticacion" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                            <LogIn size={18} /> Ingresar
                        </Link>
                    )}
                </div>
            </nav>

            <main className="container animate-fade-in" style={{ padding: '2rem 1.5rem' }}>
                <Outlet />
            </main>
        </div>
    );
}
