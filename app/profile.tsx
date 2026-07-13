import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import { auth, db } from '../services/firebase';

export default function ProfileScreen() {
  const [loading, setLoading] =
    useState(true);

  const [userData, setUserData] =
    useState<any>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        router.replace('/(auth)/login');
        return;
      }

      const snap = await getDoc(
        doc(db, 'users', user.uid)
      );

      if (snap.exists()) {
        setUserData(snap.data());
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sair',
      'Deseja terminar a sessão?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await signOut(auth);
            router.replace(
              '/(auth)/login'
            );
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color="#F0C838"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() =>
              router.push('/home')
            }
            style={styles.backBtn}>
            <Ionicons
              name="arrow-back"
              size={24}
              color="#111"
            />
          </TouchableOpacity>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userData?.firstName?.[0] ||
                'U'}
            </Text>
          </View>

          <Text style={styles.name}>Ola,
            {userData?.firstName}
          !</Text>

          <Text style={styles.email}>
            {userData?.email}
          </Text>
        </View>

        {/* MENU */}

        <TouchableOpacity
          style={styles.item}
          onPress={() =>
            router.push({
              pathname: '/edit-profile',
              params: {
                firstName: userData?.firstName ?? '',
                fullName: userData?.fullName ?? '',
                email: userData?.email ?? '',
              },
            })
          }
        >
          <Ionicons
            name="person-outline"
            size={22}
            color="#c78200"
          />

          <Text style={styles.itemText}>
            Editar Perfil
          </Text>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#999"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
        >
          <Ionicons
            name="cube-outline"
            size={22}
            color="#c78200"
          />

          <Text style={styles.itemText}>
            Meus Pedidos
          </Text>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#999"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
        >
          <Ionicons
            name="heart-outline"
            size={22}
            color="#c78200"
          />

          <Text style={styles.itemText}>
            Favoritos
          </Text>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#999"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
        >
          <Ionicons
            name="location-outline"
            size={22}
            color="#c78200"
          />

          <Text style={styles.itemText}>
            Endereços
          </Text>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#999"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
        >
          <Ionicons
            name="settings-outline"
            size={22}
            color="#c78200"
          />

          <Text style={styles.itemText}>
            Configurações
          </Text>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#999"
          />
        </TouchableOpacity>

        {/* LOGOUT */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
        >
          <Ionicons
            name="log-out-outline"
            size={22}
            color="#fff"
          />

          <Text style={styles.logoutText}>
            Terminar Sessão
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },

  container: {
    flex: 1,
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
  },
  backBtn: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 6,
    flexDirection: 'row',
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F0C838',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
  },

  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 12,
  },

  email: {
    color: '#777',
    marginTop: 4,
  },

  item: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,

    flexDirection: 'row',
    alignItems: 'center',
  },

  itemText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    fontWeight: '600',
  },

  logoutBtn: {
    backgroundColor: '#e53935',
    padding: 18,
    borderRadius: 14,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    marginTop: 20,
  },

  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});