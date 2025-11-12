import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { usePoppinsFonts } from '@/hooks/useFonts';
import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  useFrameworkReady();
  const fontsLoaded = usePoppinsFonts();

  useEffect(() => {
    // Configurações globais para Android
    if (Platform.OS === 'android') {
      // Oculta a barra de navegação globalmente
      NavigationBar.setVisibilityAsync("hidden");
    }
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/welcome" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/register" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar hidden />
    </SafeAreaProvider>
  );
}
