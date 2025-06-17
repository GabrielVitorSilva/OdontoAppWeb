import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
  // Adiciona timeout para evitar requisições pendentes
  timeout: 10000,
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(async (config) => {
  try {
    const token = localStorage.getItem('odontoAccessToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Erro ao configurar requisição:', error);
    return Promise.reject(error);
  }
}, (error) => {
  console.error('Erro no interceptor de requisição:', error);
  return Promise.reject(error);
});

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Erro na resposta da API:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('odontoAccessToken');
      localStorage.removeItem('odontoUser');
      window.location.href = '/auth/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;