import { supabase } from '../config/supabase';

export interface HealthReading {
  id?: string;
  user_id?: string;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  heart_rate?: number;
  blood_glucose?: number;
  oxygen_saturation?: number;
  temperature?: number;
  weight?: number;
  reading_source?: 'manual' | 'wearable' | 'device';
  device_name?: string;
  notes?: string;
  recorded_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface HealthAlert {
  alert_type: string;
  alert_level: string;
  message: string;
}

/**
 * Service para gerenciar leituras de saúde dos usuários
 * Preparado para integração com wearables
 */
class HealthMonitoringService {
  /**
   * Buscar todas as leituras do usuário autenticado
   */
  async getAllReadings(): Promise<HealthReading[]> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('health_readings')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar leituras:', error);
      throw error;
    }
  }

  /**
   * Buscar leituras dos últimos N dias
   */
  async getRecentReadings(days: number = 7): Promise<HealthReading[]> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('Usuário não autenticado');
      }

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('health_readings')
        .select('*')
        .eq('user_id', user.id)
        .gte('recorded_at', startDate.toISOString())
        .order('recorded_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar leituras recentes:', error);
      throw error;
    }
  }

  /**
   * Buscar última leitura do usuário
   */
  async getLatestReading(): Promise<HealthReading | null> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('health_readings')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
      return data || null;
    } catch (error) {
      console.error('Erro ao buscar última leitura:', error);
      return null;
    }
  }

  /**
   * Criar nova leitura de saúde
   */
  async createReading(reading: HealthReading): Promise<HealthReading> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('Usuário não autenticado');
      }

      const newReading = {
        ...reading,
        user_id: user.id,
        reading_source: reading.reading_source || 'manual',
        recorded_at: reading.recorded_at || new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('health_readings')
        .insert([newReading])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar leitura:', error);
      throw error;
    }
  }

  /**
   * Atualizar leitura existente
   */
  async updateReading(id: string, updates: Partial<HealthReading>): Promise<HealthReading> {
    try {
      const { data, error } = await supabase
        .from('health_readings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar leitura:', error);
      throw error;
    }
  }

  /**
   * Deletar leitura
   */
  async deleteReading(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('health_readings')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao deletar leitura:', error);
      throw error;
    }
  }

  /**
   * Verificar alertas de saúde baseado nos valores
   */
  async checkHealthAlerts(
    systolic?: number,
    diastolic?: number,
    heartRate?: number
  ): Promise<HealthAlert[]> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .rpc('check_health_alerts', {
          p_user_id: user.id,
          p_systolic: systolic || 120,
          p_diastolic: diastolic || 80,
          p_heart_rate: heartRate || 70,
        });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao verificar alertas:', error);
      return [];
    }
  }

  /**
   * Buscar estatísticas de saúde do usuário
   */
  async getStatistics(): Promise<any> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('health_statistics')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return null;
    }
  }

  /**
   * Integração futura: Receber dados de wearable
   */
  async syncWearableData(deviceData: {
    device_name: string;
    readings: Partial<HealthReading>[];
  }): Promise<HealthReading[]> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('Usuário não autenticado');
      }

      const readingsToInsert = deviceData.readings.map(reading => ({
        ...reading,
        user_id: user.id,
        reading_source: 'wearable' as const,
        device_name: deviceData.device_name,
        recorded_at: reading.recorded_at || new Date().toISOString(),
      }));

      const { data, error } = await supabase
        .from('health_readings')
        .insert(readingsToInsert)
        .select();

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao sincronizar dados do wearable:', error);
      throw error;
    }
  }
}

export const healthMonitoringService = new HealthMonitoringService();
