import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

export function useSystemUI() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      const configureSystemUI = async () => {
        try {
          // Oculta a barra de navegação completamente
          await NavigationBar.setVisibilityAsync('hidden');
          
          // Define comportamento para modo imersivo sticky
          await NavigationBar.setBehaviorAsync('inset-swipe');
          
          // Define cor transparente
          await NavigationBar.setBackgroundColorAsync('transparent');
          
          // Define posição de overlay
          await NavigationBar.setPositionAsync('absolute');
        } catch (error) {
          console.warn('Erro ao configurar NavigationBar:', error);
        }
      };

      configureSystemUI();
    }
  }, []);
}