import React, { useState } from "react";
import { useAuth } from "@monprojet/shared";
import {
  Globe,
  Clock,
  Trash2,
  Download,
  Mail,
  HelpCircle,
  MessageSquare,
  FileText,
  ShieldCheck,
  Code,
  RefreshCw,
  ChevronRight,
} from "lucide-react";

export default function SettingsScreen() {
  const { userType } = useAuth();

  const [settings, setSettings] = useState({
    notifications: true,
    soundEnabled: true,
    vibrationEnabled: true,
    autoRefresh: true,
    darkMode: false,
    language: "fr",
    timeZone: "UTC",
  });

  // ─── Configurations Visuelles selon le rôle ───
  const roleConfig = {
    patient: {
      color: "#14B8A6",
      bgClass: "from-teal-500 to-teal-600",
      switchClass: "bg-teal-500",
    },
    medecin: {
      color: "#3B82F6",
      bgClass: "from-blue-500 to-blue-600",
      switchClass: "bg-blue-500",
    },
    admin: {
      color: "#EF4444",
      bgClass: "from-red-500 to-red-600",
      switchClass: "bg-red-500",
    },
  };
  const currentConfig =
    roleConfig[userType as keyof typeof roleConfig] || roleConfig.patient;

  // ─── Handlers ───
  const handleSettingChange = (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearCache = () => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir vider le cache de l'application ?",
      )
    ) {
      window.alert("Cache vidé avec succès");
    }
  };

  const handleResetSettings = () => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?",
      )
    ) {
      setSettings({
        notifications: true,
        soundEnabled: true,
        vibrationEnabled: true,
        autoRefresh: true,
        darkMode: false,
        language: "fr",
        timeZone: "UTC",
      });
      window.alert("Paramètres réinitialisés");
    }
  };

  const openLink = (url: string) => {
    window.open(url, "_blank");
  };

  // ─── Composant Switch personnalisé ───
  const Switch = ({
    enabled,
    onChange,
  }: {
    enabled: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? currentConfig.switchClass : "bg-gray-200"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-12">
      {/* ── Header ── */}
      <div
        className={`bg-gradient-to-r ${currentConfig.bgClass} pt-12 pb-8 px-6 text-center md:rounded-b-[40px] shadow-md md:max-w-3xl md:mx-auto`}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-sm">
          Paramètres
        </h1>
        <p className="text-white/90 text-sm md:text-base font-medium">
          Personnalisez votre expérience
        </p>
      </div>

      <div className="px-4 mt-6 max-w-3xl mx-auto space-y-5">
        {/* ── Notifications ── */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Notifications
          </h2>

          <div className="flex justify-between items-center py-3 border-b border-gray-50">
            <div>
              <p className="text-sm font-bold text-gray-800">
                Notifications push
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Recevoir des notifications pour les mises à jour
              </p>
            </div>
            <Switch
              enabled={settings.notifications}
              onChange={(v) => handleSettingChange("notifications", v)}
            />
          </div>

          <div className="flex justify-between items-center py-3 border-b border-gray-50">
            <div>
              <p className="text-sm font-bold text-gray-800">Son</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Activer les sons de notification
              </p>
            </div>
            <Switch
              enabled={settings.soundEnabled}
              onChange={(v) => handleSettingChange("soundEnabled", v)}
            />
          </div>

          <div className="flex justify-between items-center pt-3">
            <div>
              <p className="text-sm font-bold text-gray-800">Vibration</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Vibrer lors des notifications
              </p>
            </div>
            <Switch
              enabled={settings.vibrationEnabled}
              onChange={(v) => handleSettingChange("vibrationEnabled", v)}
            />
          </div>
        </section>

        {/* ── Apparence ── */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Apparence</h2>

          <div className="flex justify-between items-center py-3 border-b border-gray-50">
            <div>
              <p className="text-sm font-bold text-gray-800">Mode sombre</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Activer le thème sombre de l'application
              </p>
            </div>
            <Switch
              enabled={settings.darkMode}
              onChange={(v) => handleSettingChange("darkMode", v)}
            />
          </div>

          <button className="w-full flex items-center py-3 border-b border-gray-50 hover:bg-gray-50 transition -mx-5 px-5">
            <Globe size={20} className="text-gray-500 mr-3" />
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-gray-800">Langue</p>
              <p className="text-xs text-gray-500">Français</p>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>

          <button className="w-full flex items-center pt-3 hover:bg-gray-50 transition -mx-5 px-5">
            <Clock size={20} className="text-gray-500 mr-3" />
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-gray-800">Fuseau horaire</p>
              <p className="text-xs text-gray-500">UTC+0</p>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
        </section>

        {/* ── Données et stockage ── */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Données et stockage
          </h2>

          <div className="flex justify-between items-center py-3 border-b border-gray-50">
            <div>
              <p className="text-sm font-bold text-gray-800">
                Actualisation automatique
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Mettre à jour les données automatiquement
              </p>
            </div>
            <Switch
              enabled={settings.autoRefresh}
              onChange={(v) => handleSettingChange("autoRefresh", v)}
            />
          </div>

          <button
            onClick={handleClearCache}
            className="w-full flex items-center py-3 border-b border-gray-50 hover:bg-gray-50 transition -mx-5 px-5"
          >
            <Trash2 size={20} className="text-gray-500 mr-3" />
            <span className="flex-1 text-left text-sm font-bold text-gray-800">
              Vider le cache
            </span>
            <ChevronRight size={16} className="text-gray-300" />
          </button>

          <button className="w-full flex items-center pt-3 hover:bg-gray-50 transition -mx-5 px-5">
            <Download size={20} className="text-gray-500 mr-3" />
            <span className="flex-1 text-left text-sm font-bold text-gray-800">
              Exporter les données
            </span>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
        </section>

        {/* ── Support ── */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Support</h2>

          <button
            onClick={() => openLink("mailto:support@jammline.com")}
            className="w-full flex items-center py-3 border-b border-gray-50 hover:bg-gray-50 transition -mx-5 px-5"
          >
            <Mail size={20} className="text-gray-500 mr-3" />
            <span className="flex-1 text-left text-sm font-bold text-gray-800">
              Contacter le support
            </span>
            <ChevronRight size={16} className="text-gray-300" />
          </button>

          <button
            onClick={() => openLink("https://jammline.com/help")}
            className="w-full flex items-center py-3 border-b border-gray-50 hover:bg-gray-50 transition -mx-5 px-5"
          >
            <HelpCircle size={20} className="text-gray-500 mr-3" />
            <span className="flex-1 text-left text-sm font-bold text-gray-800">
              Centre d'aide
            </span>
            <ChevronRight size={16} className="text-gray-300" />
          </button>

          <button
            onClick={() => openLink("https://jammline.com/feedback")}
            className="w-full flex items-center pt-3 hover:bg-gray-50 transition -mx-5 px-5"
          >
            <MessageSquare size={20} className="text-gray-500 mr-3" />
            <span className="flex-1 text-left text-sm font-bold text-gray-800">
              Envoyer un feedback
            </span>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
        </section>

        {/* ── Légal ── */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Légal</h2>

          <button
            onClick={() => openLink("https://jammline.com/terms")}
            className="w-full flex items-center py-3 border-b border-gray-50 hover:bg-gray-50 transition -mx-5 px-5"
          >
            <FileText size={20} className="text-gray-500 mr-3" />
            <span className="flex-1 text-left text-sm font-bold text-gray-800">
              Conditions d'utilisation
            </span>
            <ChevronRight size={16} className="text-gray-300" />
          </button>

          <button
            onClick={() => openLink("https://jammline.com/privacy")}
            className="w-full flex items-center py-3 border-b border-gray-50 hover:bg-gray-50 transition -mx-5 px-5"
          >
            <ShieldCheck size={20} className="text-gray-500 mr-3" />
            <span className="flex-1 text-left text-sm font-bold text-gray-800">
              Politique de confidentialité
            </span>
            <ChevronRight size={16} className="text-gray-300" />
          </button>

          <button
            onClick={() => openLink("https://jammline.com/licenses")}
            className="w-full flex items-center pt-3 hover:bg-gray-50 transition -mx-5 px-5"
          >
            <Code size={20} className="text-gray-500 mr-3" />
            <span className="flex-1 text-left text-sm font-bold text-gray-800">
              Licences open source
            </span>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
        </section>

        {/* ── Bouton Reset ── */}
        <button
          onClick={handleResetSettings}
          className="w-full flex justify-center items-center gap-2 bg-white text-red-500 font-bold py-4 rounded-2xl border border-gray-100 shadow-sm mt-4 hover:bg-red-50 transition"
        >
          <RefreshCw size={18} /> Réinitialiser tous les paramètres
        </button>

        {/* ── Footer / Version ── */}
        <div className="text-center py-6">
          <p className="text-sm font-bold text-gray-500">JammLine v1.0.0</p>
          <p className="text-xs text-gray-400 mt-1">Build 2024.1.0</p>
        </div>
      </div>
    </div>
  );
}
