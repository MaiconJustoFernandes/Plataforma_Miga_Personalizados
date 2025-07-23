import axios from 'axios';

// Configuração dinâmica da baseURL para funcionar tanto localmente quanto em acesso externo
const getBaseURL = () => {
  const hostname = window.location.hostname;
  
  // Se estiver acessando via localhost (desenvolvimento local)
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }
  
  // Se estiver acessando via IP da VM ou qualquer outro host
  return `http://${hostname}:3000`;
};

const api = axios.create({
  baseURL: getBaseURL(),
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
