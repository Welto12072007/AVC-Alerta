import axios from 'axios';

// Configure a URL base da API
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' // Desenvolvimento
  : 'https://sua-api-producao.com/api'; // Produção

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    // Aqui você pode adicionar o token de autenticação
    // const token = AsyncStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      // Redirecionar para login
    }
    return Promise.reject(error);
  }
);

// Serviços da API
export const healthService = {
  // Salvar dados de monitoramento
  saveHealthData: async (data: any) => {
    const response = await api.post('/health/save', data);
    return response.data;
  },

  // Buscar histórico de dados
  getHealthHistory: async (userId: string) => {
    const response = await api.get(`/health/history/${userId}`);
    return response.data;
  },

  // Salvar contatos de emergência
  saveEmergencyContacts: async (contacts: any[]) => {
    const response = await api.post('/emergency/contacts', { contacts });
    return response.data;
  },

  // Buscar contatos de emergência
  getEmergencyContacts: async (userId: string) => {
    const response = await api.get(`/emergency/contacts/${userId}`);
    return response.data;
  },
};

export const userService = {
  // Registrar usuário
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Buscar perfil do usuário
  getProfile: async (userId: string) => {
    const response = await api.get(`/users/profile/${userId}`);
    return response.data;
  },

  // Atualizar perfil
  updateProfile: async (userId: string, profileData: any) => {
    const response = await api.put(`/users/profile/${userId}`, profileData);
    return response.data;
  },
};