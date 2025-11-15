/**
 * PARSER DO PROTOCOLO FOTOLA S20 ULTRA
 * 
 * Baseado nos dados capturados:
 * cd 00 11 15 01 0e 00 0c 32 21 00 01 00 00 [XX XX] [YY] [ZZ] [AA] [BB]
 * 
 * Estrutura identificada:
 * - Byte 0: 0xCD (Header)
 * - Byte 1-2: Comprimento da mensagem
 * - Byte 3: Tipo de mensagem (0x15 = dados de saúde)
 * - Byte 14-15: Contador/Timestamp
 * - Bytes finais: Dados de saúde
 */

export interface FotolaHealthData {
  heartRate?: number;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  spo2?: number;
  steps?: number;
  timestamp: Date;
  raw: number[];
}

export class FotolaProtocolParser {
  // Acumulador para medição em progresso
  private static measurementBuffer: {
    lastBPM: number | null;
    lastUpdate: number;
    isActive: boolean;
    stableCount: number; // Contador de valores iguais consecutivos
    measurementStart: number; // Timestamp do início da medição
    // Cooldown para evitar múltiplas medições seguidas
    lastMeasurementReturn: number;
  } = {
    lastBPM: null,
    lastUpdate: 0,
    isActive: false,
    stableCount: 0,
    measurementStart: 0,
    lastMeasurementReturn: 0
  };
  
  // Limpar buffer se passou mais de 5 segundos (medição encerrada)
  private static clearBufferIfOld(): void {
    const now = Date.now();
    if (now - this.measurementBuffer.lastUpdate > 5000) {
      this.measurementBuffer.lastBPM = null;
      this.measurementBuffer.isActive = false;
      this.measurementBuffer.stableCount = 0;
      this.measurementBuffer.measurementStart = 0;
    }
  }
  
  // Verificar se está em cooldown (para evitar múltiplas medições seguidas)
  private static isInCooldown(): boolean {
    const now = Date.now();
    const cooldownPeriod = 5000; // 5 segundos de cooldown após cada medição
    return (now - this.measurementBuffer.lastMeasurementReturn) < cooldownPeriod;
  }
  /**
   * Parsear dados brutos do Fotola S20
   */
  static parse(bytes: number[]): FotolaHealthData | null {
    if (!bytes || bytes.length < 6) {
      console.log('⚠️ Dados muito curtos:', bytes?.length);
      return null;
    }

    // Verificar header (0xCD)
    if (bytes[0] !== 0xCD) {
      console.log('⚠️ Header inválido:', bytes[0].toString(16));
      return null;
    }

    const messageType = bytes[3];
    const result: FotolaHealthData = {
      timestamp: new Date(),
      raw: bytes
    };

    console.log(`\n🔍 Analisando mensagem tipo 0x${messageType.toString(16)} (${bytes.length} bytes):`);
    
    // Verificar cooldown APENAS se não há medição de BPM em andamento
    // Se isActive=true, significa que está medindo BPM e deve continuar processando
    if (!this.measurementBuffer.isActive && this.isInCooldown()) {
      console.log('⏸️ Em cooldown - ignorando medição (aguarde 5s após última medição)');
      return null;
    }

    // Tipo 0x15: Dados de saúde contínuos
    // Formato curto: cd 00 06 15 01 XX 00 01 YY (9 bytes)
    // Formato longo: cd 00 11 15 01 0e 00 0c 32 21 00 01 00 00 [XX XX] [AA] [BB] [CC] [DD] (20+ bytes)
    if (messageType === 0x15) {
      // FORMATO CURTO (9 bytes) - Dados em tempo real durante medição
      if (bytes.length === 9) {
        console.log('   📱 Formato curto detectado (medição em progresso)');
        
        // Limpar buffer se medição antiga
        this.clearBufferIfOld();
        
        // Byte 5: Contador/tipo (0x12, 0x13, etc - muda durante medição)
        const subType = bytes[5];
        // Byte 8: Valor da medição
        const value = bytes[8];
        
        console.log(`   SubTipo: 0x${subType.toString(16)} (${subType})`);
        console.log(`   Valor: ${value}`);
        
        // BPM: detectar valor estável (quando smartwatch para de contar)
        if (value >= 40 && value <= 120 && value !== 77) {
          const now = Date.now();
          this.measurementBuffer.lastUpdate = now;
          
          // Registrar início da medição
          if (!this.measurementBuffer.isActive) {
            this.measurementBuffer.measurementStart = now;
            this.measurementBuffer.isActive = true;
            console.log(`   🎬 INÍCIO DA MEDIÇÃO DE BPM (${value})`);
          }
          
          // Calcular tempo decorrido desde o início
          const elapsedTime = now - this.measurementBuffer.measurementStart;
          
          // Verificar se é o mesmo valor da última leitura
          if (this.measurementBuffer.lastBPM === value) {
            this.measurementBuffer.stableCount++;
            console.log(`   📊 BPM estável: ${value} (${this.measurementBuffer.stableCount}x consecutivas, ${Math.round(elapsedTime/1000)}s decorridos)`);
            
            // Condições para considerar medição completa:
            // 1. Mesmo valor recebido 2x seguidas (reduzido de 3 para ser mais rápido)
            // 2. Pelo menos 1.5 segundos desde o início da medição
            if (this.measurementBuffer.stableCount >= 2 && elapsedTime >= 1500) {
              result.heartRate = value;
              console.log(`   ✅ BPM FINAL DETECTADO: ${value} bpm (estável após ${Math.round(elapsedTime/1000)}s)`);
              
              // Marcar timestamp de retorno (cooldown)
              this.measurementBuffer.lastMeasurementReturn = Date.now();
              
              // Limpar buffer
              this.measurementBuffer.lastBPM = null;
              this.measurementBuffer.stableCount = 0;
              this.measurementBuffer.isActive = false;
              this.measurementBuffer.measurementStart = 0;
              
              return result;
            } else if (this.measurementBuffer.stableCount >= 2) {
              console.log(`   ⏳ Valor estável mas aguardando tempo mínimo (${Math.round((1500 - elapsedTime)/1000)}s restantes)`);
            }
          } else {
            // Valor mudou, resetar contador
            this.measurementBuffer.lastBPM = value;
            this.measurementBuffer.stableCount = 1;
            console.log(`   ⏳ BPM mudou para: ${value} (${Math.round(elapsedTime/1000)}s decorridos, aguardando estabilizar...)`);
          }
          
          // NÃO retornar ainda - aguardando valor estabilizar E tempo mínimo
          return null;
        }
        
        // Nenhum dado útil neste pacote (SpO2 não é processado em formato curto)
        console.log('   ℹ️ Aguardando mais dados...');
        return null;
      }
      
      // FORMATO LONGO (20+ bytes) - Dados completos
      else if (bytes.length >= 20) {
        // Se está fazendo medição de BPM dedicado, IGNORAR pacotes longos
        if (this.measurementBuffer.isActive) {
          console.log('   ⏸️ Ignorando pacote longo (medição de BPM dedicado em andamento)');
          return null;
        }
        
        // Análise dos bytes finais (variam conforme medição)
        // Padrão observado: cd 00 11 15 01 0e 00 0c 32 21 00 01 00 00 [XX XX] [AA] [BB] [CC] [DD]
        
        // Bytes 14-15: Contador (muda a cada 5 segundos)
        const counter = (bytes[14] << 8) | bytes[15];
        console.log(`   Contador: 0x${counter.toString(16)}`);
        
        // Bytes 16-19: Possíveis dados de saúde
        const val1 = bytes[16]; // 0x61-0x63 (97-99) - SpO2
        const val2 = bytes[17]; // 0x50-0x57 (80-87) - Diastólica
        const val3 = bytes[18]; // 0x73-0x79 (115-121) - Sistólica
        const val4 = bytes[19]; // 0x46-0x53 (70-83) - BPM
        
        console.log(`   Val1: ${val1} (0x${val1.toString(16)})`);
        console.log(`   Val2: ${val2} (0x${val2.toString(16)})`);
        console.log(`   Val3: ${val3} (0x${val3.toString(16)})`);
        console.log(`   Val4: ${val4} (0x${val4.toString(16)})`);
        
        // PRIORIDADE 1: Pressão arterial (indica medição completa de PRESSÃO + BPM)
        // Só processar se tiver pressão VÁLIDA - garantindo que é medição completa
        if (val2 >= 40 && val2 <= 100 && val3 >= 90 && val3 <= 180) {
          result.bloodPressure = {
            diastolic: val2,
            systolic: val3
          };
          console.log(`   ✅ Pressão detectada: ${val3}/${val2}`);
          
          // BPM: apenas se tiver pressão válida (medição completa)
          if (val4 >= 40 && val4 <= 120) {
            result.heartRate = val4;
            console.log(`   ✅ BPM detectado: ${val4}`);
          }
          
          // SpO2: apenas se tiver pressão válida (medição completa)
          if (val1 >= 85 && val1 <= 100) {
            result.spo2 = val1;
            console.log(`   ✅ SpO2 detectado: ${val1}%`);
          }
          
          // Retornar imediatamente se tiver pressão E BPM (medição completa)
          if (result.bloodPressure && result.heartRate) {
            console.log(`   ✅ MEDIÇÃO COMPLETA: Pressão ${val3}/${val2}, BPM ${val4}, SpO2 ${val1 || 'N/A'}%`);
            
            // Marcar timestamp de retorno (cooldown)
            this.measurementBuffer.lastMeasurementReturn = Date.now();
            
            return result;
          }
        } else {
          console.log('   ⏸️ Ignorando pacote longo sem pressão válida (não é medição completa)');
          return null;
        }
      }
    }
    
    // Tipo 0x1C: FIM DE MEDIÇÃO
    else if (messageType === 0x1C) {
      console.log('   🏁 FIM DE MEDIÇÃO DETECTADO');
      
      // Se tinha um BPM sendo medido mas não estabilizou, usar o último valor
      if (this.measurementBuffer.lastBPM && this.measurementBuffer.isActive) {
        result.heartRate = this.measurementBuffer.lastBPM;
        console.log(`   ✅ BPM FINAL (último valor): ${this.measurementBuffer.lastBPM}`);
        
        // Marcar timestamp de retorno (cooldown)
        this.measurementBuffer.lastMeasurementReturn = Date.now();
        
        // Limpar buffer
        this.measurementBuffer.lastBPM = null;
        this.measurementBuffer.stableCount = 0;
        this.measurementBuffer.isActive = false;
        
        return result;
      }
      
      console.log('   ℹ️ Fim de medição sem dados de BPM');
      return null;
    }
    
    // Tipo 0x12: Possível início/comando
    else if (messageType === 0x12) {
      console.log('   ℹ️ Comando/Início');
      return null;
    }

    return result;
  }

  /**
   * Verificar se dados são válidos
   */
  static isValid(data: FotolaHealthData): boolean {
    return !!(data.heartRate || data.bloodPressure || data.spo2);
  }
}
