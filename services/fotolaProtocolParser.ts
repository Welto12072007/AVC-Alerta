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
  /**
   * Parsear dados brutos do Fotola S20
   */
  static parse(bytes: number[]): FotolaHealthData | null {
    if (!bytes || bytes.length < 9) {
      console.log('⚠️ Dados muito curtos');
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

    console.log(`\n🔍 Analisando mensagem tipo 0x${messageType.toString(16)}:`);

    // Tipo 0x15: Dados de saúde contínuos
    if (messageType === 0x15 && bytes.length >= 20) {
      // Análise dos bytes finais (variam conforme medição)
      // Padrão observado: cd 00 11 15 01 0e 00 0c 32 21 00 01 00 00 [XX XX] [AA] [BB] [CC] [DD]
      
      // Bytes 14-15: Contador (muda a cada 5 segundos)
      const counter = (bytes[14] << 8) | bytes[15];
      console.log(`   Contador: 0x${counter.toString(16)}`);
      
      // Bytes 16-19: Possíveis dados de saúde
      const val1 = bytes[16]; // 0x61-0x63 (97-99)
      const val2 = bytes[17]; // 0x50-0x57 (80-87)
      const val3 = bytes[18]; // 0x73-0x79 (115-121)
      const val4 = bytes[19]; // 0x46-0x53 (70-83)
      
      console.log(`   Val1: ${val1} (0x${val1.toString(16)})`);
      console.log(`   Val2: ${val2} (0x${val2.toString(16)})`);
      console.log(`   Val3: ${val3} (0x${val3.toString(16)})`);
      console.log(`   Val4: ${val4} (0x${val4.toString(16)})`);
      
      // Hipótese: val2 e val3 parecem pressão arterial
      if (val2 >= 60 && val2 <= 100 && val3 >= 100 && val3 <= 140) {
        result.bloodPressure = {
          diastolic: val2,
          systolic: val3
        };
        console.log(`   ✅ Pressão: ${val3}/${val2}`);
      }
      
      // Hipótese: val1 ou val4 pode ser frequência cardíaca
      if (val4 >= 40 && val4 <= 120) {
        result.heartRate = val4;
        console.log(`   ✅ BPM: ${val4}`);
      }
      
      // Hipótese: val1 pode ser SpO2
      if (val1 >= 90 && val1 <= 100) {
        result.spo2 = val1;
        console.log(`   ✅ SpO2: ${val1}%`);
      }
    }
    
    // Tipo 0x1C: Possível fim de medição
    else if (messageType === 0x1C) {
      console.log('   ℹ️ Fim de medição');
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
