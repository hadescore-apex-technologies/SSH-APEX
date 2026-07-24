export const getBackendUrl = (path = '') => {
  // In production (or any environment where VITE_API_URL is set),
  // use the configured URL. Otherwise fall back to localhost:8000.
  const base = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/$/, '')  // strip trailing slash
    : `http://${window.location.hostname === 'localhost' ? '127.0.0.1' : window.location.hostname}:8000`;

  return `${base}${path}`;
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
