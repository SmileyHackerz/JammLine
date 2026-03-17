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

  // 1. Référence pour stocker le Timer
  const inactivityTimerRef = useRef(null);
  const FIVE_MINUTES = 5 * 60 * 1000; // 300 000 ms

  // 2. Fonction de déconnexion automatique
  const handleAutoLogout = async () => {
    console.log("⏰ Temps d'inactivité dépassé. Déconnexion...");
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/"; // Redirection forcée vers l'accueil
  };

  // 3. Fonction pour réinitialiser le timer à chaque mouvement
  const resetTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    // Si l'utilisateur est connecté, on relance le compte à rebours
    if (user) {
      inactivityTimerRef.current = setTimeout(handleAutoLogout, FIVE_MINUTES);
    }
  };

  const loadProfileData = async (userId) => {
    console.log("📡 Récupération du profil Supabase pour :", userId);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("❌ Erreur de lecture profil :", error.message);
      return;
    }

    if (data) {
      console.log("✅ Données reçues de la BDD :", data);
      setProfile(data);
    } else {
      console.warn(
        "⚠️ Aucune ligne trouvée dans la table profiles pour cet ID",
      );
    }
  };

  useEffect(() => {
    // Initialisation session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        loadProfileData(session.user.id);
        resetTimer(); // Lancer le timer au chargement
      }
      setIsLoading(false);
    });

    // 4. Écouteurs d'activité utilisateur
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];

    if (user) {
      events.forEach((event) => {
        window.addEventListener(event, resetTimer);
      });
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadProfileData(session.user.id);
        resetTimer(); // Reset au changement d'état
      } else {
        setUser(null);
        setProfile(null);
        if (inactivityTimerRef.current)
          clearTimeout(inactivityTimerRef.current);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      // Nettoyage des écouteurs
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [user]); // On relance l'effet si l'utilisateur change

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isAuthenticated: !!user,
        userType: profile?.role || "patient",
        userName: profile?.nom || "Utilisateur",
        login: (email, password) =>
          supabase.auth.signInWithPassword({ email, password }),
        logout: handleAutoLogout, // Utilise la même fonction pour le bouton manuel
        register: async ({ email, password, name, type, phone }) => {
          // 1. Création du compte dans l'Auth de Supabase
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });

          if (error) throw error;

          if (data.user) {
            // 2. Création du profil avec TOUTES les infos (Rôle + Téléphone)
            const { error: pError } = await supabase.from("profiles").insert([
              {
                id: data.user.id,
                nom: name,
                email: email,
                role: type, // Fix : Enregistre bien 'medecin' ou 'patient'
                telephone: phone, // Fix : Enregistre le numéro de téléphone
                settings: { notifications: true, darkMode: false },
              },
            ]);

            if (pError) {
              console.error("Erreur profil:", pError);
              throw pError;
            }

            // 3. Charger les données immédiatement
            await loadProfileData(data.user.id);
          }
          return data;
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
