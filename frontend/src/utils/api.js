export const getBackendUrl = (path = '') => {
  if (!path) return '';
  if (typeof path === 'string' && (path.startsWith('data:') || path.startsWith('http://') || path.startsWith('https://'))) {
    return path;
  }
  const base = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
    : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://127.0.0.1:8000'
        : 'https://ssh-apex.onrender.com');

  const formattedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${formattedPath}`;
};

// Fetch with cache-busting
export const fetchWithNoCache = async (url, options = {}) => {
  const timestamp = Date.now();
  const separator = url.includes('?') ? '&' : '?';
  const urlWithTimestamp = `${url}${separator}_t=${timestamp}`;

  const defaultHeaders = {
    'Cache-Control': 'no-cache',
    ...options.headers
  };

  return fetch(urlWithTimestamp, {
    ...options,
    headers: defaultHeaders
  });
};
