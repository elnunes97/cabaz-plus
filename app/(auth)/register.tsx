import { router } from 'expo-router';
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

import {
  doc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

import { useState } from 'react';

import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  auth,
  db,
} from '../../services/firebase';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const [firstName, setFirstName] =
    useState('');

  const [lastName, setLastName] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState('');

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  // ERROS
  const [nameError, setNameError] =
    useState('');

  const [
    lastNameError,
    setLastNameError,
  ] = useState('');

  const [emailError, setEmailError] =
    useState('');

  const [
    passwordError,
    setPasswordError,
  ] = useState('');

  const [
    confirmPasswordError,
    setConfirmPasswordError,
  ] = useState('');

  const [
    generalError,
    setGeneralError,
  ] = useState('');

  const validateEmail = (
    email: string
  ) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const getFirebaseError = (
    code: string
  ) => {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Este email já está registado.';

      case 'auth/invalid-email':
        return 'Email inválido.';

      case 'auth/weak-password':
        return 'Senha muito fraca.';

      case 'auth/network-request-failed':
        return 'Sem conexão com internet.';

      default:
        return 'Erro ao criar conta.';
    }
  };

  const handleRegister = async () => {
    // limpar erros
    setNameError('');
    setLastNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setGeneralError('');

    let valid = true;

    const cleanEmail =
      email.trim().toLowerCase();

    // NOME
    if (!firstName.trim()) {
      setNameError(
        'Nome é obrigatório'
      );
      valid = false;
    }

    // APELIDO
    if (!lastName.trim()) {
      setLastNameError(
        'Apelido é obrigatório'
      );
      valid = false;
    }

    // EMAIL
    if (!cleanEmail) {
      setEmailError(
        'Email é obrigatório'
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

    // SENHA
    if (!password) {
      setPasswordError(
        'Senha obrigatória'
      );
      valid = false;
    } else if (password.length < 6) {
      setPasswordError(
        'Mínimo 6 caracteres'
      );
      valid = false;
    }

    // CONFIRMAR SENHA
    if (!confirmPassword) {
      setConfirmPasswordError(
        'Confirme sua senha'
      );
      valid = false;
    } else if (
      password !== confirmPassword
    ) {
      setConfirmPasswordError(
        'As senhas não coincidem'
      );
      valid = false;
    }

    if (!valid) return;

    try {
      setLoading(true);

      // cria conta
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          cleanEmail,
          password
        );

      const uid =
        userCredential.user.uid;

      const fullName = `${firstName.trim()} ${lastName.trim()}`;

      // atualiza displayName no auth (opcional)
      try {
        await updateProfile(userCredential.user, {
          displayName: fullName,
        });
      } catch (e) {
        // não falhar o fluxo se updateProfile falhar
        console.warn('updateProfile failed', e);
      }

      // salvar no firestore
      await setDoc(
        doc(db, 'users', uid),
        {
          uid,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          fullName,
          email: cleanEmail,
          createdAt: serverTimestamp(),
        }
      );

      router.replace(
        '/(auth)/login'
      );
    } catch (error: any) {
      setGeneralError(
        getFirebaseError(
          error.code
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top', 'bottom']}>
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={
          styles.container
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <Image
          source={require('../img/cabaz.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>
          Criar Conta
        </Text>

        <Text style={styles.subtitle}>
          Preencha os dados abaixo
        </Text>

        {/* NOME */}
        <Text style={styles.label}>
          Nome
        </Text>

        <TextInput
          placeholder="Seu nome"
          style={[
            styles.input,
            !!nameError &&
              styles.inputError,
          ]}
          value={firstName}
          onChangeText={(text) => {
            setFirstName(text);
            setNameError('');
          }}
        />

        {!!nameError && (
          <Text style={styles.error}>
            {nameError}
          </Text>
        )}

        {/* APELIDO */}
        <Text style={styles.label}>
          Apelido
        </Text>

        <TextInput
          placeholder="Seu apelido"
          style={[
            styles.input,
            !!lastNameError &&
              styles.inputError,
          ]}
          value={lastName}
          onChangeText={(text) => {
            setLastName(text);
            setLastNameError('');
          }}
        />

        {!!lastNameError && (
          <Text style={styles.error}>
            {lastNameError}
          </Text>
        )}

        {/* EMAIL */}
        <Text style={styles.label}>
          Email
        </Text>

        <TextInput
          placeholder="email@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          style={[
            styles.input,
            !!emailError &&
              styles.inputError,
          ]}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailError('');
          }}
        />

        {!!emailError && (
          <Text style={styles.error}>
            {emailError}
          </Text>
        )}

        {/* SENHA */}
        <Text style={styles.label}>
          Senha
        </Text>

        <View
          style={[
            styles.passwordContainer,
            !!passwordError &&
              styles.inputError,
          ]}
        >
          <TextInput
            placeholder="Definir senha"
            secureTextEntry={
              !showPassword
            }
            style={
              styles.passwordInput
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
            <Text style={styles.show}>
              {showPassword
                ? 'Ocultar'
                : 'Mostrar'}
            </Text>
          </TouchableOpacity>
        </View>

        {!!passwordError && (
          <Text style={styles.error}>
            {passwordError}
          </Text>
        )}

        {/* CONFIRMAR SENHA */}
        <Text style={styles.label}>
          Confirmar senha
        </Text>

        <View
          style={[
            styles.passwordContainer,
            !!confirmPasswordError &&
              styles.inputError,
          ]}
        >
          <TextInput
            placeholder="Repita sua senha"
            secureTextEntry={
              !showConfirmPassword
            }
            style={
              styles.passwordInput
            }
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(
                text
              );
              setConfirmPasswordError(
                ''
              );
            }}
          />

          <TouchableOpacity
            onPress={() =>
              setShowConfirmPassword(
                !showConfirmPassword
              )
            }
          >
            <Text style={styles.show}>
              {showConfirmPassword
                ? 'Ocultar'
                : 'Mostrar'}
            </Text>
          </TouchableOpacity>
        </View>

        {!!confirmPasswordError && (
          <Text style={styles.error}>
            {confirmPasswordError}
          </Text>
        )}

        {!!generalError && (
          <Text
            style={styles.generalError}
          >
            {generalError}
          </Text>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            loading &&
              styles.buttonDisabled,
          ]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              style={styles.buttonText}
            >
              Criar Conta
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            router.back()
          }
        >
          <Text
            style={styles.loginText}
          >
            <Text
              style={{ color: '#444' }}
            >
              Já tenho conta?{' '}
            </Text>
            Login
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 25,
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
  },

  subtitle: {
    textAlign: 'center',
    color: '#777',
    marginBottom: 25,
    marginTop: 5,
  },

  label: {
    fontWeight: '600',
    marginBottom: 8,
    color: '#444',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 14,
    padding: 16,
    backgroundColor: '#fafafa',
  },

  passwordContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 14,
    backgroundColor: '#fafafa',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 16,
  },

  inputError: {
    borderColor: '#e53935',
  },

  error: {
    color: '#e53935',
    marginTop: 5,
    marginBottom: 12,
    marginLeft: 4,
    fontSize: 13,
  },

  generalError: {
    color: '#e53935',
    textAlign: 'center',
    marginBottom: 15,
  },

  show: {
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

  loginText: {
    textAlign: 'center',
    marginTop: 22,
    color: '#c78200',
    fontWeight: 'bold',
  },
});