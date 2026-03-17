import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "@monprojet/shared";

// Screens
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import PatientDashboard from "../screens/PatientDashboard";
import MedecinDashboard from "../screens/MedecinDashboard";
import AdminDashboard from "../screens/AdminDashboard";
import NouveauTicketScreen from "../screens/NouveauTicketScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ─── Navigation Patient ───────────────────────────────────────────────────────
function PatientTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Accueil") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Ticket") {
            iconName = focused ? "ticket" : "ticket-outline";
          } else if (route.name === "Profil") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Paramètres") {
            iconName = focused ? "settings" : "settings-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#14B8A6",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Accueil"
        component={PatientDashboard}
        options={{ tabBarLabel: "Accueil" }}
      />
      <Tab.Screen
        name="Ticket"
        component={NouveauTicketScreen}
        options={{ tabBarLabel: "Ticket" }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfileScreen}
        options={{ tabBarLabel: "Profil" }}
      />
      <Tab.Screen
        name="Paramètres"
        component={SettingsScreen}
        options={{ tabBarLabel: "Paramètres" }}
      />
    </Tab.Navigator>
  );
}

// ─── Navigation Médecin ───────────────────────────────────────────────────────
function MedecinTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Tableau de bord") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "File d'attente") {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "Profil") {
            iconName = focused ? "person" : "person-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#3B82F6",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Tableau de bord"
        component={MedecinDashboard}
        options={{ tabBarLabel: "Tableau de bord" }}
      />
      <Tab.Screen
        name="File d'attente"
        component={MedecinDashboard}
        options={{ tabBarLabel: "File d'attente" }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfileScreen}
        options={{ tabBarLabel: "Profil" }}
      />
    </Tab.Navigator>
  );
}

// ─── Navigation Admin ─────────────────────────────────────────────────────────
function AdminTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Dashboard") {
            iconName = focused ? "grid" : "grid-outline";
          } else if (route.name === "Utilisateurs") {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "Rapports") {
            iconName = focused ? "bar-chart" : "bar-chart-outline";
          } else if (route.name === "Profil") {
            iconName = focused ? "person" : "person-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#EF4444",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={AdminDashboard}
        options={{ tabBarLabel: "Aperçu" }}
      />
      <Tab.Screen
        name="Utilisateurs"
        component={AdminDashboard}
        options={{ tabBarLabel: "Utilisateurs" }}
      />
      <Tab.Screen
        name="Rapports"
        component={AdminDashboard}
        options={{ tabBarLabel: "Rapports" }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfileScreen}
        options={{ tabBarLabel: "Profil" }}
      />
    </Tab.Navigator>
  );
}

// ─── Navigateur principal ─────────────────────────────────────────────────────
export default function AppNavigator() {
  const authContext = useContext(AuthContext);

  if (!authContext) return null;

  const { userToken, userType, isLoading } = authContext;

  // Ne rien afficher pendant le chargement du token persisté
  if (isLoading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!userToken ? (
        // ── Écrans non authentifiés ────────────────────────────────────────────
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        // ── Écrans authentifiés (selon le rôle) ───────────────────────────────
        <>
          {userType === "patient" && (
            <Stack.Screen name="PatientTabs" component={PatientTabNavigator} />
          )}
          {userType === "medecin" && (
            <Stack.Screen name="MedecinTabs" component={MedecinTabNavigator} />
          )}
          {userType === "admin" && (
            <Stack.Screen name="AdminTabs" component={AdminTabNavigator} />
          )}
        </>
      )}
    </Stack.Navigator>
  );
}
