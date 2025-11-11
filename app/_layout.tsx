import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from 'react-native';

export default function RootLayout() {
  useFrameworkReady();

  useEffect(() => {
    // Configurações globais para Android
    if (Platform.OS === 'android') {
      // Oculta a barra de navegação globalmente
      NavigationBar.setVisibilityAsync("hidden");
      // Define comportamento para modo imersivo
      NavigationBar.setBehaviorAsync("overlay-swipe");
    }
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/welcome" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/register" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
