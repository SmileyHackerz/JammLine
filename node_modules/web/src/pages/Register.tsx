import React, { useState } from "react";
import { useAuth } from "@monprojet/shared";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Activity,
  Shield,
  ArrowLeft,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  UserPlus,
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

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("patient");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Couleurs dynamiques
  const gradientClass =
    userType === "patient"
      ? "from-teal-500 to-teal-700"
      : userType === "medecin"
        ? "from-blue-500 to-blue-700"
        : "from-red-500 to-red-700";

  const activeHex = ROLES.find((r) => r.key === userType)?.hex || "#14B8A6";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !password ||
      !confirmPassword
    ) {
      window.alert("Veuillez remplir tous les champs");
      return;
    }

    if (password !== confirmPassword) {
      window.alert("Les mots de passe ne correspondent pas");
      return;
    }

    if (password.length < 6) {
      window.alert("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        type: userType,
      });
      navigate("/dashboard");
    } catch (error: any) {
      window.alert(
        error.message || "Une erreur est survenue. Veuillez réessayer.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${gradientClass} transition-colors duration-500 font-sans md:py-10 flex flex-col items-center md:justify-center`}
    >
      <div className="w-full max-w-lg md:shadow-2xl md:rounded-[32px] overflow-hidden flex flex-col min-h-screen md:min-h-0 bg-white md:bg-transparent">
        {/* ── En-tête ── */}
        <div
          className={`pt-10 pb-16 px-6 md:pt-12 md:pb-14 transition-colors duration-500 bg-gradient-to-br ${gradientClass}`}
        >
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-4 hover:bg-white/30 transition-colors backdrop-blur-sm"
          >
            <ArrowLeft size={20} color="#fff" />
          </button>
          <h1 className="text-3xl font-bold text-white mb-1 drop-shadow-sm">
            Créer un compte
          </h1>
          <p className="text-white/90 text-sm font-medium">
            Rejoignez JammLine 🏥
          </p>
        </div>

        {/* ── Formulaire ── */}
        <div className="bg-white px-6 py-8 flex-1 -mt-8 rounded-t-[32px] md:rounded-t-3xl shadow-[0_-8px_20px_rgba(0,0,0,0.1)]">
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Nom */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Nom complet
              </label>
              <div
                className="flex items-center bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 focus-within:bg-white transition-colors"
                style={{ outlineColor: activeHex }}
              >
                <User size={18} className="text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Ex : Amadou Diallo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-transparent w-full outline-none text-gray-900 text-sm"
                  required
                />
              </div>
            </div>

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

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Téléphone
              </label>
              <div
                className="flex items-center bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 focus-within:bg-white transition-colors"
                style={{ outlineColor: activeHex }}
              >
                <Phone size={18} className="text-gray-400 mr-3" />
                <input
                  type="tel"
                  placeholder="+221 77 123 45 67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-transparent w-full outline-none text-gray-900 text-sm"
                  required
                />
              </div>
            </div>

            {/* Rôle */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 mt-2">
                Type de compte
              </label>
              <div className="flex gap-2 mb-2">
                {ROLES.map((role) => {
                  const Icon = role.icon;
                  const isActive = userType === role.key;
                  return (
                    <button
                      key={role.key}
                      type="button"
                      onClick={() => setUserType(role.key)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition-all duration-300 ${
                        isActive
                          ? "text-white shadow-md transform scale-[1.02]"
                          : "bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100"
                      }`}
                      style={
                        isActive
                          ? { backgroundColor: role.hex, borderColor: role.hex }
                          : {}
                      }
                    >
                      <Icon size={16} />
                      <span className="text-xs font-bold">{role.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mot de passe */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Mot de passe
                </label>
                <div
                  className="flex items-center bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 focus-within:bg-white transition-colors"
                  style={{ outlineColor: activeHex }}
                >
                  <Lock size={18} className="text-gray-400 mr-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 6 caractères"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent w-full outline-none text-gray-900 text-sm"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirmer */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Confirmer
                </label>
                <div
                  className="flex items-center bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 focus-within:bg-white transition-colors"
                  style={{ outlineColor: activeHex }}
                >
                  <Lock size={18} className="text-gray-400 mr-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Retapez"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-transparent w-full outline-none text-gray-900 text-sm"
                    required
                  />
                  {confirmPassword.length > 0 &&
                    (password === confirmPassword ? (
                      <CheckCircle size={18} className="text-emerald-500" />
                    ) : (
                      <XCircle size={18} className="text-red-500" />
                    ))}
                </div>
              </div>
            </div>

            {/* Bouton S'inscrire */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 text-white font-bold py-4 rounded-xl mt-8 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
              style={{
                backgroundColor: activeHex,
                boxShadow: `0 10px 15px -3px ${activeHex}40`,
              }}
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <UserPlus size={20} /> S'inscrire
                </>
              )}
            </button>
          </form>

          {/* Lien Connexion */}
          <div className="text-center mt-6 pb-4">
            <span className="text-sm text-gray-500">Déjà un compte ? </span>
            <Link
              to="/"
              className="text-sm font-bold hover:underline"
              style={{ color: activeHex }}
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
