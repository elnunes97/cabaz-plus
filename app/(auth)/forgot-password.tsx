import { router } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { auth } from '../../services/firebase';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    email: '',
  });

  const validateFields = () => {
    let valid = true;

    const newErrors = {
      email: '',
    };

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email =
        'O email é obrigatório';
      valid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email =
        'Digite um email válido';
      valid = false;
    }

    setErrors(newErrors);

    return valid;
  };

  const handleResetPassword = async () => {
    if (!validateFields()) return;

    try {
      setLoading(true);

      await sendPasswordResetEmail(auth, email);

      Alert.alert(
        'Email enviado',
        'Verifique a sua caixa de entrada para redefinir a senha.'
      );

      router.back();
    } catch (error: any) {
      let errorMessage =
        'Erro ao enviar email de recuperação';

      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage =
            'Nenhuma conta encontrada com este email';
          break;

        case 'auth/invalid-email':
          errorMessage =
            'Email inválido';
          break;

        case 'auth/too-many-requests':
          errorMessage =
            'Muitas tentativas. Tente novamente mais tarde';
          break;
      }

      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../img/cabaz.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>
        Recuperar Senha
      </Text>

      <Text style={styles.subtitle}>
        Digite o email associado à sua conta.
        Enviaremos um link para redefinir a senha.
      </Text>

      <TextInput
        placeholder="Seu email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setErrors((prev) => ({
            ...prev,
            email: '',
          }));
        }}
        style={[
          styles.input,
          errors.email && styles.inputError,
        ]}
      />

      {errors.email ? (
        <Text style={styles.errorText}>
          {errors.email}
        </Text>
      ) : null}

      <TouchableOpacity
        style={[
          styles.button,
          loading && styles.buttonDisabled,
        ]}
        onPress={handleResetPassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            Recuperar
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>
          Voltar ao Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
    backgroundColor: '#fff',
  },

  logo: {
    width: 180,
    height: 100,
    alignSelf: 'center',
    marginBottom: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#111',
  },

  subtitle: {
    textAlign: 'center',
    color: '#777',
    marginBottom: 30,
    lineHeight: 22,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 14,
    padding: 16,
    backgroundColor: '#fafafa',
  },

  inputError: {
    borderColor: '#ff4d4f',
  },

  errorText: {
    color: '#ff4d4f',
    fontSize: 13,
    marginTop: 6,
    marginBottom: 12,
    marginLeft: 5,
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

  backText: {
    textAlign: 'center',
    marginTop: 25,
    color: '#c78200',
    fontWeight: 'bold',
  },
});