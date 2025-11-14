import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import {
  HealthAlert,
  HealthStatus,
  HealthMetricType,
  HeartRateReading,
  BloodPressureReading
} from '../types/health';
import { supabase } from '../config/supabase';

// Configurar comportamento das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

class AlertSystem {
  private lastAlerts: Map<string, Date> = new Map();
  private alertCooldown = 15 * 60 * 1000; // 15 minutos entre alertas similares

  constructor() {
    this.requestNotificationPermissions();
  }

  // Solicitar permissões de notificação
  async requestNotificationPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('health-alerts', {
        name: 'Alertas de Saúde',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        sound: 'default',
        enableVibrate: true,
        enableLights: true,
        lightColor: '#FF0000',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  }

  // Verificar e disparar alerta para frequência cardíaca
  async checkHeartRateAlert(reading: HeartRateReading, userId: string): Promise<void> {
    if (reading.status === HealthStatus.NORMAL) return;

    const alertKey = `heart_rate_${reading.status}`;
    
    if (this.shouldSendAlert(alertKey)) {
      const alert = this.createHeartRateAlert(reading, userId);
      await this.sendAlert(alert);
      this.lastAlerts.set(alertKey, new Date());
    }
  }

  // Verificar e disparar alerta para pressão arterial
  async checkBloodPressureAlert(reading: BloodPressureReading, userId: string): Promise<void> {
    if (reading.status === HealthStatus.NORMAL) return;

    const alertKey = `blood_pressure_${reading.status}`;
    
    if (this.shouldSendAlert(alertKey)) {
      const alert = this.createBloodPressureAlert(reading, userId);
      await this.sendAlert(alert);
      this.lastAlerts.set(alertKey, new Date());
    }
  }

  // Verificar se deve enviar alerta (evitar spam)
  private shouldSendAlert(alertKey: string): boolean {
    const lastAlert = this.lastAlerts.get(alertKey);
    if (!lastAlert) return true;

    const timeSinceLastAlert = Date.now() - lastAlert.getTime();
    return timeSinceLastAlert > this.alertCooldown;
  }

  // Criar alerta de frequência cardíaca
  private createHeartRateAlert(reading: HeartRateReading, userId: string): HealthAlert {
    let title = '';
    let message = '';

    switch (reading.status) {
      case HealthStatus.CRITICAL:
        title = '🆘 ALERTA CRÍTICO: Frequência Cardíaca';
        message = `Sua frequência cardíaca está em ${reading.bpm} bpm. Procure atendimento médico imediatamente!`;
        break;
      case HealthStatus.ALERT:
        title = '🚨 ALERTA: Frequência Cardíaca Anormal';
        message = `Sua frequência cardíaca está em ${reading.bpm} bpm (${reading.category}). Consulte um médico.`;
        break;
      case HealthStatus.WARNING:
        title = '⚠️ ATENÇÃO: Frequência Cardíaca';
        message = `Sua frequência cardíaca está em ${reading.bpm} bpm (${reading.category}). Monitore atentamente.`;
        break;
      default:
        title = 'Frequência Cardíaca';
        message = `${reading.bpm} bpm`;
    }

    return {
      id: `hr_${Date.now()}`,
      user_id: userId,
      metric_type: HealthMetricType.HEART_RATE,
      severity: reading.status,
      title,
      message,
      reading_value: `${reading.bpm} bpm`,
      timestamp: new Date(),
      is_read: false
    };
  }

  // Criar alerta de pressão arterial
  private createBloodPressureAlert(reading: BloodPressureReading, userId: string): HealthAlert {
    let title = '';
    let message = '';

    switch (reading.status) {
      case HealthStatus.CRITICAL:
        title = '🆘 CRISE HIPERTENSIVA';
        message = `Pressão arterial em ${reading.systolic}/${reading.diastolic} mmHg. PROCURE ATENDIMENTO MÉDICO IMEDIATAMENTE!`;
        break;
      case HealthStatus.ALERT:
        title = '🚨 ALERTA: Pressão Arterial Elevada';
        message = `Pressão arterial em ${reading.systolic}/${reading.diastolic} mmHg (${reading.category}). Consulte seu médico.`;
        break;
      case HealthStatus.WARNING:
        title = '⚠️ ATENÇÃO: Pressão Arterial';
        message = `Pressão arterial em ${reading.systolic}/${reading.diastolic} mmHg (${reading.category}). Continue monitorando.`;
        break;
      default:
        title = 'Pressão Arterial';
        message = `${reading.systolic}/${reading.diastolic} mmHg`;
    }

    return {
      id: `bp_${Date.now()}`,
      user_id: userId,
      metric_type: HealthMetricType.BLOOD_PRESSURE,
      severity: reading.status,
      title,
      message,
      reading_value: `${reading.systolic}/${reading.diastolic} mmHg`,
      timestamp: new Date(),
      is_read: false
    };
  }

  // Enviar alerta (notificação + salvar no banco)
  private async sendAlert(alert: HealthAlert): Promise<void> {
    try {
      // Enviar notificação local
      await this.sendNotification(alert);

      // Salvar no banco de dados
      await this.saveAlertToDatabase(alert);

      console.log(`✅ Alerta enviado: ${alert.title}`);
    } catch (error) {
      console.error('❌ Erro ao enviar alerta:', error);
    }
  }

  // Enviar notificação local
  private async sendNotification(alert: HealthAlert): Promise<void> {
    const priority = this.getNotificationPriority(alert.severity);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: alert.title,
        body: alert.message,
        sound: alert.severity === HealthStatus.CRITICAL ? 'default' : undefined,
        priority: priority,
        data: { alert },
      },
      trigger: null, // Enviar imediatamente
    });
  }

  // Obter prioridade da notificação
  private getNotificationPriority(severity: HealthStatus): Notifications.AndroidNotificationPriority {
    switch (severity) {
      case HealthStatus.CRITICAL:
        return Notifications.AndroidNotificationPriority.MAX;
      case HealthStatus.ALERT:
        return Notifications.AndroidNotificationPriority.HIGH;
      case HealthStatus.WARNING:
        return Notifications.AndroidNotificationPriority.DEFAULT;
      default:
        return Notifications.AndroidNotificationPriority.DEFAULT;
    }
  }

  // Salvar alerta no banco de dados
  private async saveAlertToDatabase(alert: HealthAlert): Promise<void> {
    try {
      const { error } = await supabase.from('health_alerts').insert([
        {
          user_id: alert.user_id,
          metric_type: alert.metric_type,
          severity: alert.severity,
          title: alert.title,
          message: alert.message,
          reading_value: alert.reading_value,
          timestamp: alert.timestamp.toISOString(),
          is_read: false
        }
      ]);

      if (error) {
        console.error('❌ Erro ao salvar alerta no banco:', error);
      }
    } catch (error) {
      console.error('❌ Erro ao salvar alerta:', error);
    }
  }

  // Buscar alertas não lidos do usuário
  async getUnreadAlerts(userId: string): Promise<HealthAlert[]> {
    try {
      const { data, error } = await supabase
        .from('health_alerts')
        .select('*')
        .eq('user_id', userId)
        .eq('is_read', false)
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('❌ Erro ao buscar alertas:', error);
        return [];
      }

      return (data || []).map(alert => ({
        ...alert,
        timestamp: new Date(alert.timestamp)
      }));
    } catch (error) {
      console.error('❌ Erro ao buscar alertas:', error);
      return [];
    }
  }

  // Marcar alerta como lido
  async markAlertAsRead(alertId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('health_alerts')
        .update({ is_read: true })
        .eq('id', alertId);

      if (error) {
        console.error('❌ Erro ao marcar alerta como lido:', error);
      }
    } catch (error) {
      console.error('❌ Erro ao marcar alerta como lido:', error);
    }
  }

  // Limpar histórico de alertas antigos
  clearOldAlerts(): void {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    for (const [key, date] of this.lastAlerts.entries()) {
      if (date.getTime() < oneDayAgo) {
        this.lastAlerts.delete(key);
      }
    }
  }
}

export const alertSystem = new AlertSystem();
export default alertSystem;
