// Wrapper HTTP para frontend — usa VITE_API_URL / VITE_APP_URL_API / URL_API_BACKEND como posibles sources
import LOCALSTORAGE_KEYS from '../constants/localstorage';

const BASE = import.meta.env.VITE_API_URL
  || import.meta.env.VITE_APP_URL_API
  || import.meta.env.URL_API_BACKEND
  || 'http://localhost:8080';

let token = typeof window !== 'undefined' ? localStorage.getItem(LOCALSTORAGE_KEYS.AUTH_TOKEN) : null;

export function setToken(t) {
  token = t;
  try {
    if (typeof window !== 'undefined') {
      if (t) localStorage.setItem(LOCALSTORAGE_KEYS.AUTH_TOKEN, t);
      else localStorage.removeItem(LOCALSTORAGE_KEYS.AUTH_TOKEN);
    }
  } catch (e) {
    // ignore storage errors (e.g. Safari private mode)
  }
}

async function request(path, options = {}) {
  const headers = Object.assign({}, options.headers || {});
  // Si body es FormData no setear Content-Type para que fetch lo calcule
  if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    data = { message: text };
  }

  if (!res.ok) {
    const err = new Error(data?.message || 'Error en la petición');
    err.status = res.status;
    err.body = data;
    throw err;
  }

  return data;
}

export default {
  setToken,
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) =>
    request(path, {
      method: 'POST',
      body: typeof body === 'object' && !(body instanceof FormData) ? JSON.stringify(body) : body,
    }),
  put: (path, body) =>
    request(path, {
      method: 'PUT',
      body: typeof body === 'object' && !(body instanceof FormData) ? JSON.stringify(body) : body,
    }),
  delete: (path) => request(path, { method: 'DELETE' }),
  BASE,
};