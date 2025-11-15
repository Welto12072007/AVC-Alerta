 import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import bluetoothService from '../services/bluetoothService';
import { BluetoothDevice } from '../types/health';
import { FotolaProtocolParser, FotolaHealthData } from '../services/fotolaProtocolParser';

/**
 * COMPONENTE DE TESTE DE BLUETOOTH
 * 
 * Como usar:
 * 1. Importe no monitoring.tsx:
 *    import { BluetoothTestButton } from '../../components/BluetoothTestButton';
 * 
 * 2. Adicione no JSX:
 *    <BluetoothTestButton />
 */

interface BluetoothTestButtonProps {
  onHealthDataReceived?: (data: FotolaHealthData) => void;
}

export const BluetoothTestButton = ({ onHealthDataReceived }: BluetoothTestButtonProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<string | null>(null);
  const [latestData, setLatestData] = useState<FotolaHealthData | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const shouldProcessData = useRef(true); // Controle de processamento usando ref

  const handleScan = async () => {
    try {
      console.log('🔍 Iniciando scan Bluetooth...');
      
      // Verificar permissões primeiro
      const hasPermissions = await bluetoothService.requestPermissions();
      console.log('🔐 Permissões concedidas:', hasPermissions);
      
      if (!hasPermissions) {
        Alert.alert(
          '⚠️ Permissões Necessárias',
          'Para procurar dispositivos Bluetooth, precisamos de:\n\n' +
          '• Permissão de Bluetooth\n' +
          '• Permissão de Localização\n\n' +
          'Por favor, aceite as permissões quando solicitado.'
        );
        return;
      }
      
      // Verificar se Bluetooth está ativo
      const isEnabled = await bluetoothService.isBluetoothEnabled();
      console.log('📡 Bluetooth ativo:', isEnabled);
      
      if (!isEnabled) {
        Alert.alert(
          '⚠️ Bluetooth Desligado',
          'Por favor, ative o Bluetooth nas configurações do seu celular.'
        );
        return;
      }
      
      setIsScanning(true);
      setDevices([]);
      
      Alert.alert(
        'Procurando Dispositivos',
        'Aguarde 15 segundos enquanto procuramos TODOS os dispositivos Bluetooth próximos...'
      );

      await bluetoothService.startScan((device) => {
        setDevices(prev => {
          const exists = prev.find(d => d.id === device.id);
          if (!exists) {
            console.log('📱 Dispositivo encontrado:', device.name || 'Sem nome', '| ID:', device.id, '| Sinal:', device.rssi, 'dBm');
            return [...prev, device];
          }
          return prev;
        });
      }, 15000);

      setTimeout(() => {
        setIsScanning(false);
        console.log('⏱️ Scan finalizado. Total de dispositivos:', devices.length);
      }, 15000);

    } catch (error: any) {
      console.error('❌ Erro ao escanear:', error);
      setIsScanning(false);
      Alert.alert('Erro', error.message);
    }
  };

  const handleConnect = async (deviceId: string, deviceName: string) => {
    try {
      console.log('🔌 Tentando conectar...');
      console.log('   Dispositivo:', deviceName);
      console.log('   ID:', deviceId);
      
      Alert.alert(
        'Conectando...',
        `Tentando conectar ao ${deviceName}`
      );

      const success = await bluetoothService.connect(deviceId);
      console.log('🔗 Resultado da conexão:', success);
      
      if (success) {
        setIsConnected(true);
        setConnectedDevice(deviceName);
        
        console.log('✅ CONECTADO COM SUCESSO!');
        setIsMonitoring(true);
        shouldProcessData.current = true;
        
        // Iniciar monitoramento automático e parsear dados
        bluetoothService.monitorFotolaData((rawData) => {
          // Se flag desativada, retornar imediatamente (economia de processamento)
          if (!shouldProcessData.current) {
            return;
          }
          
          // Parsear protocolo do Fotola
          const parsedData = FotolaProtocolParser.parse(rawData.bytes);
          
          // APENAS enviar se retornou dados válidos (não null)
          // Durante medição, parse() retorna null até terminar
          if (parsedData && FotolaProtocolParser.isValid(parsedData)) {
            console.log('✅ DADOS DE SAÚDE EXTRAÍDOS (enviando para tela):', parsedData);
            setLatestData(parsedData);
            
            // Enviar para tela de monitoramento
            if (onHealthDataReceived) {
              onHealthDataReceived(parsedData);
            }
            
            // DESATIVAR processamento após registrar (economiza recursos)
            shouldProcessData.current = false;
            console.log('⏸️ Medição registrada - processamento pausado (economizando recursos)');
            
            // Reativar processamento após 10 segundos automaticamente
            setTimeout(() => {
              shouldProcessData.current = true;
              console.log('✅ Pronto para nova medição');
            }, 10000);
          } else if (parsedData === null) {
            console.log('⏳ Medição em progresso... (não enviando para tela ainda)');
          }
        }).catch(err => {
          console.log('ℹ️ Monitoramento:', err);
        });
        
        Alert.alert(
          '✅ Conectado!',
          `Conectado ao ${deviceName}!\n\nFaça uma medição no smartwatch e os dados aparecerão automaticamente.`
        );
      } else {
        console.error('❌ Falha na conexão (retornou false)');
        Alert.alert('Erro', 'Falha ao conectar ao dispositivo');
      }
    } catch (error: any) {
      Alert.alert('Erro ao Conectar', error.message);
    }
  };

  const handleDisconnect = async () => {
    shouldProcessData.current = false; // Parar processamento
    await bluetoothService.disconnect();
    setIsConnected(false);
    setConnectedDevice(null);
    setIsMonitoring(false);
    Alert.alert('Desconectado', 'Dispositivo desconectado');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Conectar com Bluetooth</Text>
      </View>

      {isConnected ? (
        <View style={styles.connectedContainer}>
          <View style={styles.connectedBadge}>
            <Text style={styles.connectedIcon}>✅</Text>
            <View>
              <Text style={styles.connectedLabel}>Conectado e Monitorando</Text>
              <Text style={styles.connectedDevice}>{connectedDevice}</Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.disconnectButton}
            onPress={handleDisconnect}
          >
            <Text style={styles.disconnectButtonText}>Desconectar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <TouchableOpacity
            style={[styles.scanButton, isScanning && styles.scanButtonDisabled]}
            onPress={handleScan}
            disabled={isScanning}
          >
            <Text style={styles.scanButtonText}>
              {isScanning ? '⏳ Procurando...' : '🔍 Procurar Smartwatch'}
            </Text>
          </TouchableOpacity>

          {devices.length > 0 && (
            <View style={styles.devicesList}>
              <Text style={styles.devicesTitle}>
                📱 Dispositivos encontrados ({devices.length})
              </Text>
              {devices.map((device) => (
                <TouchableOpacity
                  key={device.id}
                  style={styles.deviceItem}
                  onPress={() => handleConnect(device.id, device.name || 'Sem nome')}
                >
                  <View style={styles.deviceIcon}>
                    <Text style={styles.deviceIconText}>⌚</Text>
                  </View>
                  <View style={styles.deviceInfo}>
                    <Text style={styles.deviceName}>
                      {device.name || 'Dispositivo sem nome'}
                    </Text>
                    {device.rssi && (
                      <Text style={styles.deviceSignal}>
                        Sinal: {device.rssi} dBm
                      </Text>
                    )}
                  </View>
                  <Text style={styles.deviceArrow}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {!isScanning && devices.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Nenhum dispositivo encontrado ainda
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Clique em "Procurar Smartwatch" para começar
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFF',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
  },

  connectedContainer: {
    marginBottom: 16,
  },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  connectedIcon: {
    fontSize: 32,
  },
  connectedLabel: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '600',
  },
  connectedDevice: {
    fontSize: 16,
    color: '#064E3B',
    fontWeight: '700',
    marginTop: 2,
  },
  disconnectButton: {
    backgroundColor: '#EF4444',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disconnectButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scanButton: {
    backgroundColor: '#3B82F6',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  scanButtonDisabled: {
    opacity: 0.6,
  },
  scanButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  devicesList: {
    marginTop: 8,
    marginBottom: 16,
  },
  devicesTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 12,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  deviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceIconText: {
    fontSize: 24,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  deviceSignal: {
    fontSize: 12,
    color: '#64748B',
  },
  deviceArrow: {
    fontSize: 28,
    color: '#CBD5E1',
    fontWeight: '300',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
  },
});
