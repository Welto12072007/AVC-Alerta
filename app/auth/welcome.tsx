import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as NavigationBar from 'expo-navigation-bar';
import { useSystemUI } from '@/hooks/useSystemUI';

export default function WelcomeScreen() {
  useSystemUI(); // Aplica configurações de sistema

  // Desativa o botão voltar do Android
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true; // Impede a navegação para trás
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => {
        subscription.remove();
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
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
            <Text style={styles.loginButtonText}>ENTRAR</Text>
          </TouchableOpacity>
          
          <Text style={styles.loginSubtext}>entre na sua conta.</Text>

          <TouchableOpacity 
            style={styles.registerButton}
            onPress={() => router.push('/auth/register')}
          >
            <Text style={styles.registerButtonText}>CADASTRO</Text>
          </TouchableOpacity>
          
          <Text style={styles.registerSubtext}>cadastre sua conta agora mesmo</Text>
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
    marginTop: 40,
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
    fontFamily: 'Poppins_700Bold',
    color: '#000000',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0,
    paddingBottom: 20,
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
    fontFamily: 'Poppins_600SemiBold',
    color: '#000000',
    textAlign: 'center',
  },
  loginSubtext: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
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
    fontFamily: 'Poppins_600SemiBold',
    color: '#000000',
    textAlign: 'center',
  },
  registerSubtext: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#000000',
    marginBottom: 30,
    textAlign: 'center',
  },
  bottomDecoration: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
});