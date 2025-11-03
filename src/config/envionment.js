// src/config/envionment.js
const ENVIRONMENT = {
  API_URL: import.meta.env.VITE_API_URL || import.meta.env.VITE_APP_URL_API || import.meta.env.URL_API_BACKEND || 'http://localhost:8080',
  FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173'
};

export default ENVIRONMENT;