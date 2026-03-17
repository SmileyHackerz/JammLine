import React, { createContext, useState, useContext, useEffect } from "react";

export const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// ─── Utilisateurs mock pour la démo (J'ai gardé les mêmes) ──────────────
const MOCK_USERS = [
  {
    id: 1,
    email: "patient1@test.com",
    password: "patient123",
    name: "Amadou Diallo",
    type: "patient",
    profile: { telephone: "+221 77 123 45 67" },
  },
  {
    id: 6,
    email: "medecin1@test.com",
    password: "medecin123",
    name: "Dr. Marie Diop",
    type: "medecin",
    profile: { specialite: "Médecin généraliste" },
  },
  {
    id: 9,
    email: "admin@test.com",
    password: "admin123",
    name: "Aliou Faye",
    type: "admin",
    profile: { role: "Administrateur système" },
  },
  // (J'ai raccourci la liste ici pour le message, mais mets bien toute ta liste MOCK_USERS d'origine !)
];

// ICI EST LE CHANGEMENT MAGIQUE : on ajoute "storage"
export function AuthProvider({ children, storage }) {
  const [userToken, setUserToken] = useState(null);
  const [userType, setUserType] = useState(null);
  const [userName, setUserName] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStoredData = async () => {
      if (!storage) return; // Sécurité
      try {
        const storedToken = await storage.getItem("userToken");
        const storedType = await storage.getItem("userType");
        const storedName = await storage.getItem("userName");
        const storedUser = await storage.getItem("currentUser");

        if (storedToken && storedType) {
          setUserToken(storedToken);
          setUserType(storedType);
          setUserName(storedName);
          if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error("Erreur chargement auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredData();
  }, [storage]);

  const login = async (email, password, type) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const user = MOCK_USERS.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password &&
          u.type === type,
      );

      if (!user) throw new Error("Email, mot de passe ou rôle incorrect");

      const mockToken = `mock_token_${user.id}_${Date.now()}`;

      // Utilisation du storage générique
      if (storage) {
        await storage.setItem("userToken", mockToken);
        await storage.setItem("userType", user.type);
        await storage.setItem("userName", user.name);
        await storage.setItem("currentUser", JSON.stringify(user));
      }

      setUserToken(mockToken);
      setUserType(user.type);
      setUserName(user.name);
      setCurrentUser(user);

      return { success: true, user };
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (storage) {
        await storage.removeItem("userToken");
        await storage.removeItem("userType");
        await storage.removeItem("userName");
        await storage.removeItem("currentUser");
      }

      setUserToken(null);
      setUserType(null);
      setUserName(null);
      setCurrentUser(null);

      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    // ... Garde ton code de register d'origine ...
  };

  const updateProfile = async (profileData) => {
    // Garde ton code d'origine mais remplace SecureStore.setItemAsync par storage.setItem
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const user = MOCK_USERS.find((u) => u.id === currentUser?.id);
      if (user) {
        user.profile = { ...user.profile, ...profileData };
        const updatedUser = { ...user };
        setCurrentUser(updatedUser);
        if (storage) {
          await storage.setItem("currentUser", JSON.stringify(updatedUser));
        }
        return { success: true, profile: user.profile };
      }
      throw new Error("Utilisateur introuvable");
    } catch (error) {
      throw error;
    }
  };

  const value = {
    userToken,
    userType,
    userName,
    currentUser,
    isLoading,
    isAuthenticated: !!userToken,
    login,
    logout,
    register,
    updateProfile,
    mockUsers: MOCK_USERS,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
