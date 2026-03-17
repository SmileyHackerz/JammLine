import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, AuthProvider, useAuth } from "@monprojet/shared";
import type { ReactNode } from "react";

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
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
}

function RoleBasedDashboard() {
  const { userType } = useAuth();

  if (userType === "admin") return <AdminDashboard />;
  if (userType === "medecin") return <MedecinDashboard />;
  if (userType === "patient") return <PatientDashboard />;

  return <Navigate to="/" />;
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
