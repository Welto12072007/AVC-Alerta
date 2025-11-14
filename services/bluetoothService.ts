import { BleManager, Device, State, Characteristic } from 'react-native-ble-plx';
import { Platform, PermissionsAndroid } from 'react-native';
import { decode as atob, encode as btoa } from 'base-64';
import {
  BluetoothDevice,
  BluetoothConnectionStatus,
  BLE_SERVICE_UUIDS,
  BLE_CHARACTERISTIC_UUIDS,
  HeartRateReading,
  BloodPressureReading,
  HealthMetricType
} from '../types/health';

class BluetoothService {
  private manager: BleManager;
  private connectedDevice: Device | null = null;
  private scanTimeout: any = null;
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    this.manager = new BleManager();
    this.initializeBluetooth();
  }

  private async initializeBluetooth() {
    const subscription = this.manager.onStateChange((state) => {
      if (state === State.PoweredOn) {
        console.log('✅ Bluetooth is powered on');
        subscription.remove();
      }
    }, true);
  }

  // Solicitar permissões necessárias (Android 12+)
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 31) {
        // Android 12+
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        return (
          granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
        );
      } else {
        // Android < 12
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    }
    return true; // iOS não precisa de permissões runtime adicionais
  }

  // Verificar se Bluetooth está ativo
  async isBluetoothEnabled(): Promise<boolean> {
    const state = await this.manager.state();
    return state === State.PoweredOn;
  }

  // Escanear dispositivos BLE
  async startScan(
    onDeviceFound: (device: BluetoothDevice) => void,
    durationMs: number = 10000
  ): Promise<void> {
    const hasPermissions = await this.requestPermissions();
    if (!hasPermissions) {
      throw new Error('Permissões Bluetooth não concedidas');
    }

    const isEnabled = await this.isBluetoothEnabled();
    if (!isEnabled) {
      throw new Error('Bluetooth não está ativo. Por favor, ative o Bluetooth.');
    }

    // Limpar scan anterior
    if (this.scanTimeout) {
      clearTimeout(this.scanTimeout);
    }

    console.log('🔍 Iniciando scan de dispositivos BLE...');

    const foundDevices = new Set<string>();

    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('❌ Erro ao escanear:', error);
        return;
      }

      if (device && !foundDevices.has(device.id)) {
        foundDevices.add(device.id);
        
        // MODO DEBUG: Mostrar TODOS os dispositivos encontrados
        console.log(`📡 Dispositivo BLE detectado: ${device.name || 'SEM NOME'} | ID: ${device.id} | Sinal: ${device.rssi} dBm`);
        
        // Mostrar TODOS os dispositivos (não apenas smartwatches)
        if (device.name) {
          console.log(`   ✅ Adicionando à lista: ${device.name}`);
          onDeviceFound({
            id: device.id,
            name: device.name,
            rssi: device.rssi || undefined,
            isConnected: false
          });
        } else {
          console.log(`   ⚠️ Dispositivo sem nome, pulando...`);
        }
      }
    });

    // Parar scan após duração especificada
    this.scanTimeout = setTimeout(() => {
      this.stopScan();
      console.log('⏹️ Scan finalizado');
    }, durationMs);
  }

  // Parar scan
  stopScan(): void {
    this.manager.stopDeviceScan();
    if (this.scanTimeout) {
      clearTimeout(this.scanTimeout);
      this.scanTimeout = null;
    }
  }

  // Conectar a um dispositivo
  async connect(deviceId: string): Promise<boolean> {
    try {
      console.log(`🔗 Conectando ao dispositivo: ${deviceId}`);
      
      const device = await this.manager.connectToDevice(deviceId, {
        timeout: 10000
      });

      console.log(`✅ Conectado a: ${device.name}`);
      
      await device.discoverAllServicesAndCharacteristics();
      console.log('📋 Serviços e características descobertos');
      
      this.connectedDevice = device;
      
      // Configurar listener para desconexão
      device.onDisconnected((error, device) => {
        console.log(`❌ Dispositivo desconectado: ${device?.name}`);
        this.connectedDevice = null;
        this.emit('deviceDisconnected', { deviceId: device?.id, error });
      });

      this.emit('deviceConnected', { deviceId: device.id, name: device.name });
      
      return true;
    } catch (error) {
      console.error('❌ Erro ao conectar:', error);
      throw new Error(`Falha ao conectar: ${error}`);
    }
  }

  // Descobrir serviços e características do dispositivo
  async discoverServices(deviceId: string): Promise<Array<{
    uuid: string;
    characteristics: Array<{
      uuid: string;
      properties: string[];
    }>;
  }>> {
    try {
      const device = await this.manager.connectToDevice(deviceId);
      await device.discoverAllServicesAndCharacteristics();
      
      const services = await device.services();
      const result = [];
      
      for (const service of services) {
        const characteristics = await service.characteristics();
        
        result.push({
          uuid: service.uuid,
          characteristics: characteristics.map(char => ({
            uuid: char.uuid,
            properties: [
              char.isReadable ? 'READ' : '',
              char.isWritableWithResponse ? 'WRITE' : '',
              char.isWritableWithoutResponse ? 'WRITE_NO_RESPONSE' : '',
              char.isNotifiable ? 'NOTIFY' : '',
              char.isIndicatable ? 'INDICATE' : '',
            ].filter(p => p !== '')
          }))
        });
      }
      
      return result;
    } catch (error) {
      console.error('Erro ao descobrir serviços:', error);
      throw error;
    }
  }

  // Desconectar dispositivo
  async disconnect(): Promise<void> {
    if (this.connectedDevice) {
      try {
        await this.manager.cancelDeviceConnection(this.connectedDevice.id);
        console.log('🔌 Dispositivo desconectado');
        this.connectedDevice = null;
      } catch (error) {
        console.error('❌ Erro ao desconectar:', error);
      }
    }
  }

  // Verificar se está conectado
  isConnected(): boolean {
    return this.connectedDevice !== null;
  }

  // Obter dispositivo conectado
  getConnectedDevice(): Device | null {
    return this.connectedDevice;
  }

  // Monitorar TODAS as características do Fotola S20 que podem enviar dados
  async monitorFotolaData(callback: (data: any) => void): Promise<void> {
    if (!this.connectedDevice) {
      throw new Error('Nenhum dispositivo conectado');
    }

    console.log('📡 Iniciando monitoramento completo do Fotola S20...');
    
    // Função helper para processar dados recebidos
    const processData = (characteristic: any, source: string) => {
      if (characteristic?.value) {
        try {
          const decodedData = atob(characteristic.value);
          const bytes = decodedData.split('').map((c: string) => c.charCodeAt(0));
          const hexData = bytes.map(b => b.toString(16).padStart(2, '0')).join(' ');
          
          console.log(`\n📥 Dados de ${source}:`);
          console.log('   Hex:', hexData);
          console.log('   Bytes:', bytes);
          console.log('   String:', decodedData);
          
          callback({ 
            source,
            raw: decodedData,
            hex: hexData,
            bytes: bytes,
            timestamp: new Date()
          });
        } catch (error) {
          console.error(`Erro ao processar ${source}:`, error);
        }
      }
    };

    // Monitorar serviço FFFF (0x0000ffff) - Característic 0xff11 (NOTIFY)
    try {
      console.log('🔔 Monitorando 0x0000ffff / 0x0000ff11 (NOTIFY)...');
      this.connectedDevice.monitorCharacteristicForService(
        BLE_SERVICE_UUIDS.FOTOLA_CUSTOM_SERVICE,
        BLE_CHARACTERISTIC_UUIDS.FOTOLA_NOTIFY,
        (error, char) => {
          if (error) {
            console.log('⚠️ Serviço FFFF/FF11 não disponível');
            return;
          }
          processData(char, 'CUSTOM_SERVICE_FF11');
        }
      );
    } catch (e) {
      console.log('⚠️ Não foi possível monitorar FFFF/FF11');
    }

    // Monitorar serviço 3802 (0x00003802) - Característica 0x4a02
    try {
      console.log('🔔 Monitorando 0x00003802 / 0x00004a02...');
      this.connectedDevice.monitorCharacteristicForService(
        BLE_SERVICE_UUIDS.FOTOLA_HEALTH_SERVICE,
        BLE_CHARACTERISTIC_UUIDS.FOTOLA_HEALTH_DATA,
        (error, char) => {
          if (error) {
            console.log('⚠️ Serviço 3802/4A02 não disponível');
            return;
          }
          processData(char, 'HEALTH_SERVICE_4A02');
        }
      );
    } catch (e) {
      console.log('⚠️ Não foi possível monitorar 3802/4A02');
    }

    // Monitorar Nordic UART (6e400801) - RX
    try {
      console.log('🔔 Monitorando 0x6e400801 / RX...');
      this.connectedDevice.monitorCharacteristicForService(
        BLE_SERVICE_UUIDS.FOTOLA_UART,
        BLE_CHARACTERISTIC_UUIDS.FOTOLA_RX,
        (error, char) => {
          if (error) {
            console.log('⚠️ Nordic UART RX não disponível');
            return;
          }
          processData(char, 'NORDIC_UART_RX');
        }
      );
    } catch (e) {
      console.log('⚠️ Não foi possível monitorar Nordic UART');
    }

    // Monitorar Battery Level (pode indicar quando smartwatch está ativo)
    try {
      console.log('🔔 Monitorando nível de bateria...');
      this.connectedDevice.monitorCharacteristicForService(
        BLE_SERVICE_UUIDS.BATTERY,
        BLE_CHARACTERISTIC_UUIDS.BATTERY_LEVEL,
        (error, char) => {
          if (error) return;
          if (char?.value) {
            const battery = atob(char.value).charCodeAt(0);
            console.log(`🔋 Bateria: ${battery}%`);
          }
        }
      );
    } catch (e) {
      console.log('⚠️ Não foi possível monitorar bateria');
    }

    console.log('✅ Monitoramento ativo! Faça uma medição no smartwatch agora.');
  }

  // Enviar comando para o Fotola S20 (ex: solicitar medição de BPM)
  async sendFotolaCommand(command: string): Promise<void> {
    if (!this.connectedDevice) {
      throw new Error('Nenhum dispositivo conectado');
    }

    try {
      // Converter string para base64
      const data = btoa(command);
      await this.connectedDevice.writeCharacteristicWithResponseForService(
        BLE_SERVICE_UUIDS.FOTOLA_UART,
        BLE_CHARACTERISTIC_UUIDS.FOTOLA_TX,
        data
      );
      console.log('📤 Comando enviado para Fotola:', command);
    } catch (error) {
      console.error('❌ Erro ao enviar comando:', error);
      throw error;
    }
  }

  // Monitorar frequência cardíaca
  async monitorHeartRate(callback: (heartRate: number) => void): Promise<void> {
    if (!this.connectedDevice) {
      throw new Error('Nenhum dispositivo conectado');
    }

    try {
      console.log('❤️ Iniciando monitoramento de frequência cardíaca...');
      
      this.connectedDevice.monitorCharacteristicForService(
        BLE_SERVICE_UUIDS.HEART_RATE,
        BLE_CHARACTERISTIC_UUIDS.HEART_RATE_MEASUREMENT,
        (error, characteristic) => {
          if (error) {
            console.error('❌ Erro ao monitorar frequência cardíaca:', error);
            return;
          }

          if (characteristic?.value) {
            const heartRate = this.parseHeartRateData(characteristic.value);
            console.log(`💓 Frequência cardíaca: ${heartRate} bpm`);
            callback(heartRate);
          }
        }
      );
    } catch (error) {
      console.error('❌ Erro ao iniciar monitoramento:', error);
      throw error;
    }
  }

  // Monitorar pressão arterial
  async monitorBloodPressure(
    callback: (systolic: number, diastolic: number) => void
  ): Promise<void> {
    if (!this.connectedDevice) {
      throw new Error('Nenhum dispositivo conectado');
    }

    try {
      console.log('🩺 Iniciando monitoramento de pressão arterial...');
      
      this.connectedDevice.monitorCharacteristicForService(
        BLE_SERVICE_UUIDS.BLOOD_PRESSURE,
        BLE_CHARACTERISTIC_UUIDS.BLOOD_PRESSURE_MEASUREMENT,
        (error, characteristic) => {
          if (error) {
            console.error('❌ Erro ao monitorar pressão arterial:', error);
            return;
          }

          if (characteristic?.value) {
            const { systolic, diastolic } = this.parseBloodPressureData(characteristic.value);
            console.log(`🩺 Pressão arterial: ${systolic}/${diastolic} mmHg`);
            callback(systolic, diastolic);
          }
        }
      );
    } catch (error) {
      console.error('❌ Erro ao iniciar monitoramento:', error);
      throw error;
    }
  }

  // Ler nível de bateria
  async readBatteryLevel(): Promise<number> {
    if (!this.connectedDevice) {
      throw new Error('Nenhum dispositivo conectado');
    }

    try {
      const characteristic = await this.connectedDevice.readCharacteristicForService(
        BLE_SERVICE_UUIDS.BATTERY,
        BLE_CHARACTERISTIC_UUIDS.BATTERY_LEVEL
      );

      if (characteristic.value) {
        const buffer = Buffer.from(characteristic.value, 'base64');
        return buffer.readUInt8(0);
      }
      return 0;
    } catch (error) {
      console.warn('⚠️ Não foi possível ler nível de bateria:', error);
      return 0;
    }
  }

  // Parser para dados de frequência cardíaca (padrão BLE Heart Rate)
  private parseHeartRateData(base64Value: string): number {
    const buffer = Buffer.from(base64Value, 'base64');
    const flags = buffer.readUInt8(0);
    const is16Bit = (flags & 0x01) !== 0;
    
    if (is16Bit) {
      return buffer.readUInt16LE(1);
    } else {
      return buffer.readUInt8(1);
    }
  }

  // Parser para dados de pressão arterial (padrão BLE Blood Pressure)
  private parseBloodPressureData(base64Value: string): { systolic: number; diastolic: number } {
    const buffer = Buffer.from(base64Value, 'base64');
    
    // Formato padrão: Flags (1 byte) + Systolic (2 bytes) + Diastolic (2 bytes) + MAP (2 bytes)
    const systolic = buffer.readUInt16LE(1);
    const diastolic = buffer.readUInt16LE(3);
    
    return { systolic, diastolic };
  }

  // Sistema de eventos
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // Limpar recursos
  destroy(): void {
    this.stopScan();
    this.disconnect();
    this.manager.destroy();
    this.listeners.clear();
  }
}

// Exportar instância singleton
export const bluetoothService = new BluetoothService();
export default bluetoothService;
