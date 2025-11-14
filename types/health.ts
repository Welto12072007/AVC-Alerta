// Tipos para dados de saúde e monitoramento

export enum HealthMetricType {
  HEART_RATE = 'heart_rate',
  BLOOD_PRESSURE = 'blood_pressure',
  WEIGHT = 'weight',
  SLEEP = 'sleep',
  STEPS = 'steps',
  OXYGEN_SATURATION = 'oxygen_saturation'
}

export enum HealthStatus {
  NORMAL = 'normal',
  WARNING = 'warning',
  ALERT = 'alert',
  CRITICAL = 'critical'
}

export enum BloodPressureCategory {
  NORMAL = 'Normal',
  ELEVATED = 'Pressão Elevada',
  HYPERTENSION_STAGE_1 = 'Hipertensão Estágio 1',
  HYPERTENSION_STAGE_2 = 'Hipertensão Estágio 2',
  HYPERTENSIVE_CRISIS = 'Crise Hipertensiva',
  HYPOTENSION = 'Hipotensão'
}

export enum HeartRateCategory {
  BRADYCARDIA = 'Bradicardia',
  NORMAL = 'Normal',
  ELEVATED = 'Elevada',
  TACHYCARDIA = 'Taquicardia'
}

// Interface base para leitura de saúde
export interface BaseHealthReading {
  id?: string;
  user_id?: string;
  timestamp: Date;
  notes?: string;
  metric_type: HealthMetricType;
}

// Frequência Cardíaca
export interface HeartRateReading extends BaseHealthReading {
  metric_type: HealthMetricType.HEART_RATE;
  bpm: number;
  category: HeartRateCategory;
  status: HealthStatus;
}

// Pressão Arterial
export interface BloodPressureReading extends BaseHealthReading {
  metric_type: HealthMetricType.BLOOD_PRESSURE;
  systolic: number;
  diastolic: number;
  category: BloodPressureCategory;
  status: HealthStatus;
}

// Peso
export interface WeightReading extends BaseHealthReading {
  metric_type: HealthMetricType.WEIGHT;
  weight_kg: number;
  bmi?: number;
}

// Sono
export interface SleepReading extends BaseHealthReading {
  metric_type: HealthMetricType.SLEEP;
  sleep_start: Date;
  sleep_end: Date;
  duration_hours: number;
  quality_score?: number;
  deep_sleep_minutes?: number;
  light_sleep_minutes?: number;
  rem_sleep_minutes?: number;
  awake_minutes?: number;
}

// Saturação de Oxigênio
export interface OxygenSaturationReading extends BaseHealthReading {
  metric_type: HealthMetricType.OXYGEN_SATURATION;
  spo2_percentage: number;
  status: HealthStatus;
}

// Union type para qualquer leitura de saúde
export type HealthReading =
  | HeartRateReading
  | BloodPressureReading
  | WeightReading
  | SleepReading
  | OxygenSaturationReading;

// Dispositivo Bluetooth
export interface BluetoothDevice {
  id: string;
  name: string | null;
  rssi?: number;
  isConnected: boolean;
}

// Status da conexão Bluetooth
export interface BluetoothConnectionStatus {
  isScanning: boolean;
  isConnected: boolean;
  connectedDevice: BluetoothDevice | null;
  error: string | null;
}

// Alerta de saúde
export interface HealthAlert {
  id: string;
  user_id: string;
  metric_type: HealthMetricType;
  severity: HealthStatus;
  title: string;
  message: string;
  reading_value: string;
  timestamp: Date;
  is_read: boolean;
}

// Estatísticas de saúde
export interface HealthStatistics {
  metric_type: HealthMetricType;
  period: 'day' | 'week' | 'month';
  average?: number;
  min?: number;
  max?: number;
  readings_count: number;
  last_reading_date?: Date;
}

// UUIDs padrão BLE para Health Devices
export const BLE_SERVICE_UUIDS = {
  // UUIDs padrão
  HEART_RATE: '0000180d-0000-1000-8000-00805f9b34fb',
  BLOOD_PRESSURE: '00001810-0000-1000-8000-00805f9b34fb',
  DEVICE_INFORMATION: '0000180a-0000-1000-8000-00805f9b34fb',
  BATTERY: '0000180f-0000-1000-8000-00805f9b34fb',
  USER_DATA: '0000181c-0000-1000-8000-00805f9b34fb',
  
  // UUIDs Fotola S20 Ultra (Nordic UART Service)
  FOTOLA_UART: '6e400801-b5a3-f393-e0a9-e50e24dcca9d', // Serviço correto descoberto
  FOTOLA_CUSTOM_SERVICE: '0000ffff-0000-1000-8000-00805f9b34fb', // Serviço personalizado
  FOTOLA_HEALTH_SERVICE: '00003802-0000-1000-8000-00805f9b34fb' // Outro serviço de saúde
} as const;

export const BLE_CHARACTERISTIC_UUIDS = {
  // UUIDs padrão
  HEART_RATE_MEASUREMENT: '00002a37-0000-1000-8000-00805f9b34fb',
  BLOOD_PRESSURE_MEASUREMENT: '00002a35-0000-1000-8000-00805f9b34fb',
  BATTERY_LEVEL: '00002a19-0000-1000-8000-00805f9b34fb',
  DEVICE_NAME: '00002a00-0000-1000-8000-00805f9b34fb',
  
  // UUIDs Fotola S20 Ultra (Nordic UART)
  FOTOLA_TX: '6e400002-b5a3-f393-e0a9-e50e24dcca9d', // Write (enviar comandos)
  FOTOLA_RX: '6e400003-b5a3-f393-e0a9-e50e24dcca9d', // Notify (receber dados)
  
  // UUIDs do serviço personalizado 0000ffff
  FOTOLA_NOTIFY: '0000ff11-0000-1000-8000-00805f9b34fb', // Notify - DADOS DE SAÚDE
  FOTOLA_WRITE: '0000ff22-0000-1000-8000-00805f9b34fb', // Write
  
  // UUIDs do serviço de saúde 00003802
  FOTOLA_HEALTH_DATA: '00004a02-0000-1000-8000-00805f9b34fb' // Read, Write, Notify
} as const;
