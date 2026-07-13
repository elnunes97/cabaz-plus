import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth } from '../../services/firebase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] =
    useState('');

  const [passwordError, setPasswordError] =
    useState('');

  const [generalError, setGeneralError] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const getFirebaseError = (
    code: string
  ) => {
    switch (code) {
      case 'auth/user-not-found':
        return 'Conta não encontrada.';

      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Email ou senha incorretos.';

      case 'auth/too-many-requests':
        return 'Muitas tentativas. Tente novamente mais tarde.';

      case 'auth/network-request-failed':
        return 'Sem conexão com internet.';

      default:
        return 'Erro ao fazer login.';
    }
  };

  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    let valid = true;

    const cleanEmail =
      email.trim().toLowerCase();

    // EMAIL
    if (!cleanEmail) {
      setEmailError(
        'O email é obrigatório'
      );
      valid = false;
    } else if (
      !validateEmail(cleanEmail)
    ) {
      setEmailError(
        'Digite um email válido'
      );
      valid = false;
    }

    // PASSWORD
    if (!password) {
      setPasswordError(
        'A senha é obrigatória'
      );
      valid = false;
    } else if (password.length < 6) {
      setPasswordError(
        'Mínimo 6 caracteres'
      );
      valid = false;
    }

    if (!valid) return;

    try {
      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );

      router.replace('/(drawer)/home');
    } catch (error: any) {
      setGeneralError(
        getFirebaseError(error.code)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <View style={styles.container}>
        <Image
          source={require('../img/cabaz.png')}
          style={styles.logo}
          resizeMode="contain"
         />

        <Text style={styles.title}>
          Bem-vindo 👋
        </Text>

        <Text style={styles.subtitle}>
          Faça login na sua conta
        </Text>

        {/* EMAIL */}
        <Text style={styles.label}>
          Email
        </Text>

        <TextInput
          placeholder="exemplo@email.com"
          placeholderTextColor="#999"
          style={[
            styles.input,
            emailError &&
              styles.inputError,
          ]}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailError('');
          }}
        />

        {emailError ? (
          <Text style={styles.errorText}>
            {emailError}
          </Text>
        ) : null}

        {/* PASSWORD */}
        <Text style={styles.label}>
          Senha
        </Text>

        <View
          style={[
            styles.passwordContainer,
            passwordError &&
              styles.inputError,
          ]}
        >
          <TextInput
            placeholder="Digite sua senha"
            placeholderTextColor="#999"
            style={styles.passwordInput}
            secureTextEntry={
              !showPassword
            }
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError('');
            }}
          />

          <TouchableOpacity
            onPress={() =>
              setShowPassword(
                !showPassword
              )
            }
          >
            <Text style={styles.showText}>
              {showPassword
                ? 'Ocultar'
                : 'Mostrar'}
            </Text>
          </TouchableOpacity>
        </View>

        {passwordError ? (
          <Text style={styles.errorText}>
            {passwordError}
          </Text>
        ) : null}

        {/* ERRO GERAL */}
        {generalError ? (
          <Text
            style={styles.generalError}
          >
            {generalError}
          </Text>
        ) : null}

        <TouchableOpacity
          style={[
            styles.button,
            loading &&
              styles.buttonDisabled,
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(auth)/forgot-password')}
        >
          
          <Text
            style={styles.forgotPassword}
          >
            Esqueceu a senha?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            router.push(
              '/(auth)/register'
            )
          }
        >
          <Text
            style={styles.registerText}
          >
            <Text
              style={{ color: '#444' }}
            >
              Ainda não tem conta?{' '}
            </Text>
            Criar conta
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    backgroundColor: '#fff',
  },

  logo: {
    width: 220,
    height: 120,
    alignSelf: 'center',
    marginBottom: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#222',
  },

  subtitle: {
    textAlign: 'center',
    color: '#777',
    marginTop: 5,
    marginBottom: 30,
    fontSize: 15,
  },

  label: {
    marginBottom: 8,
    color: '#444',
    fontWeight: '600',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 14,
    padding: 16,
    backgroundColor: '#fafafa',
    fontSize: 15,
  },

  passwordContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 14,
    paddingHorizontal: 16,
    backgroundColor: '#fafafa',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 15,
  },

  inputError: {
    borderColor: '#e53935',
  },

  errorText: {
    color: '#e53935',
    fontSize: 13,
    marginTop: 6,
    marginBottom: 12,
    marginLeft: 4,
  },

  generalError: {
    color: '#e53935',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '500',
  },

  showText: {
    color: '#c78200',
    fontWeight: '600',
  },

  button: {
    backgroundColor: '#c78200',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  forgotPassword: {
    textAlign: 'center',
    color: '#666',
    marginTop: 18,
  },

  registerText: {
    textAlign: 'center',
    marginTop: 25,
    color: '#c78200',
    fontWeight: 'bold',
    fontSize: 15,
  },
});