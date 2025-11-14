import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Modal } from 'react-native';
import { Link } from 'expo-router';
import { Heart, Activity, ArrowRight, ArrowLeft, Calendar, Thermometer, ChartBar as BarChart3, Bluetooth, X, Moon, Weight as WeightIcon } from 'lucide-react-native';
import { BluetoothTestButton } from '../../components/BluetoothTestButton';
import { FotolaHealthData } from '../../services/fotolaProtocolParser';
import { supabase } from '../../config/supabase';
import healthDataProcessor from '../../services/healthDataProcessor';
import { HealthMetricType } from '../../types/health';

interface Reading {
  id: number;
  date: Date;
  notes?: string;
}

interface BPReading extends Reading {
  systolic: number;
  diastolic: number;
}

interface HeartRateReading extends Reading {
  value: number;
}

interface WeightReading extends Reading {
  value: number;
}

interface SleepReading extends Reading {
  hours: number;
  quality: 'poor' | 'fair' | 'good' | 'excellent';
}

interface NewReading {
  systolic: string;
  diastolic: string;
  heartRate: string;
  weight: string;
  sleepHours: string;
  sleepQuality: 'poor' | 'fair' | 'good' | 'excellent';
  notes: string;
}

interface Readings {
  bp: BPReading[];
  heartRate: HeartRateReading[];
  weight: WeightReading[];
  sleep: SleepReading[];
}

type TabType = 'bp' | 'heartRate' | 'weight' | 'sleep';

export default function MonitoringScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTab, setSelectedTab] = useState<TabType>('bp');
  const [readings, setReadings] = useState<Readings>({
    bp: [],
    heartRate: [],
    weight: [],
    sleep: [],
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showSleepModal, setShowSleepModal] = useState(false);
  const [newReading, setNewReading] = useState<NewReading>({
    systolic: '',
    diastolic: '',
    heartRate: '',
    weight: '',
    sleepHours: '',
    sleepQuality: 'good',
    notes: '',
  });
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Dados do smartwatch em tempo real
  const [liveSmartwatchData, setLiveSmartwatchData] = useState<FotolaHealthData | null>(null);
  // Guardar último valor registrado para evitar duplicatas
  const lastRegisteredValues = useRef<{
    heartRate?: number;
    bloodPressure?: { systolic: number; diastolic: number };
  }>({});
  
  // Contador para garantir IDs únicos
  const idCounter = useRef(0);
  const generateUniqueId = () => {
    idCounter.current += 1;
    return Date.now() + idCounter.current;
  };
  
  // Salvar leitura de pressão arterial no Supabase
  const saveBPToDatabase = async (systolic: number, diastolic: number, notes: string) => {
    if (!userId) return;
    
    try {
      const bpReading = healthDataProcessor.analyzeBloodPressure(systolic, diastolic, notes);
      
      const { error } = await supabase.from('health_readings').insert([{
        user_id: userId,
        metric_type: HealthMetricType.BLOOD_PRESSURE,
        blood_pressure_systolic: systolic,
        blood_pressure_diastolic: diastolic,
        category: bpReading.category,
        status: bpReading.status,
        timestamp: new Date().toISOString(),
        notes: notes
      }]);
      
      if (error) throw error;
      console.log('✅ Pressão arterial salva no banco');
    } catch (error) {
      console.error('❌ Erro ao salvar pressão arterial:', error);
    }
  };
  
  // Salvar leitura de frequência cardíaca no Supabase
  const saveHeartRateToDatabase = async (bpm: number, notes: string) => {
    if (!userId) return;
    
    try {
      const hrReading = healthDataProcessor.analyzeHeartRate(bpm, notes);
      
      const { error } = await supabase.from('health_readings').insert([{
        user_id: userId,
        metric_type: HealthMetricType.HEART_RATE,
        heart_rate_bpm: bpm,
        category: hrReading.category,
        status: hrReading.status,
        timestamp: new Date().toISOString(),
        notes: notes
      }]);
      
      if (error) throw error;
      console.log('✅ Frequência cardíaca salva no banco');
    } catch (error) {
      console.error('❌ Erro ao salvar frequência cardíaca:', error);
    }
  };

  // Salvar leitura de peso no Supabase
  const saveWeightToDatabase = async (weight: number, notes: string) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase.from('health_readings').insert([{
        user_id: userId,
        metric_type: HealthMetricType.WEIGHT,
        weight_kg: weight,
        timestamp: new Date().toISOString(),
        notes: notes
      }]);
      
      if (error) throw error;
      console.log('✅ Peso salvo no banco');
    } catch (error) {
      console.error('❌ Erro ao salvar peso:', error);
    }
  };

  // Salvar leitura de sono no Supabase
  const saveSleepToDatabase = async (hours: number, quality: string, notes: string) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase.from('health_readings').insert([{
        user_id: userId,
        metric_type: HealthMetricType.SLEEP,
        sleep_duration_hours: hours,
        sleep_quality_score: quality === 'excellent' ? 4 : quality === 'good' ? 3 : quality === 'fair' ? 2 : 1,
        timestamp: new Date().toISOString(),
        notes: notes
      }]);
      
      if (error) throw error;
      console.log('✅ Sono salvo no banco');
    } catch (error) {
      console.error('❌ Erro ao salvar sono:', error);
    }
  };

  // Handler para adicionar peso
  const handleAddWeight = async () => {
    if (!newReading.weight) {
      Alert.alert('Erro', 'Por favor, preencha o valor do peso');
      return;
    }

    const weight = parseFloat(newReading.weight);
    if (isNaN(weight) || weight <= 0) {
      Alert.alert('Erro', 'Por favor, insira um peso válido');
      return;
    }

    const now = new Date();
    const newWeightReading: WeightReading = {
      id: generateUniqueId(),
      date: now,
      value: weight,
      notes: newReading.notes,
    };

    setReadings(prev => ({
      ...prev,
      weight: [newWeightReading, ...prev.weight],
    }));

    await saveWeightToDatabase(weight, newReading.notes || 'Medição manual');
    
    Alert.alert('Sucesso', 'Peso registrado com sucesso!');
    setNewReading(prev => ({ ...prev, weight: '', notes: '' }));
    setShowWeightModal(false);
  };

  // Handler para adicionar sono
  const handleAddSleep = async () => {
    if (!newReading.sleepHours) {
      Alert.alert('Erro', 'Por favor, preencha as horas de sono');
      return;
    }

    const hours = parseFloat(newReading.sleepHours);
    if (isNaN(hours) || hours <= 0 || hours > 24) {
      Alert.alert('Erro', 'Por favor, insira horas válidas (0-24)');
      return;
    }

    const now = new Date();
    const newSleepReading: SleepReading = {
      id: generateUniqueId(),
      date: now,
      hours: hours,
      quality: newReading.sleepQuality,
      notes: newReading.notes,
    };

    setReadings(prev => ({
      ...prev,
      sleep: [newSleepReading, ...prev.sleep],
    }));

    await saveSleepToDatabase(hours, newReading.sleepQuality, newReading.notes || 'Registro manual');
    
    Alert.alert('Sucesso', 'Sono registrado com sucesso!');
    setNewReading(prev => ({ ...prev, sleepHours: '', sleepQuality: 'good', notes: '' }));
    setShowSleepModal(false);
  };

  // Callback quando dados do smartwatch chegarem
  const handleSmartwatchData = async (data: FotolaHealthData) => {
    console.log('📱 Dados recebidos na tela de monitoramento:', data);
    setLiveSmartwatchData(data);
    
    // Só adicionar aos históricos se os valores mudaram (não duplicar)
    const now = new Date();
    let hasNewData = false;
    
    // Verificar se pressão arterial mudou
    if (data.bloodPressure) {
      const lastBP = lastRegisteredValues.current.bloodPressure;
      const isNewBP = !lastBP || 
        lastBP.systolic !== data.bloodPressure.systolic || 
        lastBP.diastolic !== data.bloodPressure.diastolic;
      
      if (isNewBP) {
        const newBpReading: BPReading = {
          id: generateUniqueId(),
          date: now,
          systolic: data.bloodPressure.systolic,
          diastolic: data.bloodPressure.diastolic,
          notes: 'Smartwatch Fotola S20',
        };
        setReadings(prev => ({
          ...prev,
          bp: [newBpReading, ...prev.bp],
        }));
        lastRegisteredValues.current.bloodPressure = data.bloodPressure;
        hasNewData = true;
        console.log('✅ Nova leitura de pressão registrada:', data.bloodPressure);
        
        // Salvar no banco de dados
        await saveBPToDatabase(
          data.bloodPressure.systolic,
          data.bloodPressure.diastolic,
          'Smartwatch Fotola S20'
        );
      }
    }
    
    // Verificar se batimento cardíaco mudou
    if (data.heartRate) {
      const lastHR = lastRegisteredValues.current.heartRate;
      const isNewHR = !lastHR || lastHR !== data.heartRate;
      
      if (isNewHR) {
        const newHrReading: HeartRateReading = {
          id: generateUniqueId(),
          date: now,
          value: data.heartRate,
          notes: 'Smartwatch Fotola S20',
        };
        setReadings(prev => ({
          ...prev,
          heartRate: [newHrReading, ...prev.heartRate],
        }));
        lastRegisteredValues.current.heartRate = data.heartRate;
        hasNewData = true;
        console.log('✅ Nova leitura de BPM registrada:', data.heartRate);
        
        // Salvar no banco de dados
        await saveHeartRateToDatabase(data.heartRate, 'Smartwatch Fotola S20');
      }
    }
    
    if (!hasNewData) {
      console.log('ℹ️ Dados repetidos, não registrados');
    }
  };

  // Carregar dados do usuário do Supabase
  useEffect(() => {
    loadUserData();
  }, []);
  
  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Buscar usuário autenticado
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('❌ Usuário não autenticado:', authError);
        setLoading(false);
        return;
      }
      
      setUserId(user.id);
      console.log('👤 Usuário autenticado:', user.id);
      
      // Buscar leituras de pressão arterial
      const { data: bpData, error: bpError } = await supabase
        .from('health_readings')
        .select('*')
        .eq('user_id', user.id)
        .eq('metric_type', HealthMetricType.BLOOD_PRESSURE)
        .order('timestamp', { ascending: false })
        .limit(50);
      
      if (bpError) {
        console.error('❌ Erro ao carregar pressão arterial:', bpError);
      } else {
        const bpReadings: BPReading[] = (bpData || []).map((record, index) => ({
          id: new Date(record.timestamp).getTime() + index,
          date: new Date(record.timestamp),
          systolic: record.blood_pressure_systolic,
          diastolic: record.blood_pressure_diastolic,
          notes: record.notes || ''
        }));
        console.log(`📊 ${bpReadings.length} leituras de pressão carregadas`);
        setReadings(prev => ({ ...prev, bp: bpReadings }));
      }
      
      // Buscar leituras de frequência cardíaca
      const { data: hrData, error: hrError } = await supabase
        .from('health_readings')
        .select('*')
        .eq('user_id', user.id)
        .eq('metric_type', HealthMetricType.HEART_RATE)
        .order('timestamp', { ascending: false })
        .limit(50);
      
      if (hrError) {
        console.error('❌ Erro ao carregar frequência cardíaca:', hrError);
      } else {
        const hrReadings: HeartRateReading[] = (hrData || []).map((record, index) => ({
          id: new Date(record.timestamp).getTime() + index,
          date: new Date(record.timestamp),
          value: record.heart_rate_bpm,
          notes: record.notes || ''
        }));
        console.log(`💓 ${hrReadings.length} leituras de frequência carregadas`);
        setReadings(prev => ({ ...prev, heartRate: hrReadings }));
      }

      // Buscar leituras de peso
      const { data: weightData, error: weightError } = await supabase
        .from('health_readings')
        .select('*')
        .eq('user_id', user.id)
        .eq('metric_type', HealthMetricType.WEIGHT)
        .order('timestamp', { ascending: false })
        .limit(50);
      
      if (weightError) {
        console.error('❌ Erro ao carregar peso:', weightError);
      } else {
        const weightReadings: WeightReading[] = (weightData || []).map((record, index) => ({
          id: new Date(record.timestamp).getTime() + index,
          date: new Date(record.timestamp),
          value: record.weight_kg,
          notes: record.notes || ''
        }));
        console.log(`⚖️ ${weightReadings.length} leituras de peso carregadas`);
        setReadings(prev => ({ ...prev, weight: weightReadings }));
      }

      // Buscar leituras de sono
      const { data: sleepData, error: sleepError } = await supabase
        .from('health_readings')
        .select('*')
        .eq('user_id', user.id)
        .eq('metric_type', HealthMetricType.SLEEP)
        .order('timestamp', { ascending: false })
        .limit(50);
      
      if (sleepError) {
        console.error('❌ Erro ao carregar sono:', sleepError);
      } else {
        const sleepReadings: SleepReading[] = (sleepData || []).map((record, index) => {
          // Converter score numérico de volta para qualidade textual
          let quality: 'poor' | 'fair' | 'good' | 'excellent' = 'good';
          if (record.sleep_quality_score) {
            if (record.sleep_quality_score >= 4) quality = 'excellent';
            else if (record.sleep_quality_score >= 3) quality = 'good';
            else if (record.sleep_quality_score >= 2) quality = 'fair';
            else quality = 'poor';
          }
          
          return {
            id: new Date(record.timestamp).getTime() + index,
            date: new Date(record.timestamp),
            hours: record.sleep_duration_hours || 0,
            quality: quality,
            notes: record.notes || ''
          };
        });
        console.log(`😴 ${sleepReadings.length} leituras de sono carregadas`);
        setReadings(prev => ({ ...prev, sleep: sleepReadings }));
      }
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReading = async () => {
    const now = new Date();
    
    if (selectedTab === 'bp') {
      if (!newReading.systolic || !newReading.diastolic) {
        Alert.alert('Erro', 'Por favor, preencha os valores sistólica e diastólica');
        return;
      }
      
      const systolic = parseInt(newReading.systolic);
      const diastolic = parseInt(newReading.diastolic);
      
      const newBpReading: BPReading = {
        id: generateUniqueId(),
        date: now,
        systolic: systolic,
        diastolic: diastolic,
        notes: newReading.notes,
      };
      
      setReadings({
        ...readings,
        bp: [newBpReading, ...readings.bp],
      });
      
      // Salvar no banco de dados
      await saveBPToDatabase(systolic, diastolic, newReading.notes || 'Medição manual');
    } else if (selectedTab === 'heartRate') {
      if (!newReading.heartRate) {
        Alert.alert('Erro', 'Por favor, preencha o valor da frequência cardíaca');
        return;
      }
      
      const bpm = parseInt(newReading.heartRate);
      
      const newHrReading: HeartRateReading = {
        id: generateUniqueId(),
        date: now,
        value: bpm,
        notes: newReading.notes,
      };
      
      setReadings({
        ...readings,
        heartRate: [newHrReading, ...readings.heartRate],
      });
      
      // Salvar no banco de dados
      await saveHeartRateToDatabase(bpm, newReading.notes || 'Medição manual');
    }
    
    Alert.alert('Sucesso', 'Leitura registrada com sucesso!');
    
    setNewReading({
      systolic: '',
      diastolic: '',
      heartRate: '',
      weight: '',
      sleepHours: '',
      sleepQuality: 'good',
      notes: '',
    });
    
    setShowAddForm(false);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getBpStatus = (systolic: number, diastolic: number): { label: string; color: string } => {
    if (systolic < 120 && diastolic < 80) {
      return { label: 'Normal', color: '#10B981' };
    } else if ((systolic >= 120 && systolic <= 129) && diastolic < 80) {
      return { label: 'Elevada', color: '#FBBF24' };
    } else if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
      return { label: 'Hipertensão Estágio 1', color: '#F97316' };
    } else if (systolic >= 140 || diastolic >= 90) {
      return { label: 'Hipertensão Estágio 2', color: '#EF4444' };
    } else if (systolic > 180 || diastolic > 120) {
      return { label: 'Crise Hipertensiva', color: '#7F1D1D' };
    }
    return { label: 'Indefinido', color: '#64748B' };
  };

  const getHeartRateStatus = (hr: number): { label: string; color: string } => {
    if (hr < 60) {
      return { label: 'Bradicardia', color: '#F97316' };
    } else if (hr >= 60 && hr <= 100) {
      return { label: 'Normal', color: '#10B981' };
    } else {
      return { label: 'Taquicardia', color: '#EF4444' };
    }
  };

  const renderReadingsList = () => {
    if (selectedTab === 'bp') {
      const sortedReadings = [...readings.bp].sort((a, b) => b.date.getTime() - a.date.getTime());
      
      return (
        <>
          {sortedReadings.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum registro de pressão arterial</Text>
              <Text style={styles.emptySubtext}>
                Adicione suas medições para acompanhar sua saúde
              </Text>
            </View>
          ) : (
            sortedReadings.map((reading) => {
              const status = getBpStatus(reading.systolic, reading.diastolic);
              
              return (
                <View key={reading.id} style={styles.readingCard}>
                  <View style={styles.readingHeader}>
                    <View style={styles.readingDate}>
                      <Calendar size={16} color="#64748B" />
                      <Text style={styles.dateText}>{formatDate(reading.date)}</Text>
                      <Text style={styles.timeText}>{formatTime(reading.date)}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
                      <Text style={styles.statusText}>{status.label}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.readingValues}>
                    <View style={styles.bpValue}>
                      <Text style={styles.bpNumber}>{reading.systolic}</Text>
                      <Text style={styles.bpUnit}>mmHg</Text>
                    </View>
                    <Text style={styles.bpSeparator}>/</Text>
                    <View style={styles.bpValue}>
                      <Text style={styles.bpNumber}>{reading.diastolic}</Text>
                      <Text style={styles.bpUnit}>mmHg</Text>
                    </View>
                  </View>
                  
                  {reading.notes && (
                    <Text style={styles.readingNotes}>{reading.notes}</Text>
                  )}
                </View>
              );
            })
          )}
        </>
      );
    } else if (selectedTab === 'heartRate') {
      const sortedReadings = [...readings.heartRate].sort((a, b) => b.date.getTime() - a.date.getTime());
      
      return (
        <>
          {sortedReadings.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum registro de frequência cardíaca</Text>
              <Text style={styles.emptySubtext}>
                Adicione suas medições para acompanhar sua saúde
              </Text>
            </View>
          ) : (
            sortedReadings.map((reading) => {
              const status = getHeartRateStatus(reading.value);
              
              return (
                <View key={reading.id} style={styles.readingCard}>
                  <View style={styles.readingHeader}>
                    <View style={styles.readingDate}>
                      <Calendar size={16} color="#64748B" />
                      <Text style={styles.dateText}>{formatDate(reading.date)}</Text>
                      <Text style={styles.timeText}>{formatTime(reading.date)}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
                      <Text style={styles.statusText}>{status.label}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.hrValueContainer}>
                    <Heart size={24} color="#EF4444" />
                    <Text style={styles.hrValue}>{reading.value}</Text>
                    <Text style={styles.hrUnit}>bpm</Text>
                  </View>
                  
                  {reading.notes && (
                    <Text style={styles.readingNotes}>{reading.notes}</Text>
                  )}
                </View>
              );
            })
          )}
        </>
      );
    } else if (selectedTab === 'weight') {
      const sortedReadings = [...readings.weight].sort((a, b) => b.date.getTime() - a.date.getTime());
      
      return (
        <>
          {sortedReadings.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum registro de peso</Text>
              <Text style={styles.emptySubtext}>
                Adicione suas medições para acompanhar sua saúde
              </Text>
            </View>
          ) : (
            sortedReadings.map((reading) => {
              return (
                <View key={reading.id} style={styles.readingCard}>
                  <View style={styles.readingHeader}>
                    <View style={styles.readingDate}>
                      <Calendar size={16} color="#64748B" />
                      <Text style={styles.dateText}>{formatDate(reading.date)}</Text>
                      <Text style={styles.timeText}>{formatTime(reading.date)}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.weightValueContainer}>
                    <Text style={styles.weightValue}>{reading.value.toFixed(1)}</Text>
                    <Text style={styles.weightUnit}>kg</Text>
                  </View>
                  
                  {reading.notes && (
                    <Text style={styles.readingNotes}>{reading.notes}</Text>
                  )}
                </View>
              );
            })
          )}
        </>
      );
    } else if (selectedTab === 'sleep') {
      const sortedReadings = [...readings.sleep].sort((a, b) => b.date.getTime() - a.date.getTime());
      
      const getQualityColor = (quality: string) => {
        switch (quality) {
          case 'excellent': return '#10B981';
          case 'good': return '#3B82F6';
          case 'fair': return '#FBBF24';
          case 'poor': return '#EF4444';
          default: return '#64748B';
        }
      };

      const getQualityLabel = (quality: string) => {
        switch (quality) {
          case 'excellent': return 'Excelente';
          case 'good': return 'Bom';
          case 'fair': return 'Regular';
          case 'poor': return 'Ruim';
          default: return quality;
        }
      };
      
      return (
        <>
          {sortedReadings.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum registro de sono</Text>
              <Text style={styles.emptySubtext}>
                Adicione suas medições para acompanhar sua saúde
              </Text>
            </View>
          ) : (
            sortedReadings.map((reading) => {
              return (
                <View key={reading.id} style={styles.readingCard}>
                  <View style={styles.readingHeader}>
                    <View style={styles.readingDate}>
                      <Calendar size={16} color="#64748B" />
                      <Text style={styles.dateText}>{formatDate(reading.date)}</Text>
                      <Text style={styles.timeText}>{formatTime(reading.date)}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getQualityColor(reading.quality) }]}>
                      <Text style={styles.statusText}>{getQualityLabel(reading.quality)}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.sleepValueContainer}>
                    <Moon size={24} color="#6366F1" />
                    <Text style={styles.sleepValue}>{reading.hours.toFixed(1)}</Text>
                    <Text style={styles.sleepUnit}>horas</Text>
                  </View>
                  
                  {reading.notes && (
                    <Text style={styles.readingNotes}>{reading.notes}</Text>
                  )}
                </View>
              );
            })
          )}
        </>
      );
    }
  };

  const renderAddForm = () => {
    if (selectedTab === 'bp') {
      return (
        <View style={styles.formContent}>
          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>Sistólica (mmHg)</Text>
              <TextInput
                style={styles.input}
                value={newReading.systolic}
                onChangeText={(text) => setNewReading({...newReading, systolic: text})}
                keyboardType="numeric"
                placeholder="120"
              />
            </View>
            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>Diastólica (mmHg)</Text>
              <TextInput
                style={styles.input}
                value={newReading.diastolic}
                onChangeText={(text) => setNewReading({...newReading, diastolic: text})}
                keyboardType="numeric"
                placeholder="80"
              />
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Observações (opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newReading.notes}
              onChangeText={(text) => setNewReading({...newReading, notes: text})}
              placeholder="Ex: Após medicação, em jejum..."
              multiline
            />
          </View>
        </View>
      );
    } else if (selectedTab === 'heartRate') {
      return (
        <View style={styles.formContent}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Frequência Cardíaca (bpm)</Text>
            <TextInput
              style={styles.input}
              value={newReading.heartRate}
              onChangeText={(text) => setNewReading({...newReading, heartRate: text})}
              keyboardType="numeric"
              placeholder="72"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Observações (opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newReading.notes}
              onChangeText={(text) => setNewReading({...newReading, notes: text})}
              placeholder="Ex: Em repouso, após exercício..."
              multiline
            />
          </View>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Monitoramento de Saúde</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={true}>
        {/* Smartwatch Connection */}
        <View style={styles.smartwatchSection}>
          <BluetoothTestButton onHealthDataReceived={handleSmartwatchData} />
        
        {/* Dados em tempo real */}
        {liveSmartwatchData && (
          <View style={styles.liveDataCard}>
            <View style={styles.liveDataHeader}>
              <Bluetooth size={16} color="#10B981" />
              <Text style={styles.liveDataTitle}>Dados ao Vivo</Text>
            </View>
            <View style={styles.liveDataContent}>
              {liveSmartwatchData.heartRate && (
                <View style={styles.liveDataItem}>
                  <Heart size={16} color="#EF4444" />
                  <Text style={styles.liveDataValue}>{liveSmartwatchData.heartRate} bpm</Text>
                </View>
              )}
              {liveSmartwatchData.bloodPressure && (
                <View style={styles.liveDataItem}>
                  <Activity size={16} color="#3B82F6" />
                  <Text style={styles.liveDataValue}>
                    {liveSmartwatchData.bloodPressure.systolic}/{liveSmartwatchData.bloodPressure.diastolic}
                  </Text>
                </View>
              )}
              {liveSmartwatchData.spo2 && (
                <View style={styles.liveDataItem}>
                  <Text style={styles.liveDataLabel}>SpO2:</Text>
                  <Text style={styles.liveDataValue}>{liveSmartwatchData.spo2}%</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'bp' && styles.activeTab]}
          onPress={() => setSelectedTab('bp')}
        >
          <Activity
            size={20}
            color={selectedTab === 'bp' ? '#3B82F6' : '#64748B'}
          />
          <Text
            style={[
              styles.tabText,
              selectedTab === 'bp' && styles.activeTabText
            ]}
          >
            Pressão
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'heartRate' && styles.activeTab]}
          onPress={() => setSelectedTab('heartRate')}
        >
          <Heart
            size={20}
            color={selectedTab === 'heartRate' ? '#3B82F6' : '#64748B'}
          />
          <Text
            style={[
              styles.tabText,
              selectedTab === 'heartRate' && styles.activeTabText
            ]}
          >
            Frequência
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'weight' && styles.activeTab]}
          onPress={() => setSelectedTab('weight')}
        >
          <WeightIcon
            size={20}
            color={selectedTab === 'weight' ? '#3B82F6' : '#64748B'}
          />
          <Text
            style={[
              styles.tabText,
              selectedTab === 'weight' && styles.activeTabText
            ]}
          >
            Peso
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'sleep' && styles.activeTab]}
          onPress={() => setSelectedTab('sleep')}
        >
          <Moon
            size={20}
            color={selectedTab === 'sleep' ? '#3B82F6' : '#64748B'}
          />
          <Text
            style={[
              styles.tabText,
              selectedTab === 'sleep' && styles.activeTabText
            ]}
          >
            Sono
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.contentContainer}>
        {!showAddForm ? (
          <>
            <View style={styles.actionsBar}>
              <View style={styles.titleContainer}>
                <Text style={styles.sectionTitle}>
                  {selectedTab === 'bp' 
                    ? 'Pressão Arterial' 
                    : selectedTab === 'heartRate' 
                      ? 'Frequência Cardíaca' 
                      : selectedTab === 'weight'
                        ? 'Peso'
                        : 'Sono'}
                </Text>
                <Text style={styles.sectionSubtitle}>
                  {selectedTab === 'bp' 
                    ? readings.bp.length
                    : selectedTab === 'heartRate'
                      ? readings.heartRate.length
                      : selectedTab === 'weight'
                        ? readings.weight.length
                        : readings.sleep.length} registros
                </Text>
              </View>
              {(selectedTab === 'weight' || selectedTab === 'sleep') && (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => {
                    if (selectedTab === 'weight') {
                      setShowWeightModal(true);
                    } else {
                      setShowSleepModal(true);
                    }
                  }}
                >
                  <Text style={styles.addButtonText}>+ Adicionar</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={styles.loadingText}>Carregando registros...</Text>
              </View>
            ) : (
              <ScrollView 
                style={styles.readingsList}
                showsVerticalScrollIndicator={true}
              >
                {renderReadingsList()}
              </ScrollView>
            )}
          </>
        ) : (
          <ScrollView style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>
                {selectedTab === 'bp' 
                  ? 'Nova Medição de Pressão' 
                  : selectedTab === 'heartRate' 
                    ? 'Nova Medição de Pulso' 
                    : 'Novo Registro de Peso'}
              </Text>
              <Text style={styles.formSubtitle}>
                {new Date().toLocaleDateString('pt-BR')} • {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            
            {renderAddForm()}
            
            <View style={styles.formActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowAddForm(false);
                  setNewReading({
                    systolic: '',
                    diastolic: '',
                    heartRate: '',
                    weight: '',
                    sleepHours: '',
                    sleepQuality: 'good',
                    notes: '',
                  });
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddReading}
              >
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>
      
      {!showAddForm && selectedTab !== 'weight' && selectedTab !== 'sleep' && (
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Thermometer size={24} color="#FFFFFF" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              {selectedTab === 'bp' 
                ? 'Pressão Arterial Ideal' 
                : 'Frequência Cardíaca Ideal'}
            </Text>
            <Text style={styles.infoText}>
              {selectedTab === 'bp' 
                ? 'Pressão arterial ideal: abaixo de 120/80 mmHg. Monitore regularmente e consulte seu médico se estiver consistentemente acima desses valores.' 
                : 'Frequência cardíaca de repouso ideal: entre 60 e 100 batimentos por minuto. Atletas podem ter valores mais baixos.'}
            </Text>
          </View>
        </View>
      )}
      </ScrollView>

      {/* Modal de Peso */}
      <Modal
        visible={showWeightModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowWeightModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Registrar Peso</Text>
              <TouchableOpacity onPress={() => setShowWeightModal(false)} style={styles.closeButton}>
                <X color="#64748B" size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Peso (kg) *</Text>
                <TextInput
                  style={styles.input}
                  value={newReading.weight}
                  onChangeText={(text) => setNewReading({...newReading, weight: text})}
                  placeholder="Ex: 75.5"
                  placeholderTextColor="#94A3B8"
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Observações (opcional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={newReading.notes}
                  onChangeText={(text) => setNewReading({...newReading, notes: text})}
                  placeholder="Ex: Em jejum, após refeição..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setShowWeightModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalSaveButton}
                onPress={handleAddWeight}
              >
                <Text style={styles.modalSaveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Sono */}
      <Modal
        visible={showSleepModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSleepModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Registrar Sono</Text>
              <TouchableOpacity onPress={() => setShowSleepModal(false)} style={styles.closeButton}>
                <X color="#64748B" size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Horas de Sono *</Text>
                <TextInput
                  style={styles.input}
                  value={newReading.sleepHours}
                  onChangeText={(text) => setNewReading({...newReading, sleepHours: text})}
                  placeholder="Ex: 7.5"
                  placeholderTextColor="#94A3B8"
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Qualidade do Sono *</Text>
                <View style={styles.qualityButtons}>
                  <TouchableOpacity
                    style={[styles.qualityButton, newReading.sleepQuality === 'poor' && styles.qualityButtonActive]}
                    onPress={() => setNewReading({...newReading, sleepQuality: 'poor'})}
                  >
                    <Text style={[styles.qualityButtonText, newReading.sleepQuality === 'poor' && styles.qualityButtonTextActive]}>Ruim</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.qualityButton, newReading.sleepQuality === 'fair' && styles.qualityButtonActive]}
                    onPress={() => setNewReading({...newReading, sleepQuality: 'fair'})}
                  >
                    <Text style={[styles.qualityButtonText, newReading.sleepQuality === 'fair' && styles.qualityButtonTextActive]}>Regular</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.qualityButton, newReading.sleepQuality === 'good' && styles.qualityButtonActive]}
                    onPress={() => setNewReading({...newReading, sleepQuality: 'good'})}
                  >
                    <Text style={[styles.qualityButtonText, newReading.sleepQuality === 'good' && styles.qualityButtonTextActive]}>Bom</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.qualityButton, newReading.sleepQuality === 'excellent' && styles.qualityButtonActive]}
                    onPress={() => setNewReading({...newReading, sleepQuality: 'excellent'})}
                  >
                    <Text style={[styles.qualityButtonText, newReading.sleepQuality === 'excellent' && styles.qualityButtonTextActive]}>Excelente</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Observações (opcional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={newReading.notes}
                  onChangeText={(text) => setNewReading({...newReading, notes: text})}
                  placeholder="Ex: Acordei várias vezes..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setShowSleepModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalSaveButton}
                onPress={handleAddSleep}
              >
                <Text style={styles.modalSaveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#334155',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 4,
  },
  activeTabText: {
    color: '#3B82F6',
  },
  contentContainer: {
    flex: 1,
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  titleContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  readingsList: {
    padding: 16,
    paddingTop: 0,
    maxHeight: 400,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
  readingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  readingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  readingDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 6,
  },
  timeText: {
    fontSize: 14,
    color: '#94A3B8',
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  readingValues: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  bpValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  bpNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#334155',
  },
  bpUnit: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  bpSeparator: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#334155',
    marginHorizontal: 12,
  },
  readingNotes: {
    fontSize: 14,
    color: '#64748B',
    fontStyle: 'italic',
  },
  hrValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  hrValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#334155',
    marginLeft: 8,
  },
  hrUnit: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  weightValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 12,
  },
  weightValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#334155',
  },
  weightUnit: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  formHeader: {
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
  },
  formSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  formContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inputHalf: {
    width: '48%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#334155',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  smartwatchSection: {
    padding: 16,
    backgroundColor: '#F8FAFC',
  },
  liveDataCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  liveDataHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  liveDataTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#065F46',
  },
  liveDataContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  liveDataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  liveDataLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#064E3B',
  },
  liveDataValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065F46',
  },
  sleepValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  sleepValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#334155',
    marginLeft: 8,
  },
  sleepUnit: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#334155',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  qualityButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  qualityButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  qualityButtonActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  qualityButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  qualityButtonTextActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  modalSaveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
  },
  modalSaveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
