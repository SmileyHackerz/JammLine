import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { createStackNavigator } from '@react-navigation/stack';
import { registerRootComponent } from 'expo';
import { JammLineProvider, useJammLine } from './src/context/JammLineContext';

// Import all pages
import LoginPage from './src/pages/LoginPage';
import RegisterPage from './src/pages/RegisterPage';
import PatientDashboard from './src/pages/PatientDashboard';
import MedecinDashboard from './src/pages/MedecinDashboard';
import AdminDashboard from './src/pages/AdminDashboard';
import NouveauTicket from './src/pages/NouveauTicket';
import ParametresPage from './src/pages/ParametresPage';

// Import modals
import AddUserModal from './src/components/modals/AddUserModal';
import TicketDetailModal from './src/components/modals/TicketDetailModal';

const Stack = createStackNavigator();

function AppNavigator() {
  const { currentPage, userType } = useJammLine();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {currentPage === 'login' && <Stack.Screen name="login" component={LoginPage} />}
      {currentPage === 'register' && <Stack.Screen name="register" component={RegisterPage} />}
      
      {/* Dashboards spécifiques par rôle */}
      {currentPage === 'dashboard' && userType === 'patient' && (
        <>
          <Stack.Screen name="patientDashboard" component={PatientDashboard} />
          <Stack.Screen name="nouveauTicket" component={NouveauTicket} />
          <Stack.Screen name="parametres" component={ParametresPage} />
        </>
      )}
      
      {currentPage === 'dashboard' && userType === 'medecin' && (
        <>
          <Stack.Screen name="medecinDashboard" component={MedecinDashboard} />
          <Stack.Screen name="parametres" component={ParametresPage} />
        </>
      )}
      
      {currentPage === 'dashboard' && userType === 'admin' && (
        <>
          <Stack.Screen name="adminDashboard" component={AdminDashboard} />
          <Stack.Screen name="nouveauTicket" component={NouveauTicket} />
          <Stack.Screen name="parametres" component={ParametresPage} />
        </>
      )}
    </Stack.Navigator>
  );
}

function App() {
  return (
    <JammLineProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <AppNavigator />
        
        {/* Global Modals */}
        <AddUserModal />
        <TicketDetailModal />
      </NavigationContainer>
    </JammLineProvider>
  );
}

// Enregistrement correct pour Expo
registerRootComponent(App);

export default App;
