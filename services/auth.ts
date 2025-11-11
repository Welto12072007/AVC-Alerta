import { config } from './api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
}

interface AuthResponse {
  success: boolean;
  data?: {
    user: any;
    accessToken: string;
    refreshToken: string;
  };
  error?: string;
}

/**
 * Serviço de autenticação
 */
export const authService = {
  /**
   * Faz login do usuário
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${config.apiUrl}${config.endpoints.auth.login}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Erro ao fazer login',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Erro de conexão com o servidor',
      };
    }
  },

  /**
   * Registra um novo usuário
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${config.apiUrl}${config.endpoints.auth.register}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Erro ao criar conta',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Erro de conexão com o servidor',
      };
    }
  },

  /**
   * Faz logout do usuário
   */
  async logout(refreshToken: string): Promise<{ success: boolean }> {
    try {
      await fetch(`${config.apiUrl}${config.endpoints.auth.logout}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },

  /**
   * Atualiza o access token usando o refresh token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${config.apiUrl}${config.endpoints.auth.refresh}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: 'Erro ao atualizar token',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Erro de conexão com o servidor',
      };
    }
  },

  /**
   * Solicita recuperação de senha
   */
  async forgotPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${config.apiUrl}${config.endpoints.auth.forgotPassword}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Erro ao solicitar recuperação',
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: 'Erro de conexão com o servidor',
      };
    }
  },
};

export default authService;
