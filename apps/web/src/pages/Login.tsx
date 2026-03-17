import React, { useState } from "react";
import { useAuth } from "@monprojet/shared";
import { useNavigate, Link } from "react-router-dom";
import {
  Activity,
  User,
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ArrowRight,
  Loader2,
} from "lucide-react";

const ROLES = [
  {
    key: "patient",
    label: "Patient",
    icon: User,
    color: "teal",
    hex: "#14B8A6",
  },
  {
    key: "medecin",
    label: "Médecin",
    icon: Activity,
    color: "blue",
    hex: "#3B82F6",
  },
  { key: "admin", label: "Admin", icon: Shield, color: "red", hex: "#EF4444" },
];

const DEMO_ACCOUNTS = [
  {
    role: "patient",
    label: "Amadou Diallo",
    email: "patient1@test.com",
    password: "patient123",
    icon: User,
    color: "teal",
    hex: "#14B8A6",
  },
  {
    role: "medecin",
    label: "Dr. Marie Diop",
    email: "medecin1@test.com",
    password: "medecin123",
    icon: Activity,
    color: "blue",
    hex: "#3B82F6",
  },
  {
    role: "admin",
    label: "Cheikh Faye",
    email: "admin@test.com",
    password: "admin123",
    icon: Shield,
    color: "red",
    hex: "#EF4444",
  },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("patient");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Déterminer la classe de dégradé en fonction du rôle
  const gradientClass =
    selectedRole === "patient"
      ? "from-teal-500 to-teal-700"
      : selectedRole === "medecin"
        ? "from-blue-500 to-blue-700"
        : "from-red-500 to-red-700";

  // Déterminer la couleur active en Hex pour les boutons
  const activeHex = ROLES.find((r) => r.key === selectedRole)?.hex || "#14B8A6";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      window.alert("Veuillez remplir l'email et le mot de passe.");
      return;
    }

    setIsLoading(true);
    try {
      await login(email.trim(), password, selectedRole);
      navigate("/dashboard");
    } catch (error: any) {
      window.alert(error.message || "Email, mot de passe ou rôle incorrect.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (account: any) => {
    setIsLoading(true);
    try {
      await login(account.email, account.password, account.role);
      navigate("/dashboard");
    } catch (error: any) {
      window.alert(error.message || "Connexion rapide échouée.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${gradientClass} transition-colors duration-500 py-10 px-4 flex flex-col items-center justify-center font-sans`}
    >
      {/* ── En-tête ── */}
      <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 shadow-lg backdrop-blur-sm">
          <Activity size={40} color="#fff" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wide mb-2 drop-shadow-md">
          JammLine
        </h1>
        <p className="text-white/80 text-sm md:text-base font-medium">
          Gestion de files d'attente médicales
        </p>
      </div>

      {/* ── Formulaire ── */}
      <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-500">
        {/* Sélecteur de rôle */}
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Je suis un(e)
        </p>
        <div className="flex gap-2 mb-6">
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isActive = selectedRole === role.key;
            return (
              <button
                key={role.key}
                type="button"
                onClick={() => setSelectedRole(role.key)}
                className={`flex-1 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 py-3 md:py-2.5 rounded-xl border-2 transition-all duration-300 ${
                  isActive
                    ? "text-white shadow-md transform scale-[1.02]"
                    : "bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100"
                }`}
                style={
                  isActive
                    ? { backgroundColor: role.hex, borderColor: role.hex }
                    : {}
                }
              >
                <Icon size={18} />
                <span
                  className={`text-xs md:text-sm font-bold ${isActive ? "text-white" : "text-gray-500"}`}
                >
                  {role.label}
                </span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Email
            </label>
            <div
              className="flex items-center bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 focus-within:bg-white transition-colors"
              style={{ outlineColor: activeHex }}
            >
              <Mail size={18} className="text-gray-400 mr-3" />
              <input
                type="email"
                placeholder="exemple@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent w-full outline-none text-gray-900 text-sm"
                required
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Mot de passe
            </label>
            <div className="flex items-center bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 focus-within:bg-white transition-colors">
              <Lock size={18} className="text-gray-400 mr-3" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent w-full outline-none text-gray-900 text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Bouton connexion */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 text-white font-bold py-3.5 rounded-xl shadow-lg mt-6 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
            style={{
              backgroundColor: activeHex,
              boxShadow: `0 10px 15px -3px ${activeHex}40`,
            }}
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <LogIn size={20} /> Se connecter
              </>
            )}
          </button>
        </form>

        {/* Lien Inscription */}
        <div className="text-center mt-5">
          <span className="text-sm text-gray-500">Pas encore de compte ? </span>
          <Link
            to="/register"
            className="text-sm font-bold hover:underline"
            style={{ color: activeHex }}
          >
            S'inscrire
          </Link>
        </div>

        {/* ── Connexion rapide (démo) ── */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Connexion rapide (démo)
          </span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <div className="space-y-3">
          {DEMO_ACCOUNTS.map((account) => {
            const Icon = account.icon;
            return (
              <button
                key={account.role}
                onClick={() => handleQuickLogin(account)}
                disabled={isLoading}
                className="w-full flex items-center gap-4 p-3 rounded-xl border-2 bg-gray-50 hover:bg-white transition-all group disabled:opacity-60"
                style={{ borderColor: `${account.hex}30` }} // 30 pour la transparence
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm"
                  style={{ backgroundColor: account.hex }}
                >
                  <Icon size={18} />
                </div>
                <div className="flex-1 text-left">
                  <p
                    className="text-sm font-bold text-gray-900 group-hover:text-gray-700 transition-colors"
                    style={{ color: account.hex }}
                  >
                    {account.label}
                  </p>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase">
                    {account.role}
                  </p>
                </div>
                <ArrowRight
                  size={18}
                  className="opacity-40 group-hover:opacity-100 transition-opacity"
                  style={{ color: account.hex }}
                />
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-white/60 text-xs font-medium mt-8">
        JammLine v1.0.0 — Démo Web
      </p>
    </div>
  );
}
