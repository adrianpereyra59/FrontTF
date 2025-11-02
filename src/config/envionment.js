const ENVIRONMENT = {
  // Usamos VITE_API_URL preferentemente, pero soportamos el older VITE_APP_URL_API como fallback
  API_URL: import.meta.env.VITE_API_URL || import.meta.env.VITE_APP_URL_API || 'http://localhost:8080',
  FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:3000',
};

export default ENVIRONMENT;