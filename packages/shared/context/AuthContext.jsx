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

  const loadProfileData = async (userId) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (data) setProfile(data);
  };

  useEffect(() => {
    // 1. Vérification initiale ultra-rapide
    const init = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          loadProfileData(session.user.id); // On lance le chargement en arrière-plan
        }
      } catch (e) {
        console.error(e);
      } finally {
        // ON LIBÈRE L'ÉCRAN QUOI QU'IL ARRIVE
        setIsLoading(false);
      }
    };
    init();

    // 2. Écouteur de changement d'état
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadProfileData(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setIsLoading(false); // Libère aussi ici
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isAuthenticated: !!user,
        userType: profile?.role || "patient",
        userName: profile?.nom || "Chargement...",
        login: (email, password) =>
          supabase.auth.signInWithPassword({ email, password }),
        logout: async () => {
          await supabase.auth.signOut();
          window.location.href = "/";
        },
        register: async ({ email, password, name, type, phone }) => {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });
          if (error) throw error;
          if (data.user) {
            await supabase.from("profiles").insert([
              {
                id: data.user.id,
                nom: name,
                email,
                role: type,
                telephone: phone,
              },
            ]);
            loadProfileData(data.user.id);
          }
          return data;
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
