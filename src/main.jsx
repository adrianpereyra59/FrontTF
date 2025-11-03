// src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import AcceptInvite from './screens/AcceptInvite.jsx';
import api from './utils/api';
import LOCALSTORAGE_KEYS from './constants/localstorage';

const token = localStorage.getItem(LOCALSTORAGE_KEYS.AUTH_TOKEN);
if (token) api.setToken(token);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/accept-invite" element={<AcceptInvite />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
