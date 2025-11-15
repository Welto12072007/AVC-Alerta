import { supabase } from '@/config/supabase';

/**
 * Helper para obter usuário autenticado
 * @returns User ID ou null se não autenticado
 */
export const getAuthenticatedUserId = async (): Promise<string | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      console.error('Usuário não autenticado:', error);
      return null;
    }
    
    return user.id;
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
  const userId = await getAuthenticatedUserId();
  
  if (!userId) {
    throw new Error('Usuário não autenticado');
  }
  
  return userId;
};
