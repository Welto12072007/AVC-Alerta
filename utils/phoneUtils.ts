import { Platform, Linking, Alert } from 'react-native';

/**
 * Utilitário para fazer chamadas telefônicas de forma padronizada
 */
export const makePhoneCall = async (phoneNumber: string, contactName?: string): Promise<void> => {
  // Remove caracteres não numéricos, mas mantém o + se existir no início
  const cleanNumber = phoneNumber.replace(/[^\d+]/g, '');
  
  // No web, mostra alerta
  if (Platform.OS === 'web') {
    const message = contactName 
      ? `Contato: ${contactName}\nNúmero: ${cleanNumber}\n\nFuncionalidade disponível apenas em dispositivos móveis.`
      : `Número: ${cleanNumber}\n\nFuncionalidade disponível apenas em dispositivos móveis.`;
    
    Alert.alert('📱 Ligar', message);
    return;
  }
  
  // Tenta abrir diretamente (mais compatível com Expo Go)
  const url = `tel:${cleanNumber}`;
  
  try {
    await Linking.openURL(url);
  } catch (error) {
    console.error('Erro ao fazer ligação:', error);
    // Se falhar, mostra mensagem com o número
    const errorMessage = contactName
      ? `Não foi possível abrir o discador automaticamente.\n\nContato: ${contactName}\nNúmero: ${cleanNumber}\n\nPor favor, disque manualmente.`
      : `Não foi possível abrir o discador automaticamente.\n\nNúmero: ${cleanNumber}\n\nPor favor, disque manualmente.`;
    
    Alert.alert('Erro ao Ligar', errorMessage, [{ text: 'OK' }]);
  }
};
