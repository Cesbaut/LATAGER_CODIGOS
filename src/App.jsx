import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';
import Home from './views/Home';
import ComedorWaitlist from './views/ComedorWaitlist';
import UserProfile from './views/UserProfile';
import Donate from './views/Donate';
import ActiveTurn from './views/ActiveTurn';
import EvidenceRating from './views/EvidenceRating';
import Auth from './views/Auth';
import AuthCallback from './views/AuthCallback';
import GoogleCallbackPage from './views/GoogleCallbackPage';
import SetUsername from './views/SetUsername';
import MyDonations from './views/MyDonations';
import { Toaster } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import SessionSync from './components/SessionSync';

const isProd = window.location.hostname.includes('latager.com');
const API_URL = import.meta.env.VITE_API_URL || (isProd ? 'https://cesbaut33.pythonanywhere.com' : 'http://localhost:8000');

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

const VisitTracker = () => {
    const location = useLocation();
    const path = location.pathname;
  
    useEffect(() => {
      // IMPORTANTE: usamos sessionStorage porque el SSO recarga la página.
      // El useRef se borra al recargar, pero sessionStorage persiste.
      const storageKey = `tracked_${path}`;
      if (sessionStorage.getItem(storageKey)) return;

      // Detectar la sección
      let section = null;
      if (path === '/' || path === '/index.html') {
        section = 'codigos_inicio';
      }
      else if (path.includes('/codigos/')) {
        section = 'codigos_comedor';
      }
  
      if (section) {
        sessionStorage.setItem(storageKey, 'true'); // Bloquear rastro duplicado tras recarga
        // Enviar la petición al backend
        fetch(`${API_URL}/api/stats/track-visit/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ section })
        }).catch(err => console.error("Tracking error", err));
      }
    }, [path]);
  
    return null;
  };

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const isProd = window.location.hostname.includes('latager.com');
      const apiUrl = import.meta.env.VITE_API_URL || (isProd ? 'https://cesbaut33.pythonanywhere.com' : 'http://localhost:8000');
      axios.get(`${apiUrl}/api/codigos/me/`, {
        headers: { Authorization: `Token ${token}` }
      })
        .then(res => {
          setUser({
            ...res.data.user,
            hash_id: res.data.hash_id,
            faculty: res.data.faculty
          });
        })
        .catch(err => {
          console.error("Token invalid or expired", err);
          localStorage.removeItem('authToken');
        });
    }
  }, []);

  return (
    <>
      <Toaster position="bottom-right" />
      <SessionSync />
      <BrowserRouter>
        <ScrollToTop />
        <VisitTracker />
        <Routes>
          <Route path="/" element={<Layout user={user} />}>
            <Route index element={<Home user={user} />} />
            <Route path="codigos/:comedor" element={<ComedorWaitlist user={user} />} />
            <Route path="usuario/:username" element={<UserProfile />} />
            <Route path="donar" element={<Donate user={user} />} />
            <Route path="turno" element={<ActiveTurn user={user} />} />
            <Route path="evidencia/:donationId" element={<EvidenceRating user={user} />} />
            <Route path="autenticacion" element={<Auth />} />
            <Route path="autenticacion-callback" element={<AuthCallback />} />
            <Route path="autenticacion/google_callback_backend" element={<GoogleCallbackPage />} />
            <Route path="set-username" element={<SetUsername />} />
            <Route path="mis-donaciones" element={<MyDonations user={user} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
