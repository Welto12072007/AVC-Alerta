import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as NavigationBar from 'expo-navigation-bar';
import { useSystemUI } from '@/hooks/useSystemUI';

export default function WelcomeScreen() {
  useSystemUI(); // Aplica configurações de sistema

  // Desativa o botão voltar do Android e oculta barra de navegação
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true; // Impede a navegação para trás
      };

      // Força ocultar a barra de navegação
      NavigationBar.setVisibilityAsync("hidden");

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => {
        subscription.remove();
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2196F3" />
      
      <LinearGradient
        colors={['#2196F3', '#21CBF3']}
        style={styles.gradient}
      >
        {/* Logo e Título */}
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <Image 
              source={require('@/assets/images/logo-removebg-preview.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>
              AVC <Text style={styles.logoAlert}>Alerta</Text>
            </Text>
          </View>
        </View>

        {/* Título de Boas-vindas */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>BEM - VINDO!</Text>
        </View>

        {/* Botões de Ação */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.loginButtonText}>LOGIN</Text>
          </TouchableOpacity>
          
          <Text style={styles.loginSubtext}>faça login na sua conta.</Text>

          <TouchableOpacity 
            style={styles.registerButton}
            onPress={() => router.push('/auth/register')}
          >
            <Text style={styles.registerButtonText}>CADASTRO</Text>
          </TouchableOpacity>
          
          <Text style={styles.registerSubtext}>cadastre sua conta agora mesmo</Text>

          {/* Google Sign In */}
          <TouchableOpacity style={styles.googleButton}>
            <Text style={styles.googleButtonText}>G</Text>
            <Text style={styles.googleText}>Sign in with Google</Text>
          </TouchableOpacity>
        </View>

        {/* Decoração inferior */}
        <View style={styles.bottomDecoration} />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
  },
  logoContainer: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  logoWrapper: {
    alignItems: 'center',
  },
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: 5,
    borderRadius: 20,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'normal',
    color: '#000000',
  },
  logoAlert: {
    color: '#F44336',
    fontWeight: '900',
  },
  welcomeContainer: {
    flex: 0.2,
    justifyContent: 'center',
  },
  welcomeTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#000000',
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 0.5,
    width: '100%',
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 80,
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
  },
  loginSubtext: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 30,
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 60,
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
  },
  registerSubtext: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 30,
    textAlign: 'center',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  googleButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4285F4',
    marginRight: 10,
  },
  googleText: {
    fontSize: 16,
    color: '#000000',
  },
  bottomDecoration: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 80,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
});