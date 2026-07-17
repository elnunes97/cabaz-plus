// services/firebase.ts

import { getApp, getApps, initializeApp } from 'firebase/app';
import { Platform } from 'react-native';

import {
  Auth,
  browserLocalPersistence,
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
} from 'firebase/firestore';

const firebaseConfig = {
  //apiKey: "AIzaSy...", 
  apiKey:"AIzaSyB1Y-5hyN9nYs9D0gswGSTLcyDxhe4CkUI",
  authDomain: "cabaz-ea4d9.firebaseapp.com",
  projectId: "cabaz-ea4d9",
  storageBucket: "cabaz-ea4d9.firebasestorage.app",
  messagingSenderId: "319005114614",
  appId: "1:319005114614:web:b0155dc8d54a7a79f52cd7",
};

const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

let auth: Auth;

if (Platform.OS === "web") {
  auth = getAuth(app);
  auth.setPersistence(browserLocalPersistence);
} else {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    auth = getAuth(app);
  }
}

const db =
  Platform.OS === "web"
    ? initializeFirestore(app, {
        localCache: persistentLocalCache(),
      })
    : getFirestore(app);

export { app, auth, db };
