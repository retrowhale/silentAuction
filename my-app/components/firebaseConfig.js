import { initializeApp, getApps, getApp } from 'firebase/app';
import {initializeAuth,getAuth,getReactNativePersistence,} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
 apiKey: "AIzaSyA_d-QZJ_8xnyDkmf2kWwPwUm7nTsSWiYY",
  authDomain: "julyclass24.firebaseapp.com",
  projectId: "julyclass24",
  storageBucket: "julyclass24.appspot.com",  
  messagingSenderId: "852509753434",
  appId: "1:852509753434:web:08ef63ad9a78d188d19863",
  measurementId: "G-1Z4H54WKY8"
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let auth;

try {
  auth = getAuth(app);
} catch {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export { auth };
