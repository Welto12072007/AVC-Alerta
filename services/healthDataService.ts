import { supabase } from '@/config/supabase';
import { HealthMetricType } from '@/types/health';
import healthDataProcessor from './healthDataProcessor';

/**
 * Serviço para salvar leituras de saúde no banco de dados
 */
export const healthDataService = {
  /**
   * Salva uma leitura de pressão arterial
   */
  async saveBloodPressure(
    userId: string,
    systolic: number,
    diastolic: number,
    notes?: string
  ): Promise<string | null> {
    try {
      const bpReading = healthDataProcessor.analyzeBloodPressure(systolic, diastolic, notes);
      
      const { data, error } = await supabase.from('health_readings').insert([{
        user_id: userId,
        metric_type: HealthMetricType.BLOOD_PRESSURE,
        blood_pressure_systolic: systolic,
        blood_pressure_diastolic: diastolic,
        category: bpReading.category,
        status: bpReading.status,
        timestamp: new Date().toISOString(),
        notes: notes
      }]).select('id').single();
      
      if (error) throw error;
      console.log('✅ Pressão arterial salva no banco');
      return data?.id || null;
    } catch (error) {
      console.error('❌ Erro ao salvar pressão arterial:', error);
      return null;
    }
  },

  /**
   * Salva uma leitura de frequência cardíaca
   */
  async saveHeartRate(
    userId: string,
    bpm: number,
    notes?: string
  ): Promise<string | null> {
    try {
      const hrReading = healthDataProcessor.analyzeHeartRate(bpm, notes);
      
      const { data, error } = await supabase.from('health_readings').insert([{
        user_id: userId,
        metric_type: HealthMetricType.HEART_RATE,
        heart_rate_bpm: bpm,
        category: hrReading.category,
        status: hrReading.status,
        timestamp: new Date().toISOString(),
        notes: notes
      }]).select('id').single();
      
      if (error) throw error;
      console.log('✅ Frequência cardíaca salva no banco');
      return data?.id || null;
    } catch (error) {
      console.error('❌ Erro ao salvar frequência cardíaca:', error);
      return null;
    }
  },

  /**
   * Salva uma leitura de SpO2
   */
  async saveSpO2(
    userId: string,
    spo2: number,
    notes?: string
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase.from('health_readings').insert([{
        user_id: userId,
        metric_type: HealthMetricType.OXYGEN_SATURATION,
        spo2_percentage: spo2,
        timestamp: new Date().toISOString(),
        notes: notes
      }]).select('id').single();
      
      if (error) throw error;
      console.log('✅ SpO2 salvo no banco');
      return data?.id || null;
    } catch (error) {
      console.error('❌ Erro ao salvar SpO2:', error);
      return null;
    }
  },

  /**
   * Salva uma leitura de peso
   */
  async saveWeight(
    userId: string,
    weight: number,
    notes?: string
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase.from('health_readings').insert([{
        user_id: userId,
        metric_type: HealthMetricType.WEIGHT,
        weight_kg: weight,
        timestamp: new Date().toISOString(),
        notes: notes
      }]).select('id').single();
      
      if (error) throw error;
      console.log('✅ Peso salvo no banco');
      return data?.id || null;
    } catch (error) {
      console.error('❌ Erro ao salvar peso:', error);
      return null;
    }
  },

  /**
   * Salva uma leitura de sono
   */
  async saveSleep(
    userId: string,
    hours: number,
    quality: 'poor' | 'fair' | 'good' | 'excellent',
    notes?: string
  ): Promise<string | null> {
    try {
      const qualityScore = quality === 'excellent' ? 4 : quality === 'good' ? 3 : quality === 'fair' ? 2 : 1;
      
      const { data, error } = await supabase.from('health_readings').insert([{
        user_id: userId,
        metric_type: HealthMetricType.SLEEP,
        sleep_duration_hours: hours,
        sleep_quality_score: qualityScore,
        timestamp: new Date().toISOString(),
        notes: notes
      }]).select('id').single();
      
      if (error) throw error;
      console.log('✅ Sono salvo no banco');
      return data?.id || null;
    } catch (error) {
      console.error('❌ Erro ao salvar sono:', error);
      return null;
    }
  },

  /**
   * Deleta uma leitura do banco de dados
   */
  async deleteReading(readingId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('health_readings')
        .delete()
        .eq('id', readingId);
      
      if (error) throw error;
      console.log('✅ Leitura deletada do banco');
      return true;
    } catch (error) {
      console.error('❌ Erro ao deletar leitura:', error);
      return false;
    }
  }
};
