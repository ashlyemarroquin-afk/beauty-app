import './polyfills';
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

// Import the converted App from src
import App from './src/App';

export default function AppWrapper() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <App />
      <Toast />
    </SafeAreaProvider>
  );
}
