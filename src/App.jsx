import React, { useState, useEffect } from 'react';
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
import GoogleCallbackPage from './views/GoogleCallbackPage';
import SetUsername from './views/SetUsername';
import { Toaster } from 'react-hot-toast';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      axios.get('http://localhost:8000/api/codigos/me/', {
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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout user={user} />}>
            <Route index element={<Home user={user} />} />
            <Route path="codigos/:comedor" element={<ComedorWaitlist user={user} />} />
            <Route path="usuario/:username" element={<UserProfile />} />
            <Route path="donar" element={<Donate user={user} />} />
            <Route path="turno" element={<ActiveTurn user={user} />} />
            <Route path="evidencia/:donationId" element={<EvidenceRating user={user} />} />
            <Route path="autenticacion" element={<Auth />} />
            <Route path="autenticacion/google_callback_backend" element={<GoogleCallbackPage />} />
            <Route path="set-username" element={<SetUsername />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
