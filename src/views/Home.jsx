import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Share2, Clock, CheckCircle } from 'lucide-react';
import axios from 'axios';

export default function Home({ user }) {
    const [topDonors, setTopDonors] = useState([]);

    useEffect(() => {
        // Top donors implementation
        axios.get('http://localhost:8000/api/codigos/top-donors/')
            .then(res => setTopDonors(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="flex-center animate-fade-in" style={{ flexDirection: 'column', gap: '3rem' }}>

            {/* Hero Section */}
            <section className="glass-panel text-center delay-1" style={{ padding: '4rem 2rem', width: '100%', maxWidth: '800px' }}>
                <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Comparte Tu Código</h1>
                <p className="text-muted" style={{ fontSize: '1.25rem', marginBottom: '2.5rem' }}>
                    Ayuda a evitar que los códigos QR de las becas alimentarias se desperdicien. Dona el tuyo o únete a la fila para recibir uno.
                </p>

                <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                    <Link to="/donar" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                        <Share2 /> Donar Código
                    </Link>
                    <a href="#comedores" className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                        <Clock /> Recibir Código
                    </a>
                </div>
            </section>

            {/* Comedores Section */}
            <section id="comedores" className="container delay-2" style={{ padding: '0' }}>
                <h2 className="text-gradient text-center" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Selecciona tu Comedor para Recibir</h2>
                <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                    {['Pabellon', 'Cafe Terraza', 'Cafesin', 'Islas'].map(comedor => (
                        <div key={comedor} className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{comedor}</h3>
                            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Unirse a la fila de espera o ver turnos.</p>
                            <Link to={`/codigos/${comedor.toLowerCase().replace(' ', '-')}`} className="btn btn-secondary w-full">
                                Ver Fila de Espera
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* Top Donors Section */}
            <section className="glass-panel container delay-3" style={{ padding: '2.5rem' }}>
                <h2 className="text-gradient text-center" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Top 10 Donadores</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Posición</th>
                                <th>Usuario</th>
                                <th>Códigos Donados</th>
                                <th>Facultad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topDonors.length > 0 ? topDonors.map((donor, idx) => (
                                <tr key={donor.hash_id}>
                                    <td>
                                        <span className="badge badge-purple">#{idx + 1}</span>
                                    </td>
                                    <td>
                                        <Link to={`/usuario/${donor.user.username}`} className="text-main" style={{ textDecoration: 'none', fontWeight: '500' }}>
                                            {donor.user.username}
                                        </Link>
                                    </td>
                                    <td><span className="badge badge-green">{donor.donated_count} donaciones</span></td>
                                    <td className="text-muted">{donor.faculty || 'Sin Especificar'}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="text-center text-muted" style={{ padding: '2rem' }}>Aún no hay donadores. ¡Sé el primero!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Detailed Info Section */}
            <section className="container delay-3" style={{ padding: '4rem 1rem', maxWidth: '900px' }}>
                <div className="glass-panel" style={{ padding: '3rem' }}>
                    <h2 className="text-gradient text-center mb-4">¿Cómo funciona LaTaGer Códigos?</h2>
                    <p className="text-muted text-center mb-5" style={{ fontSize: '1.1rem' }}>
                        En la UNAM, la beca de alimentos es vital, pero a veces el comedor asignado queda lejos o no tienes tiempo.
                        Nuestra app conecta a quienes no usarán su código con quienes lo necesitan, asegurando que nadie se quede sin comer.
                    </p>

                    <div className="grid-2" style={{ gap: '3rem' }}>
                        <div>
                            <h3 className="flex-center" style={{ justifyContent: 'flex-start', gap: '10px', marginBottom: '1rem' }}>
                                <Share2 className="text-primary" size={24} /> Para Donadores
                            </h3>
                            <ul className="text-muted" style={{ paddingLeft: '1.2rem', lineHeight: '1.6' }}>
                                <li className="mb-2">Sube una captura de tu código QR y selecciona el comedor.</li>
                                <li className="mb-2"><strong>Beneficios:</strong> Aparece en el Top de Donadores y recibe calificaciones positivas.</li>
                                <li className="mb-2">Recibirás un correo cuando alguien acepte tu código y cuando suban la evidencia.</li>
                                <li>Podrás calificar al receptor y ver las fotos de su comida.</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="flex-center" style={{ justifyContent: 'flex-start', gap: '10px', marginBottom: '1rem' }}>
                                <Clock className="text-secondary" size={24} /> Para Receptores
                            </h3>
                            <ul className="text-muted" style={{ paddingLeft: '1.2rem', lineHeight: '1.6' }}>
                                <li className="mb-2">Únete a la lista de espera de tu comedor favorito.</li>
                                <li className="mb-2">Cuando sea tu turno, tienes <strong>5 MINUTOS</strong> para aceptar el código.</li>
                                <li className="mb-2">Tras aceptar, verás el QR, el teléfono del donador y sus datos (facultad, estrellas).</li>
                                <li>Debes subir una foto de tu comida para calificar al donador y mantener tu buena reputación.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="alert-box mt-5" style={{ background: 'rgba(0,0,0,0.03)', border: 'none' }}>
                        <p className="text-muted text-center" style={{ margin: 0, fontSize: '0.9rem' }}>
                            Restricción: Solo se permite recibir <strong>un código al día</strong> por usuario para que todos tengan oportunidad.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
