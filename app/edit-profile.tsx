import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import {
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';

import {
  auth,
  db,
} from '../services/firebase';

import Toast from 'react-native-toast-message';

export default function EditProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [firstName, setFirstName] =
    useState('');

  const [lastName, setLastName] =
    useState('');

  const [phone, setPhone] =
    useState('');

  const [address, setAddress] =
    useState('');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const user = auth.currentUser;

      if (!user) return;

      const snap = await getDoc(
        doc(db, 'users', user.uid)
      );

      if (snap.exists()) {
        const data = snap.data();

        setFirstName(
          data.firstName || ''
        );

        setLastName(
          data.lastName || ''
        );

        setPhone(
          data.phone || ''
        );

        setAddress(
          data.address || ''
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const user =
        auth.currentUser;

      if (!user) return;

      await updateDoc(
        doc(db, 'users', user.uid),
        {
          firstName:
            firstName.trim(),

          lastName:
            lastName.trim(),

          fullName: `${firstName.trim()} ${lastName.trim()}`,

          phone:
            phone.trim(),

          address:
            address.trim(),
        }
      );

      Toast.show({
        type: 'success',
        text1: '✅ Perfil atualizado',
        text2:
          'As alterações foram guardadas com sucesso.',
        visibilityTime: 1500,
      });

      /*setTimeout(() => {
        router.back();
      }, 1200);*/
      Toast.show({
        type: 'success',
        text1: '✅ Perfil atualizado',
        text2: 'As alterações foram guardadas com sucesso.',
        visibilityTime: 2500,
        });

    } catch (error) {
      console.log(error);

      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2:
          'Não foi possível atualizar o perfil.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#F0C838"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            router.back()
          }
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#111"
          />
        </TouchableOpacity>

        <Text style={styles.title}>
          Editar Perfil
        </Text>

        <View
          style={{ width: 24 }}
        />
      </View>

      {/* NOME */}
      <Text style={styles.label}>
        Nome
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Digite o seu nome"
        value={firstName}
        onChangeText={
          setFirstName
        }
      />

      {/* APELIDO */}
      <Text style={styles.label}>
        Apelido
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Digite o seu apelido"
        value={lastName}
        onChangeText={
          setLastName
        }
      />

      {/* TELEFONE */}
      <Text style={styles.label}>
        Telefone
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Ex: 955000000"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      {/* MORADA */}
      <Text style={styles.label}>
        Morada
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Digite a sua morada"
        value={address}
        onChangeText={
          setAddress
        }
      />

      {/* BOTÃO */}
      <TouchableOpacity
        style={styles.saveBtn}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator
            color="#111"
          />
        ) : (
          <>
           

            <Text
              style={
                styles.saveText
              }
            >
              Guardar Alterações
            </Text>
          </>
        )}
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    padding: 20,
    top: 25,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
  },

  label: {
    marginBottom: 6,
    marginLeft: 4,
    fontWeight: '600',
    color: '#444',
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ECECEC',
  },

  saveBtn: {
    backgroundColor: '#F0C838',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 15,
    elevation: 3,
  },

  saveText: {
    marginLeft: 8,
    fontWeight: '700',
    color: '#111',
    fontSize: 16,
  },
});