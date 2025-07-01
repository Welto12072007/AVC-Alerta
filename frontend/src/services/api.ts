import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://sua-api-producao.com/api';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Obter token do AsyncStorage
  private async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Erro ao obter token:', error);
      return null;
    }
  }

  // Salvar token no AsyncStorage
  private async saveToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Erro ao salvar token:', error);
    }
  }

  // Remover token do AsyncStorage
  private async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Erro ao remover token:', error);
    }
  }

  // Fazer requisição HTTP
  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = await this.getToken();
      
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  }

  // Métodos HTTP
  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Métodos de autenticação
  async register(userData: {
    name: string;
    email: string;
    password: string;
    birth_date?: string;
    gender?: string;
    phone?: string;
  }): Promise<ApiResponse> {
    const response = await this.post('/auth/register', userData);
    if (response.success && response.data?.token) {
      await this.saveToken(response.data.token);
    }
    return response;
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse> {
    const response = await this.post('/auth/login', credentials);
    if (response.success && response.data?.token) {
      await this.saveToken(response.data.token);
    }
    return response;
  }

  async logout(): Promise<void> {
    await this.removeToken();
  }

  async verifyToken(): Promise<ApiResponse> {
    return this.get('/auth/verify');
  }

  async refreshToken(): Promise<ApiResponse> {
    const response = await this.post('/auth/refresh');
    if (response.success && response.data?.token) {
      await this.saveToken(response.data.token);
    }
    return response;
  }

  // Métodos de usuário
  async getUserProfile(): Promise<ApiResponse> {
    return this.get('/users/profile');
  }

  async updateProfile(profileData: any): Promise<ApiResponse> {
    return this.put('/users/profile', profileData);
  }

  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse> {
    return this.put('/users/password', passwordData);
  }

  async deleteAccount(password: string): Promise<ApiResponse> {
    return this.delete('/users/account');
  }

  // Métodos de monitoramento de saúde
  async createHealthReading(readingData: {
    type: 'blood_pressure' | 'heart_rate' | 'weight';
    systolic?: number;
    diastolic?: number;
    heart_rate?: number;
    weight?: number;
    notes?: string;
  }): Promise<ApiResponse> {
    return this.post('/health/readings', readingData);
  }

  async getHealthReadings(params?: {
    type?: string;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse> {
    const queryString = params 
      ? '?' + new URLSearchParams(params as any).toString()
      : '';
    return this.get(`/health/readings${queryString}`);
  }

  async getHealthReading(id: number): Promise<ApiResponse> {
    return this.get(`/health/readings/${id}`);
  }

  async updateHealthReading(id: number, readingData: any): Promise<ApiResponse> {
    return this.put(`/health/readings/${id}`, readingData);
  }

  async deleteHealthReading(id: number): Promise<ApiResponse> {
    return this.delete(`/health/readings/${id}`);
  }

  async getHealthStats(days?: number): Promise<ApiResponse> {
    const queryString = days ? `?days=${days}` : '';
    return this.get(`/health/stats${queryString}`);
  }

  // Métodos de contatos de emergência
  async createEmergencyContact(contactData: {
    name: string;
    phone: string;
    relation?: string;
    type: 'personal' | 'medical' | 'emergency';
    is_primary?: boolean;
  }): Promise<ApiResponse> {
    return this.post('/emergency/contacts', contactData);
  }

  async getEmergencyContacts(type?: string): Promise<ApiResponse> {
    const queryString = type ? `?type=${type}` : '';
    return this.get(`/emergency/contacts${queryString}`);
  }

  async getEmergencyContact(id: number): Promise<ApiResponse> {
    return this.get(`/emergency/contacts/${id}`);
  }

  async updateEmergencyContact(id: number, contactData: any): Promise<ApiResponse> {
    return this.put(`/emergency/contacts/${id}`, contactData);
  }

  async deleteEmergencyContact(id: number): Promise<ApiResponse> {
    return this.delete(`/emergency/contacts/${id}`);
  }

  async getPrimaryContact(type: string): Promise<ApiResponse> {
    return this.get(`/emergency/contacts/primary/${type}`);
  }

  // Métodos de verificação de sintomas
  async createSymptomCheck(checkData: {
    face_symptoms: boolean;
    arms_symptoms: boolean;
    speech_symptoms: boolean;
    additional_notes?: string;
  }): Promise<ApiResponse> {
    return this.post('/symptoms/checks', checkData);
  }

  async getSymptomChecks(params?: {
    limit?: number;
    startDate?: string;
    endDate?: string;
    positive_only?: boolean;
  }): Promise<ApiResponse> {
    const queryString = params 
      ? '?' + new URLSearchParams(params as any).toString()
      : '';
    return this.get(`/symptoms/checks${queryString}`);
  }

  async getSymptomCheck(id: number): Promise<ApiResponse> {
    return this.get(`/symptoms/checks/${id}`);
  }

  async updateSymptomCheck(id: number, checkData: any): Promise<ApiResponse> {
    return this.put(`/symptoms/checks/${id}`, checkData);
  }

  async deleteSymptomCheck(id: number): Promise<ApiResponse> {
    return this.delete(`/symptoms/checks/${id}`);
  }

  async getSymptomStats(days?: number): Promise<ApiResponse> {
    const queryString = days ? `?days=${days}` : '';
    return this.get(`/symptoms/stats${queryString}`);
  }

  // Método para verificar status da API
  async getApiStatus(): Promise<ApiResponse> {
    return this.get('/status');
  }
}

export default new ApiService();