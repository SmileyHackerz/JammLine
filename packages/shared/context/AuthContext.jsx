import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import { supabase } from "../supabaseClient";

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const inactivityTimerRef = useRef(null);
  const FIVE_MINUTES = 5 * 60 * 1000;

  const handleAutoLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    window.location.href = "/";
  };

  const resetTimer = () => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(handleAutoLogout, FIVE_MINUTES);
  };

  // 1. FONCTION DE CHARGEMENT UNIQUE
  const loadProfileData = async (userId) => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;
      if (data) setProfile(data);
    } catch (e) {
      console.error("Erreur de chargement profil:", e.message);
    }
  };

  // 2. USEEFFECT SANS DÉPENDANCE (ÉVITE LA BOUCLE)
  useEffect(() => {
    // Vérification initiale
    const initAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await loadProfileData(session.user.id);
        resetTimer();
      }
      setIsLoading(false);
    };
    initAuth();

    // Écouteur d'état
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await loadProfileData(session.user.id);
        resetTimer();
      } else {
        setUser(null);
        setProfile(null);
      }
      setIsLoading(false);
    });

    // Écouteurs d'activité
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];
    events.forEach((e) => window.addEventListener(e, resetTimer));

    return () => {
      subscription.unsubscribe();
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, []); // 👈 VIDE : S'exécute une seule fois

  return (
    <AuthContext.Provider
      value={{
        user,
        profile, // C'est l'objet complet de la BDD
        isLoading,
        isAuthenticated: !!user,
        userType: profile?.role || "patient",
        userName: profile?.nom || "Utilisateur",
        currentUser: profile, // On s'assure que currentUser EST le profil
        login: (email, password) =>
          supabase.auth.signInWithPassword({ email, password }),
        logout: handleAutoLogout,
        register: async ({ email, password, name, type, phone }) => {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });
          if (error) throw error;
          if (data.user) {
            // Insertion avec le nom de colonne 'telephone'
            await supabase.from("profiles").insert([
              {
                id: data.user.id,
                nom: name,
                email: email,
                role: type,
                telephone: phone, // 👈 CORRECTION ICI
              },
            ]);
            await loadProfileData(data.user.id);
          }
          return data;
        },
        updateProfile: async (updates) => {
          const { error } = await supabase
            .from("profiles")
            .update(updates)
            .eq("id", user.id);
          if (!error) await loadProfileData(user.id);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
