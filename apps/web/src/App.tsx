import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, AuthProvider, useAuth } from "@monprojet/shared";
import type { ReactNode } from "react";
import Logo from "./components/Logo";

// Imports
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/PatientDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MedecinDashboard from "./pages/MedecinDashboard";
import NouveauTicketScreen from "./pages/NouveauTicketScreen";
import ProfileScreen from "./pages/ProfileScreen";
import SettingsScreen from "./pages/SettingsScreen";

const webStorage = {
  getItem: async (key: string) => localStorage.getItem(key),
  setItem: async (key: string, value: string) =>
    localStorage.setItem(key, value),
  removeItem: async (key: string) => localStorage.removeItem(key),
};

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  // TANT QUE isLoading est vrai, on affiche l'écran de chargement
  // même si user est encore null pendant une fraction de seconde
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-teal-600 font-bold animate-pulse uppercase text-xs tracking-widest">
          Vérification de la session...
        </p>
      </div>
    );
  }

  // SI on a fini de charger ET qu'on n'a vraiment personne -> Login
  if (!isAuthenticated && !user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

function RoleBasedDashboard() {
  const { userType, profile, user } = useAuth();

  // Si on est connecté mais que le rôle n'a pas encore fini de charger (pendant 0.5s)
  // On affiche un écran neutre mais on ne bloque PAS
  if (user && !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Logo size="normal" className="animate-pulse" />
        <p className="mt-4 text-teal-600 font-bold text-xs uppercase tracking-widest">
          Connexion sécurisée...
        </p>
      </div>
    );
  }

  // Redirection classique
  if (userType === "admin") return <AdminDashboard />;
  if (userType === "medecin") return <MedecinDashboard />;
  return <PatientDashboard />;
}

export default function App() {
  return (
    <AuthProvider storage={webStorage}>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* Pages Publiques */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Pages Protégées */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <RoleBasedDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ticket"
              element={
                <ProtectedRoute>
                  <NouveauTicketScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsScreen />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}
