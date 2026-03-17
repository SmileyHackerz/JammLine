import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";

// 1. IMPORT DEPUIS NOTRE DOSSIER PARTAGÉ (LE CERVEAU)
import { AuthProvider, AppProvider } from "@monprojet/shared";

// 2. IMPORT DU STOCKAGE SÉCURISÉ DU TÉLÉPHONE
import * as SecureStore from "expo-secure-store";

// 3. CRÉATION DE L'ADAPTATEUR DE STOCKAGE POUR LE MOBILE
// (On traduit les fonctions d'Expo pour que le AuthContext les comprenne)
const mobileStorage = {
  getItem: (key) => SecureStore.getItemAsync(key),
  setItem: (key, value) => SecureStore.setItemAsync(key, value),
  removeItem: (key) => SecureStore.deleteItemAsync(key),
};

export default function App() {
  return (
    <SafeAreaProvider>
      {/* 4. ON INJECTE LE STOCKAGE MOBILE ICI */}
      <AuthProvider storage={mobileStorage}>
        <AppProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <AppNavigator />
          </NavigationContainer>
        </AppProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
