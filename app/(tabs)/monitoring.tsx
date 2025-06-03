import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Link } from 'expo-router';
import { Heart, Activity, ArrowRight, ArrowLeft, Calendar, Thermometer, ChartBar as BarChart3 } from 'lucide-react-native';

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

interface NewReading {
  systolic: string;
  diastolic: string;
  heartRate: string;
  weight: string;
  notes: string;
}

interface Readings {
  bp: BPReading[];
  heartRate: HeartRateReading[];
  weight: WeightReading[];
}

type TabType = 'bp' | 'heartRate' | 'weight';

export default function MonitoringScreen() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedTab, setSelectedTab] = useState<TabType>('bp');
  const [readings, setReadings] = useState<Readings>({
    bp: [],
    heartRate: [],
    weight: [],
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReading, setNewReading] = useState<NewReading>({
    systolic: '',
    diastolic: '',
    heartRate: '',
    weight: '',
    notes: '',
  });

  // Simulated data
  useEffect(() => {
    // In a real app, would load from storage
    const mockData: Readings = {
      bp: [
        { id: 1, date: new Date(2023, 5, 1, 8, 30), systolic: 135, diastolic: 85, notes: 'Após medicação' },
        { id: 2, date: new Date(2023, 5, 1, 20, 15), systolic: 140, diastolic: 88, notes: 'Antes de dormir' },
        { id: 3, date: new Date(2023, 5, 2, 8, 45), systolic: 132, diastolic: 84, notes: 'Em jejum' },
      ],
      heartRate: [
        { id: 1, date: new Date(2023, 5, 1, 8, 30), value: 72, notes: 'Em repouso' },
        { id: 2, date: new Date(2023, 5, 1, 14, 15), value: 85, notes: 'Após caminhada' },
        { id: 3, date: new Date(2023, 5, 2, 8, 45), value: 70, notes: 'Em jejum' },
      ],
      weight: [
        { id: 1, date: new Date(2023, 5, 1, 8, 0), value: 78.5, notes: 'Em jejum' },
        { id: 2, date: new Date(2023, 5, 8, 8, 0), value: 78.2, notes: 'Em jejum' },
      ],
    };
    setReadings(mockData);
  }, []);

  const handleAddReading = () => {
    const now = new Date();
    
    if (selectedTab === 'bp') {
      if (!newReading.systolic || !newReading.diastolic) {
        alert('Por favor, preencha os valores sistólica e diastólica');
        return;
      }
      
      const newId = readings.bp.length > 0 ? Math.max(...readings.bp.map(r => r.id)) + 1 : 1;
      const newBpReading: BPReading = {
        id: newId,
        date: now,
        systolic: parseInt(newReading.systolic, 10),
        diastolic: parseInt(newReading.diastolic, 10),
        notes: newReading.notes,
      };
      
      setReadings({
        ...readings,
        bp: [...readings.bp, newBpReading],
      });
    } else if (selectedTab === 'heartRate') {
      if (!newReading.heartRate) {
        alert('Por favor, preencha o valor da frequência cardíaca');
        return;
      }
      
      const newId = readings.heartRate.length > 0 ? Math.max(...readings.heartRate.map(r => r.id)) + 1 : 1;
      const newHrReading: HeartRateReading = {
        id: newId,
        date: now,
        value: parseInt(newReading.heartRate, 10),
        notes: newReading.notes,
      };
      
      setReadings({
        ...readings,
        heartRate: [...readings.heartRate, newHrReading],
      });
    } else if (selectedTab === 'weight') {
      if (!newReading.weight) {
        alert('Por favor, preencha o valor do peso');
        return;
      }
      
      const newId = readings.weight.length > 0 ? Math.max(...readings.weight.map(r => r.id)) + 1 : 1;
      const newWeightReading: WeightReading = {
        id: newId,
        date: now,
        value: parseFloat(newReading.weight),
        notes: newReading.notes,
      };
      
      setReadings({
        ...readings,
        weight: [...readings.weight, newWeightReading],
      });
    }
    
    setNewReading({
      systolic: '',
      diastolic: '',
      heartRate: '',
      weight: '',
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
    } else if (selectedTab === 'weight') {
      return (
        <View style={styles.formContent}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Peso (kg)</Text>
            <TextInput
              style={styles.input}
              value={newReading.weight}
              onChangeText={(text) => setNewReading({...newReading, weight: text})}
              keyboardType="numeric"
              placeholder="75.5"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Observações (opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newReading.notes}
              onChangeText={(text) => setNewReading({...newReading, notes: text})}
              placeholder="Ex: Em jejum, após refeição..."
              multiline
            />
          </View>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Monitoramento de Saúde</Text>
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
          <BarChart3
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
                      : 'Peso'}
                </Text>
                <Text style={styles.sectionSubtitle}>
                  {readings[selectedTab === 'bp' ? 'bp' : selectedTab === 'heartRate' ? 'heartRate' : 'weight'].length} registros
                </Text>
              </View>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowAddForm(true)}
              >
                <Text style={styles.addButtonText}>+ Adicionar</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.readingsList}>
              {renderReadingsList()}
            </ScrollView>
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
      
      {!showAddForm && (
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Thermometer size={24} color="#FFFFFF" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              {selectedTab === 'bp' 
                ? 'Pressão Arterial Ideal' 
                : selectedTab === 'heartRate' 
                  ? 'Frequência Cardíaca Ideal' 
                  : 'Dica sobre Peso'}
            </Text>
            <Text style={styles.infoText}>
              {selectedTab === 'bp' 
                ? 'Pressão arterial ideal: abaixo de 120/80 mmHg. Monitore regularmente e consulte seu médico se estiver consistentemente acima desses valores.' 
                : selectedTab === 'heartRate' 
                  ? 'Frequência cardíaca de repouso ideal: entre 60 e 100 batimentos por minuto. Atletas podem ter valores mais baixos.' 
                  : 'Mantenha um peso saudável através de alimentação balanceada e atividade física regular. Consulte seu médico para definir seu peso ideal.'}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
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
    flex: 1,
    padding: 16,
    paddingTop: 0,
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
  in
foCard: {
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
});