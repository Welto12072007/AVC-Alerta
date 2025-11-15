import { supabase } from '@/config/supabase';
import { requireAuth } from '@/utils/authUtils';

export interface EmergencyContact {
  id?: string;
  user_id?: string;
  name: string;
  phone_number: string;
  contact_type: 'personal' | 'medical';
  relation?: string;
  notes?: string;
  is_favorite?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface EmergencyContactsService {
  getAllContacts: () => Promise<EmergencyContact[]>;
  getContactsByType: (type: 'personal' | 'medical') => Promise<EmergencyContact[]>;
  getFavoriteContacts: () => Promise<EmergencyContact[]>;
  createContact: (contact: Omit<EmergencyContact, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<EmergencyContact | null>;
  updateContact: (id: string, contact: Partial<EmergencyContact>) => Promise<EmergencyContact | null>;
  deleteContact: (id: string) => Promise<boolean>;
  toggleFavorite: (id: string, isFavorite: boolean) => Promise<boolean>;
}

/**
 * Serviço para gerenciar contatos de emergência
 */
const emergencyContactsService: EmergencyContactsService = {
  /**
   * Busca todos os contatos do usuário logado
   */
  async getAllContacts() {
    try {
      const userId = await requireAuth();

      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar contatos:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Erro no getAllContacts:', error);
      return [];
    }
  },

  /**
   * Busca contatos por tipo (personal ou medical)
   */
  async getContactsByType(type: 'personal' | 'medical') {
    try {
      const userId = await requireAuth();

      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', userId)
        .eq('contact_type', type)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar contatos por tipo:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Erro no getContactsByType:', error);
      return [];
    }
  },

  /**
   * Busca apenas contatos marcados como favoritos
   */
  async getFavoriteContacts() {
    try {
      const userId = await requireAuth();

      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', userId)
        .eq('is_favorite', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar contatos favoritos:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Erro no getFavoriteContacts:', error);
      return [];
    }
  },

  /**
   * Cria um novo contato
   */
  async createContact(contact: Omit<EmergencyContact, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    try {
      const userId = await requireAuth();

      const { data, error } = await supabase
        .from('emergency_contacts')
        .insert([
          {
            ...contact,
            user_id: userId,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar contato:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro no createContact:', error);
      return null;
    }
  },

  /**
   * Atualiza um contato existente
   */
  async updateContact(id: string, contact: Partial<EmergencyContact>) {
    try {
      const userId = await requireAuth();

      const { data, error } = await supabase
        .from('emergency_contacts')
        .update(contact)
        .eq('id', id)
        .eq('user_id', userId) // Garante que só atualiza contatos do próprio usuário
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar contato:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro no updateContact:', error);
      return null;
    }
  },

  /**
   * Deleta um contato
   */
  async deleteContact(id: string) {
    try {
      const userId = await requireAuth();

      const { error } = await supabase
        .from('emergency_contacts')
        .delete()
        .eq('id', id)
        .eq('user_id', userId); // Garante que só deleta contatos do próprio usuário

      if (error) {
        console.error('Erro ao deletar contato:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Erro no deleteContact:', error);
      return false;
    }
  },

  /**
   * Alterna o status de favorito de um contato
   */
  async toggleFavorite(id: string, isFavorite: boolean) {
    try {
      const userId = await requireAuth();

      const { error } = await supabase
        .from('emergency_contacts')
        .update({ is_favorite: isFavorite })
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        console.error('Erro ao alternar favorito:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Erro no toggleFavorite:', error);
      return false;
    }
  },
};

export default emergencyContactsService;
