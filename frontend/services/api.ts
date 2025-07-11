import { auth } from './firebase';

const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://your-production-api.com/api';

class ApiService {
  private async getAuthToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) return null;
    
    try {
      return await user.getIdToken();
    } catch (error) {
      console.error('Erro ao obter token:', error);
      return null;
    }
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        error: 'Erro de conexão' 
      }));
      throw new Error(error.error || 'Erro na requisição');
    }

    return response.json();
  }

  // Métodos de saúde
  async getHealthReadings(type?: string) {
    const params = type ? `?type=${type}` : '';
    return this.request(`/health/readings${params}`);
  }

  async addHealthReading(data: {
    type: 'bp' | 'heartRate' | 'weight';
    value: any;
    notes?: string;
  }) {
    return this.request('/health/readings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteHealthReading(id: string) {
    return this.request(`/health/readings/${id}`, {
      method: 'DELETE',
    });
  }

  // Métodos de contatos de emergência
  async getEmergencyContacts() {
    return this.request('/emergency/contacts');
  }

  async addEmergencyContact(data: {
    name: string;
    phone: string;
    type: 'personal' | 'medical' | 'emergency';
    relation?: string;
  }) {
    return this.request('/emergency/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEmergencyContact(id: string, data: Partial<{
    name: string;
    phone: string;
    type: 'personal' | 'medical' | 'emergency';
    relation: string;
  }>) {
    return this.request(`/emergency/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEmergencyContact(id: string) {
    return this.request(`/emergency/contacts/${id}`, {
      method: 'DELETE',
    });
  }

  // Métodos de usuário
  async getUserProfile() {
    return this.request('/users/profile');
  }

  async updateUserProfile(data: {
    name?: string;
    age?: number;
    gender?: 'male' | 'female' | 'other';
  }) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getUserStats() {
    return this.request('/users/stats');
  }
}

export const apiService = new ApiService();