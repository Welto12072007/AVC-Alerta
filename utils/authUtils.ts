import { supabase } from '@/config/supabase';

/**
 * Helper para obter usuário autenticado
 * @returns User ID ou null se não autenticado
 */
export const getAuthenticatedUserId = async (): Promise<string | null> => {
  try {
    // Usar getSession ao invés de getUser para não lançar erro quando não autenticado
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session?.user) {
      return null;
    }
    
    return session.user.id;
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    return null;
  }
};

/**
 * Helper para verificar se o usuário está autenticado
 * @throws Error se não autenticado
 */
export const requireAuth = async (): Promise<string> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session?.user) {
      throw new Error('Usuário não autenticado');
    }
    
    return session.user.id;
  } catch (error) {
    throw new Error('Usuário não autenticado');
  }
};
