import axios from 'axios';

const envUrl = import.meta.env?.VITE_API_URL;
const BASE = envUrl 
  ? (envUrl.endsWith('/') ? `${envUrl.slice(0, -1)}/api` : `${envUrl}/api`)
  : `http://${window.location.hostname === 'localhost' ? '127.0.0.1' : window.location.hostname}:8000/api`;

const apiClient = axios.create({ baseURL: BASE });


// Attach token to every request
apiClient.interceptors.request.use(cfg => {
  const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Auto-refresh on 401
let refreshing = false;
let queue = [];

const processQueue = (err, token = null) => {
  queue.forEach(p => err ? p.reject(err) : p.resolve(token));
  queue = [];
};

apiClient.interceptors.response.use(
  r => r,
  async err => {
    const orig = err.config;
    if (orig && (!err.response || err.response?.status === 503) && !orig._networkRetry) {
      orig._networkRetry = true;
      await new Promise(resolve => setTimeout(resolve, 1000));
      return apiClient(orig);
    }
    if (err.response?.status === 401 && !orig._retry) {
      if (refreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then(token => {
          orig.headers.Authorization = `Bearer ${token}`;
          return apiClient(orig);
        });
      }
      orig._retry = true;
      refreshing = true;
      try {
        const refresh = localStorage.getItem('adminRefreshToken') || sessionStorage.getItem('adminRefreshToken');
        if (!refresh) throw new Error('No refresh token');
        const { data } = await axios.post(`${BASE}/token/refresh/`, { refresh });
        if (localStorage.getItem('adminRefreshToken')) {
          localStorage.setItem('adminToken', data.access);
        } else {
          sessionStorage.setItem('adminToken', data.access);
        }
        processQueue(null, data.access);
        orig.headers.Authorization = `Bearer ${data.access}`;
        return apiClient(orig);
      } catch (e) {
        processQueue(e, null);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminRefreshToken');
        sessionStorage.removeItem('adminToken');
        sessionStorage.removeItem('adminRefreshToken');
        window.location.href = '/admin/login';
        return Promise.reject(e);
      } finally {
        refreshing = false;
      }
    }
    return Promise.reject(err);
  }
);

export default apiClient;
