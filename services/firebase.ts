// services/firebase.ts

import { Platform } from 'react-native';

import { initializeApp } from 'firebase/app';

import {
  getApps,
} from 'firebase/app';

import {
  Auth,
  browserLocalPersistence,
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:
    'AIzaSyBH6pYjQhCE-tJ26mL7y0sSg8UhDqBajX8',

  authDomain:
    'cabaz-ea4d9.firebaseapp.com',

  projectId:
    'cabaz-ea4d9',

  storageBucket:
    'cabaz-ea4d9.firebasestorage.app',

  messagingSenderId:
    '319005114614',

  appId:
    '1:319005114614:web:b0155dc8d54a7a79f52cd7',
};

const app = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);

// TYPE EXPLÍCITO
let auth: Auth;

if (Platform.OS === 'web') {
  auth = getAuth(app);

  auth.setPersistence(
    browserLocalPersistence
  );
} else {
  auth = initializeAuth(app, {
    persistence:
      getReactNativePersistence(
        AsyncStorage
      ),
  });
}

export { auth };

export const db =
  getFirestore(app);