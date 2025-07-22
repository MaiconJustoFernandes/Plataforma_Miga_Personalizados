import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // A URL base do backend
});

// Interceptor para adicionar o token JWT ao header de autorização
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('miga-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
