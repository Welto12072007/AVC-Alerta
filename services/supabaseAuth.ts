import { supabase } from '@/config/supabase';

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
}

interface AuthResponse {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Valida força da senha no frontend
 */
function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('A senha deve ter pelo menos 8 caracteres');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra maiúscula');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra minúscula');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('A senha deve conter pelo menos um número');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('A senha deve conter pelo menos um caractere especial');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Serviço de autenticação usando Supabase Auth
 */
export const supabaseAuthService = {
  /**
   * Registra um novo usuário
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      // Validar força da senha
      const passwordValidation = validatePasswordStrength(userData.password);
      if (!passwordValidation.isValid) {
        return {
          success: false,
          error: passwordValidation.errors.join(', '),
        };
      }

      // Registrar usuário com Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.fullName,
          },
          emailRedirectTo: undefined, // Desabilita redirect de confirmação
        },
      });

      if (error) {
        return {
          success: false,
          error: error.message || 'Erro ao criar conta',
        };
      }

      // Inserir dados adicionais na tabela users (se necessário)
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email: userData.email,
              full_name: userData.fullName,
            },
          ]);

        if (profileError && profileError.code !== '23505') {
          // Ignora erro de duplicação (usuário já existe)
          console.warn('Erro ao criar perfil:', profileError);
        }
      }

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao criar conta',
      };
    }
  },

  /**
   * Faz login do usuário
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error: error.message || 'Erro ao fazer login',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao fazer login',
      };
    }
  },

  /**
   * Faz logout do usuário
   */
  async logout(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          success: false,
          error: error.message || 'Erro ao fazer logout',
        };
      }

      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao fazer logout',
      };
    }
  },

  /**
   * Obtém usuário atual
   */
  async getCurrentUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  },

  /**
   * Obtém sessão atual
   */
  async getSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  },

  /**
   * Recuperação de senha
   */
  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        return {
          success: false,
          error: error.message || 'Erro ao enviar email de recuperação',
        };
      }

      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao enviar email de recuperação',
      };
    }
  },
};
