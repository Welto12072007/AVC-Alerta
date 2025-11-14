import {
  HeartRateReading,
  BloodPressureReading,
  HealthStatus,
  HeartRateCategory,
  BloodPressureCategory,
  HealthMetricType
} from '../types/health';

class HealthDataProcessor {
  // Analisar frequência cardíaca
  analyzeHeartRate(bpm: number, notes?: string): HeartRateReading {
    let category: HeartRateCategory;
    let status: HealthStatus;

    if (bpm < 40) {
      category = HeartRateCategory.BRADYCARDIA;
      status = HealthStatus.CRITICAL;
    } else if (bpm >= 40 && bpm < 60) {
      category = HeartRateCategory.BRADYCARDIA;
      status = HealthStatus.WARNING;
    } else if (bpm >= 60 && bpm <= 100) {
      category = HeartRateCategory.NORMAL;
      status = HealthStatus.NORMAL;
    } else if (bpm > 100 && bpm <= 120) {
      category = HeartRateCategory.ELEVATED;
      status = HealthStatus.WARNING;
    } else {
      category = HeartRateCategory.TACHYCARDIA;
      status = HealthStatus.ALERT;
    }

    return {
      metric_type: HealthMetricType.HEART_RATE,
      bpm,
      category,
      status,
      timestamp: new Date(),
      notes
    };
  }

  // Analisar pressão arterial
  analyzeBloodPressure(
    systolic: number,
    diastolic: number,
    notes?: string
  ): BloodPressureReading {
    let category: BloodPressureCategory;
    let status: HealthStatus;

    // Hipotensão
    if (systolic < 90 || diastolic < 60) {
      category = BloodPressureCategory.HYPOTENSION;
      status = HealthStatus.WARNING;
    }
    // Normal
    else if (systolic < 120 && diastolic < 80) {
      category = BloodPressureCategory.NORMAL;
      status = HealthStatus.NORMAL;
    }
    // Pressão Elevada
    else if (systolic >= 120 && systolic < 130 && diastolic < 80) {
      category = BloodPressureCategory.ELEVATED;
      status = HealthStatus.WARNING;
    }
    // Hipertensão Estágio 1
    else if (
      (systolic >= 130 && systolic < 140) ||
      (diastolic >= 80 && diastolic < 90)
    ) {
      category = BloodPressureCategory.HYPERTENSION_STAGE_1;
      status = HealthStatus.WARNING;
    }
    // Hipertensão Estágio 2
    else if (systolic >= 140 || diastolic >= 90) {
      category = BloodPressureCategory.HYPERTENSION_STAGE_2;
      status = HealthStatus.ALERT;
    }
    // Crise Hipertensiva
    else if (systolic >= 180 || diastolic >= 120) {
      category = BloodPressureCategory.HYPERTENSIVE_CRISIS;
      status = HealthStatus.CRITICAL;
    }
    // Fallback
    else {
      category = BloodPressureCategory.NORMAL;
      status = HealthStatus.NORMAL;
    }

    return {
      metric_type: HealthMetricType.BLOOD_PRESSURE,
      systolic,
      diastolic,
      category,
      status,
      timestamp: new Date(),
      notes
    };
  }

  // Verificar se valores estão em risco de AVC
  assessStrokeRisk(heartRate: number, systolic: number, diastolic: number): {
    riskLevel: 'low' | 'moderate' | 'high' | 'critical';
    riskFactors: string[];
    recommendation: string;
  } {
    const riskFactors: string[] = [];
    
    // Determinar o maior nível de risco encontrado
    const riskLevels: ('low' | 'moderate' | 'high' | 'critical')[] = [];

    // Avaliar pressão arterial
    if (systolic >= 180 || diastolic >= 120) {
      riskFactors.push('Crise hipertensiva - risco imediato');
      riskLevels.push('critical');
    } else if (systolic >= 140 || diastolic >= 90) {
      riskFactors.push('Hipertensão estágio 2');
      riskLevels.push('high');
    } else if (systolic >= 130 || diastolic >= 80) {
      riskFactors.push('Hipertensão estágio 1');
      riskLevels.push('moderate');
    }

    // Avaliar frequência cardíaca
    if (heartRate > 120) {
      riskFactors.push('Taquicardia severa');
      riskLevels.push('high');
    } else if (heartRate < 40) {
      riskFactors.push('Bradicardia severa');
      riskLevels.push('high');
    } else if (heartRate > 100) {
      riskFactors.push('Frequência cardíaca elevada');
      riskLevels.push('moderate');
    }

    // Determinar o nível de risco final (o mais alto)
    let riskLevel: 'low' | 'moderate' | 'high' | 'critical' = 'low';
    if (riskLevels.includes('critical')) {
      riskLevel = 'critical';
    } else if (riskLevels.includes('high')) {
      riskLevel = 'high';
    } else if (riskLevels.includes('moderate')) {
      riskLevel = 'moderate';
    }

    // Recomendações baseadas no risco
    let recommendation = '';
    switch (riskLevel) {
      case 'critical':
        recommendation =
          '🚨 ATENÇÃO: Procure atendimento médico IMEDIATAMENTE. Ligue para emergência ou vá ao hospital mais próximo.';
        break;
      case 'high':
        recommendation =
          '⚠️ IMPORTANTE: Consulte seu médico o mais breve possível. Seus sinais vitais estão em níveis preocupantes.';
        break;
      case 'moderate':
        recommendation =
          '📋 Agende uma consulta médica para avaliação. Continue monitorando seus sinais vitais.';
        break;
      case 'low':
        recommendation =
          '✅ Seus sinais vitais estão normais. Continue mantendo hábitos saudáveis e monitoramento regular.';
        break;
    }

    return {
      riskLevel,
      riskFactors: riskFactors.length > 0 ? riskFactors : ['Nenhum fator de risco identificado'],
      recommendation
    };
  }

  // Calcular média de leituras
  calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + val, 0);
    return Math.round(sum / values.length);
  }

  // Verificar tendência (crescente, decrescente, estável)
  analyzeTrend(values: number[]): 'increasing' | 'decreasing' | 'stable' {
    if (values.length < 2) return 'stable';

    const recentValues = values.slice(-5); // Últimas 5 leituras
    let increases = 0;
    let decreases = 0;

    for (let i = 1; i < recentValues.length; i++) {
      if (recentValues[i] > recentValues[i - 1]) increases++;
      if (recentValues[i] < recentValues[i - 1]) decreases++;
    }

    if (increases > decreases * 1.5) return 'increasing';
    if (decreases > increases * 1.5) return 'decreasing';
    return 'stable';
  }

  // Formatar status para exibição
  getStatusLabel(status: HealthStatus): string {
    switch (status) {
      case HealthStatus.NORMAL:
        return 'Normal';
      case HealthStatus.WARNING:
        return 'Atenção';
      case HealthStatus.ALERT:
        return 'Alerta';
      case HealthStatus.CRITICAL:
        return 'Crítico';
      default:
        return 'Desconhecido';
    }
  }

  // Obter cor do status
  getStatusColor(status: HealthStatus): string {
    switch (status) {
      case HealthStatus.NORMAL:
        return '#10b981'; // green
      case HealthStatus.WARNING:
        return '#f59e0b'; // orange
      case HealthStatus.ALERT:
        return '#ef4444'; // red
      case HealthStatus.CRITICAL:
        return '#991b1b'; // dark red
      default:
        return '#6b7280'; // gray
    }
  }

  // Obter ícone do status
  getStatusIcon(status: HealthStatus): string {
    switch (status) {
      case HealthStatus.NORMAL:
        return '✅';
      case HealthStatus.WARNING:
        return '⚠️';
      case HealthStatus.ALERT:
        return '🚨';
      case HealthStatus.CRITICAL:
        return '🆘';
      default:
        return 'ℹ️';
    }
  }

  // Validar leituras
  isValidHeartRate(bpm: number): boolean {
    return bpm > 0 && bpm < 300;
  }

  isValidBloodPressure(systolic: number, diastolic: number): boolean {
    return (
      systolic > 0 &&
      systolic < 300 &&
      diastolic > 0 &&
      diastolic < 200 &&
      systolic > diastolic
    );
  }
}

export const healthDataProcessor = new HealthDataProcessor();
export default healthDataProcessor;
