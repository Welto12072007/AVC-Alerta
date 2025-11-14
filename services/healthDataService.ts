import { supabase } from '../config/supabase';
import {
  HealthReading,
  HeartRateReading,
  BloodPressureReading,
  WeightReading,
  SleepReading,
  HealthMetricType,
  HealthStatistics
} from '../types/health';

class HealthDataService {
  // Salvar leitura de frequência cardíaca
  async saveHeartRateReading(reading: HeartRateReading, userId: string): Promise<void> {
    try {
      const { error } = await supabase.from('health_readings').insert([
        {
          user_id: userId,
          metric_type: HealthMetricType.HEART_RATE,
          heart_rate_bpm: reading.bpm,
          category: reading.category,
          status: reading.status,
          timestamp: reading.timestamp.toISOString(),
          notes: reading.notes
        }
      ]);

      if (error) throw error;
      console.log('✅ Leitura de frequência cardíaca salva');
    } catch (error) {
      console.error('❌ Erro ao salvar frequência cardíaca:', error);
      throw error;
    }
  }

  // Salvar leitura de pressão arterial
  async saveBloodPressureReading(reading: BloodPressureReading, userId: string): Promise<void> {
    try {
      const { error } = await supabase.from('health_readings').insert([
        {
          user_id: userId,
          metric_type: HealthMetricType.BLOOD_PRESSURE,
          blood_pressure_systolic: reading.systolic,
          blood_pressure_diastolic: reading.diastolic,
          category: reading.category,
          status: reading.status,
          timestamp: reading.timestamp.toISOString(),
          notes: reading.notes
        }
      ]);

      if (error) throw error;
      console.log('✅ Leitura de pressão arterial salva');
    } catch (error) {
      console.error('❌ Erro ao salvar pressão arterial:', error);
      throw error;
    }
  }

  // Buscar leituras de frequência cardíaca
  async getHeartRateReadings(
    userId: string,
    limit: number = 50
  ): Promise<HeartRateReading[]> {
    try {
      const { data, error } = await supabase
        .from('health_readings')
        .select('*')
        .eq('user_id', userId)
        .eq('metric_type', HealthMetricType.HEART_RATE)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map(record => ({
        id: record.id,
        user_id: record.user_id,
        metric_type: HealthMetricType.HEART_RATE,
        bpm: record.heart_rate_bpm,
        category: record.category,
        status: record.status,
        timestamp: new Date(record.timestamp),
        notes: record.notes
      }));
    } catch (error) {
      console.error('❌ Erro ao buscar frequência cardíaca:', error);
      return [];
    }
  }

  // Buscar leituras de pressão arterial
  async getBloodPressureReadings(
    userId: string,
    limit: number = 50
  ): Promise<BloodPressureReading[]> {
    try {
      const { data, error } = await supabase
        .from('health_readings')
        .select('*')
        .eq('user_id', userId)
        .eq('metric_type', HealthMetricType.BLOOD_PRESSURE)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map(record => ({
        id: record.id,
        user_id: record.user_id,
        metric_type: HealthMetricType.BLOOD_PRESSURE,
        systolic: record.blood_pressure_systolic,
        diastolic: record.blood_pressure_diastolic,
        category: record.category,
        status: record.status,
        timestamp: new Date(record.timestamp),
        notes: record.notes
      }));
    } catch (error) {
      console.error('❌ Erro ao buscar pressão arterial:', error);
      return [];
    }
  }

  // Buscar leituras por período
  async getReadingsByDateRange(
    userId: string,
    metricType: HealthMetricType,
    startDate: Date,
    endDate: Date
  ): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('health_readings')
        .select('*')
        .eq('user_id', userId)
        .eq('metric_type', metricType)
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString())
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Erro ao buscar leituras por período:', error);
      return [];
    }
  }

  // Calcular estatísticas
  async getStatistics(
    userId: string,
    metricType: HealthMetricType,
    period: 'day' | 'week' | 'month'
  ): Promise<HealthStatistics | null> {
    try {
      const now = new Date();
      const startDate = new Date();

      switch (period) {
        case 'day':
          startDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
      }

      const readings = await this.getReadingsByDateRange(
        userId,
        metricType,
        startDate,
        now
      );

      if (readings.length === 0) {
        return null;
      }

      let values: number[] = [];

      if (metricType === HealthMetricType.HEART_RATE) {
        values = readings.map(r => r.heart_rate_bpm).filter(v => v !== null);
      } else if (metricType === HealthMetricType.BLOOD_PRESSURE) {
        values = readings.map(r => r.blood_pressure_systolic).filter(v => v !== null);
      }

      if (values.length === 0) {
        return null;
      }

      const average = values.reduce((a, b) => a + b, 0) / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);

      return {
        metric_type: metricType,
        period,
        average: Math.round(average),
        min,
        max,
        readings_count: readings.length,
        last_reading_date: new Date(readings[0].timestamp)
      };
    } catch (error) {
      console.error('❌ Erro ao calcular estatísticas:', error);
      return null;
    }
  }

  // Deletar leitura
  async deleteReading(readingId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('health_readings')
        .delete()
        .eq('id', readingId);

      if (error) throw error;
      console.log('✅ Leitura deletada');
    } catch (error) {
      console.error('❌ Erro ao deletar leitura:', error);
      throw error;
    }
  }

  // Buscar última leitura
  async getLastReading(
    userId: string,
    metricType: HealthMetricType
  ): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('health_readings')
        .select('*')
        .eq('user_id', userId)
        .eq('metric_type', metricType)
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      return data;
    } catch (error) {
      console.error('❌ Erro ao buscar última leitura:', error);
      return null;
    }
  }
}

export const healthDataService = new HealthDataService();
export default healthDataService;
