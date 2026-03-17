import React, { useState, useEffect } from "react"; // Ajout de useEffect
import { useAuth } from "@monprojet/shared";
import { useNavigate } from "react-router-dom";
import {
  User,
  Activity,
  Shield,
  Edit2,
  Check,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Droplet,
  CreditCard,
  AlertCircle,
  Briefcase,
  Clock,
  Award,
  Hash,
  CheckCircle,
  Key,
  Fingerprint,
  Info,
  FileText,
  LogOut,
  ChevronRight,
} from "lucide-react";

export default function ProfileScreen() {
  const { userName, userType, currentUser, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  // 1. Initialisation vide pour éviter les flashs de fausses données
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // 2. Synchronisation réelle avec les données de Supabase
  useEffect(() => {
    if (currentUser) {
      setUserInfo({
        name: currentUser.nom || "",
        email: currentUser.email || "",
        phone: currentUser.telephone || "", // Colonne 'telephone' de ta BDD
        address: currentUser.adresse || "", // Colonne 'adresse' de ta BDD
      });
    }
  }, [currentUser]);

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleSave = async () => {
    try {
      await updateProfile({
        nom: userInfo.name,
        telephone: userInfo.phone,
        adresse: userInfo.address,
      });
      setIsEditing(false);
      window.alert("Votre profil a été mis à jour avec succès.");
    } catch (error) {
      window.alert("Impossible de mettre à jour le profil.");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      logout();
      navigate("/");
    }
  };

  // ─── Helpers Visuels ──────────────────────────────────────
  const roleConfig = {
    patient: {
      color: "#14B8A6",
      bgClass: "from-teal-500 to-teal-600",
      textClass: "text-teal-500",
      icon: User,
    },
    medecin: {
      color: "#3B82F6",
      bgClass: "from-blue-500 to-blue-600",
      textClass: "text-blue-500",
      icon: Activity,
    },
    admin: {
      color: "#EF4444",
      bgClass: "from-red-500 to-red-600",
      textClass: "text-red-500",
      icon: Shield,
    },
  };

  const currentConfig =
    roleConfig[userType as keyof typeof roleConfig] || roleConfig.patient;
  const RoleIcon = currentConfig.icon;

  const getRoleLabel = () => {
    if (userType === "patient") return "Patient";
    if (userType === "medecin") return currentUser?.specialite || "Médecin";
    return currentUser?.role || "Administrateur";
  };

  const getProfileExtra = () => {
    if (!currentUser?.profile) return [];
    const p = currentUser.profile;

    if (userType === "patient") {
      return [
        { label: "Date de naissance", value: p.dateNaissance, icon: Calendar },
        { label: "Genre", value: p.genre, icon: User },
        { label: "Groupe sanguin", value: p.groupeSanguin, icon: Droplet },
        { label: "Mutuelle", value: p.mutuelle, icon: CreditCard },
        { label: "Allergies", value: p.allergies, icon: AlertCircle },
        { label: "Traitements", value: p.traitements, icon: Activity },
      ].filter((item) => item.value);
    }

    if (userType === "medecin") {
      return [
        { label: "Spécialité", value: p.specialite, icon: Activity },
        { label: "Service", value: p.service, icon: Briefcase },
        { label: "Expérience", value: p.experience, icon: Clock },
        { label: "Diplôme", value: p.diplome, icon: Award },
        { label: "N° Ordre", value: p.ordre, icon: Hash },
        {
          label: "Disponibilité",
          value: p.disponible ? "Disponible" : "Indisponible",
          icon: CheckCircle,
        },
      ].filter((item) => item.value !== undefined);
    }

    return [
      { label: "Rôle", value: p.role, icon: Shield },
      { label: "Service", value: p.service, icon: Briefcase },
    ].filter((item) => item.value);
  };

  const profileExtra = getProfileExtra();

  // ─── Composant Toggle Switch ───
  const Switch = ({
    enabled,
    onChange,
  }: {
    enabled: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? currentConfig.bgClass.split(" ")[0].replace("from-", "bg-") : "bg-gray-200"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-20">
      {/* ── Header ── */}
      <div
        className={`bg-gradient-to-r ${currentConfig.bgClass} pt-12 pb-8 md:rounded-b-[40px] shadow-md md:max-w-3xl md:mx-auto`}
      >
        <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
          <div className="w-24 h-24 rounded-full border-4 border-white/40 bg-white/20 flex items-center justify-center mb-4 backdrop-blur-sm shadow-xl">
            <RoleIcon size={48} color="#fff" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            {userInfo.name}
          </h1>
          <p className="text-white/80 text-sm mb-4">{getRoleLabel()}</p>

          <div className="flex items-center gap-1.5 bg-white px-4 py-1.5 rounded-full shadow-sm">
            <RoleIcon size={14} color={currentConfig.color} />
            <span
              className="text-xs font-bold"
              style={{ color: currentConfig.color }}
            >
              {userType.charAt(0).toUpperCase() + userType.slice(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 mt-6 max-w-3xl mx-auto space-y-4">
        {/* ── Informations personnelles ── */}
        <section className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-base font-bold text-gray-900">
              Informations personnelles
            </h2>
            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 transition-colors hover:bg-gray-50"
              style={{
                borderColor: currentConfig.color,
                color: currentConfig.color,
              }}
            >
              {isEditing ? <Check size={14} /> : <Edit2 size={14} />}
              <span className="text-xs font-bold">
                {isEditing ? "Sauvegarder" : "Modifier"}
              </span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-50">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                <User size={18} className="text-gray-400" />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="name-input"
                  className="text-xs text-gray-400 font-medium mb-1 block"
                >
                  Nom complet
                </label>

                {isEditing ? (
                  <input
                    id="name-input"
                    type="text"
                    value={userInfo.name}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, name: e.target.value })
                    }
                    className="w-full text-sm font-semibold border-b-2 border-teal-500 outline-none pb-1 bg-transparent"
                  />
                ) : (
                  <p className="text-sm font-semibold text-gray-900">
                    {userInfo.name || "Non renseigné"}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 pb-4 border-b border-gray-50">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                <Mail size={18} className="text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 font-medium mb-1 block">
                  Email
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {userInfo.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 pb-4 border-b border-gray-50">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                <Phone size={18} className="text-gray-400" />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="phone-input"
                  className="text-xs text-gray-400 font-medium mb-1 block"
                >
                  Téléphone
                </label>

                {isEditing ? (
                  <input
                    id="phone-input"
                    type="tel"
                    value={userInfo.phone}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, phone: e.target.value })
                    }
                    className="w-full text-sm font-semibold border-b-2 border-teal-500 outline-none pb-1 bg-transparent"
                  />
                ) : (
                  <p className="text-sm font-semibold text-gray-900">
                    {userInfo.phone || "Non renseigné"}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                <MapPin size={18} className="text-gray-400" />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="address-input"
                  className="text-xs text-gray-400 font-medium mb-1 block"
                >
                  Adresse
                </label>

                {isEditing ? (
                  <input
                    id="address-input"
                    type="text"
                    value={userInfo.address}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, address: e.target.value })
                    }
                    className="w-full text-sm font-semibold border-b-2 border-teal-500 outline-none pb-1 bg-transparent"
                  />
                ) : (
                  <p className="text-sm font-semibold text-gray-900">
                    {userInfo.address || "Non renseignée"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <button
              onClick={handleSave}
              className="w-full flex justify-center items-center gap-2 text-white font-bold py-3.5 rounded-xl mt-6 shadow-md transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: currentConfig.color }}
            >
              <CheckCircle size={18} /> Enregistrer les modifications
            </button>
          )}
        </section>

        {/* ── Informations spécifiques au rôle ── */}
        {profileExtra.length > 0 && (
          <section className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
            <h2 className="text-base font-bold text-gray-900 mb-5">
              {userType === "patient"
                ? "Dossier médical"
                : userType === "medecin"
                  ? "Informations professionnelles"
                  : "Informations administratives"}
            </h2>
            <div className="space-y-4">
              {profileExtra.map((item, index) => {
                const Icon = item.icon;
                const isLast = index === profileExtra.length - 1;
                return (
                  <div
                    key={item.label}
                    className={`flex items-center gap-4 ${!isLast ? "pb-4 border-b border-gray-50" : ""}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                      <Icon size={18} className="text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 font-medium mb-1">
                        {item.label}
                      </p>
                      <p
                        className={`text-sm font-semibold ${item.value === "Disponible" ? "text-emerald-500" : item.value === "Indisponible" ? "text-red-500" : "text-gray-900"}`}
                      >
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Préférences ── */}
        <section className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-2">
            Préférences
          </h2>

          <div className="flex justify-between items-center py-4 border-b border-gray-50">
            <div>
              <p className="text-sm font-bold text-gray-900">Notifications</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Recevoir des notifications pour vos tickets
              </p>
            </div>
            <Switch enabled={notifications} onChange={setNotifications} />
          </div>

          <div className="flex justify-between items-center py-4">
            <div>
              <p className="text-sm font-bold text-gray-900">Mode sombre</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Activer le thème sombre (Bientôt)
              </p>
            </div>
            <Switch enabled={darkMode} onChange={setDarkMode} />
          </div>
        </section>

        {/* ── Sécurité & À propos ── */}
        <section className="bg-white rounded-2xl p-2 md:p-3 shadow-sm border border-gray-100">
          <div className="px-3 pt-3 pb-1">
            <h2 className="text-base font-bold text-gray-900">Sécurité</h2>
          </div>
          <button className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-50 transition rounded-xl">
            <Key size={18} className="text-gray-500" />
            <span className="flex-1 text-left text-sm font-medium text-gray-700">
              Changer le mot de passe
            </span>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-50 transition rounded-xl">
            <Fingerprint size={18} className="text-gray-500" />
            <span className="flex-1 text-left text-sm font-medium text-gray-700">
              Authentification biométrique
            </span>
            <ChevronRight size={16} className="text-gray-300" />
          </button>

          <div className="w-full h-px bg-gray-100 my-1"></div>
          <div className="px-3 pt-3 pb-1">
            <h2 className="text-base font-bold text-gray-900">À propos</h2>
          </div>

          <button className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-50 transition rounded-xl">
            <Info size={18} className="text-gray-400" />
            <span className="flex-1 text-left text-sm font-medium text-gray-700">
              Version de l'application
            </span>
            <span className="text-xs text-gray-400">v1.0.0</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-50 transition rounded-xl">
            <FileText size={18} className="text-gray-400" />
            <span className="flex-1 text-left text-sm font-medium text-gray-700">
              Conditions d'utilisation
            </span>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
        </section>

        {/* Bouton Déconnexion */}
        <button
          onClick={handleLogout}
          className="w-full flex justify-center items-center gap-2 bg-red-50 text-red-500 font-bold py-4 rounded-2xl border-2 border-red-100 mt-6 mb-8 hover:bg-red-100 transition"
        >
          <LogOut size={18} /> Se déconnecter
        </button>
      </div>
    </div>
  );
}
