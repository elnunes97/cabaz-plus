import { router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
} from 'react-native';

import { auth } from '../services/firebase';

export default function Splash() {
  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (user) => {
          setTimeout(() => {
            if (user) {
              router.replace(
                '/(drawer)/home'
              );
            } else {
              router.replace(
                '/(auth)/login'
              );
            }
          }, 2000);
        }
      );

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('./img/cabaz.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <ActivityIndicator
        size="large"
        color="#c78200"
        
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: 220,
    height: 220,
    marginBottom: 20,
  },
});