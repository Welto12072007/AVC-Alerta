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
        } catch (error) {
          console.warn('Erro ao configurar NavigationBar:', error);
        }
      };

      configureSystemUI();
    }
  }, []);
}