import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { createStackNavigator } from '@react-navigation/stack';
import { registerRootComponent } from 'expo';

// Import contexts
import { AuthProvider } from './src/context/AuthContext';
import { TicketProvider } from './src/context/TicketContext';
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

  // Determine which screen to show based on currentPage
  const getInitialRouteName = () => {
    switch (currentPage) {
      case 'login':
        return 'login';
      case 'register':
        return 'register';
      case 'patientDashboard':
        return 'patientDashboard';
      case 'medecinDashboard':
        return 'medecinDashboard';
      case 'adminDashboard':
        return 'adminDashboard';
      case 'nouveauTicket':
        return 'nouveauTicket';
      case 'parametres':
        return 'parametres';
      default:
        return 'login';
    }
  };

  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }}
      initialRouteName={getInitialRouteName()}
    >
      {/* Login/Register */}
      <Stack.Screen name="login" component={LoginPage} />
      <Stack.Screen name="register" component={RegisterPage} />
      
      {/* Dashboards */}
      <Stack.Screen name="patientDashboard" component={PatientDashboard} />
      <Stack.Screen name="medecinDashboard" component={MedecinDashboard} />
      <Stack.Screen name="adminDashboard" component={AdminDashboard} />
      
      {/* Additional pages */}
      <Stack.Screen name="nouveauTicket" component={NouveauTicket} />
      <Stack.Screen name="parametres" component={ParametresPage} />
    </Stack.Navigator>
  );
}

function AppContent() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <AppNavigator />
      
      {/* Global Modals */}
      <AddUserModal />
      <TicketDetailModal />
    </NavigationContainer>
  );
}

function App() {
  return (
    <AuthProvider>
      <TicketProvider>
        <JammLineProvider>
          <AppContent />
        </JammLineProvider>
      </TicketProvider>
    </AuthProvider>
  );
}

// Enregistrement correct pour Expo
registerRootComponent(App);

export default App;
