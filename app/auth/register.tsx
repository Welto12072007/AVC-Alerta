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
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as NavigationBar from 'expo-navigation-bar';
import { supabaseAuthService } from '@/services/supabaseAuth';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 8 caracteres');
      return;
    }

    setLoading(true);
    try {
      const response = await supabaseAuthService.register({
        email,
        password,
        fullName,
      });

      setLoading(false);

      if (response.success) {
        Alert.alert('Sucesso', 'Conta criada com sucesso! Você já pode fazer login.', [
          {
            text: 'OK',
            onPress: () => router.replace('/auth/login'),
          },
        ]);
      } else {
        Alert.alert('Erro', response.error || 'Falha no cadastro. Tente novamente.');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Erro', 'Erro inesperado ao criar conta.');
      console.error('Erro no registro:', error);
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
          <Text style={styles.formTitle}>CRIE SUA CONTA!</Text>

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Insira seu nome..."
              placeholderTextColor="#999"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>

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
            <View style={styles.passwordRequirements}>
              <Text style={styles.passwordHintTitle}>A senha deve conter:</Text>
              <Text style={styles.passwordHint}>• No mínimo 8 caracteres</Text>
              <Text style={styles.passwordHint}>• Pelo menos uma letra maiúscula</Text>
              <Text style={styles.passwordHint}>• Pelo menos uma letra minúscula</Text>
              <Text style={styles.passwordHint}>• Pelo menos um número</Text>
              <Text style={styles.passwordHint}>• Pelo menos um caractere especial (!@#$...)</Text>
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity 
            style={[styles.registerButton, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.registerButtonText}>CADASTRO</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Text style={[styles.linkText, styles.linkHighlight]}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  passwordRequirements: {
    marginTop: 8,
    marginLeft: 20,
  },
  passwordHintTitle: {
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
    color: '#2196F3',
    marginBottom: 4,
  },
  passwordHint: {
    fontSize: 11,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    marginBottom: 2,
  },
  registerButton: {
    backgroundColor: '#2196F3',
    borderRadius: 25,
    paddingVertical: 15,
    marginTop: 20,
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
  registerButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#000000',
  },
  linkHighlight: {
    color: '#2196F3',
    fontFamily: 'Poppins_700Bold',
    textDecorationLine: 'underline',
  },
});