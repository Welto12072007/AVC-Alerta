import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  BackHandler,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as NavigationBar from 'expo-navigation-bar';
import { supabaseAuthService } from '../../services/supabaseAuth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Desativa o botão voltar do Android e oculta barra de navegação
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true; // Impede a navegação para trás
      };

      // Oculta a barra de navegação
      NavigationBar.setVisibilityAsync("hidden");

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => {
        subscription.remove();
        // Restaura a barra de navegação quando sair da tela
        NavigationBar.setVisibilityAsync("visible");
      };
    }, [])
  );

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const result = await supabaseAuthService.login(email, password);
      
      if (result.success) {
        Alert.alert('Sucesso', 'Login realizado com sucesso!');
        router.replace('/(tabs)');
      } else {
        Alert.alert('Erro', result.error || 'Email ou senha incorretos');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Erro', 'Falha no login. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <LinearGradient
        colors={['#2196F3', '#21CBF3']}
        style={styles.gradient}
      >
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          extraScrollHeight={20}
          keyboardShouldPersistTaps="handled"
        >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>VAMOS LÁ!</Text>
        </View>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('@/assets/images/logo-removebg-preview.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.logoText}>
            AVC <Text style={styles.logoAlert}>Alerta</Text>
          </Text>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>LOGAR NA CONTA</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Insira seu email..."
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Insira sua senha..."
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? "eye-off" : "eye"} 
                  size={24} 
                  color="#2196F3" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Remember Me Checkbox */}
          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
              {rememberMe && (
                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
              )}
            </View>
            <Text style={styles.checkboxText}>Lembrar senha</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity 
            style={[styles.loginButton, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>ENTRAR</Text>
            )}
          </TouchableOpacity>

          {/* Links */}
          <View style={styles.linksContainer}>
            <TouchableOpacity onPress={() => router.push('/auth/register' as any)}>
              <Text style={styles.linkText}>primeiro acesso</Text>
            </TouchableOpacity>
          </View>
        </View>
        </KeyboardAwareScrollView>
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
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#000000',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 5,
    borderRadius: 15,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'normal',
    color: '#000000',
  },
  logoAlert: {
    color: '#F44336',
    fontWeight: '900',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 40,
    paddingTop: 30,
    justifyContent: 'center',
    paddingBottom: 60,
  },
  formTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#2196F3',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: '#2196F3',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    backgroundColor: '#FFFFFF',
    color: '#333333',
  },
  passwordContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#2196F3',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingRight: 55,
    paddingVertical: 15,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    backgroundColor: '#FFFFFF',
    color: '#333333',
  },
  eyeIcon: {
    position: 'absolute',
    right: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginLeft: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#2196F3',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2196F3',
  },
  checkboxText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#000000',
  },
  loginButton: {
    backgroundColor: '#2196F3',
    borderRadius: 25,
    paddingVertical: 15,
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  linksContainer: {
    alignItems: 'center',
    gap: 15,
  },
  linkText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#000000',
    textDecorationLine: 'underline',
  },
});