import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Bell,
  Globe,
  Sun,
  Volume2,
  Shield,
  Eye,
  Type,
  Contrast,
  MousePointer2,
  LogOut,
  RefreshCw,
  Trash2,
  ChevronDown,
  Check,
  Save,
} from "lucide-react";
import { useApp, useAuth } from "@monprojet/shared";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { addNotification } = useApp();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    notifications: {
      ticket: true,
      reservation: true,
      rappel: true,
      system: true,
      general: true,
    },
    preferences: {
      language: "Français",
      theme: "Clair",
      autoRefresh: true,
      soundEnabled: true,
    },
    privacy: { shareData: false, analyticsEnabled: true },
    accessibility: {
      fontSize: "Moyenne",
      highContrast: false,
      reducedMotion: false,
    },
  });

  // Bloquer le scroll du fond
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSave = () => {
    addNotification("Paramètres enregistrés avec succès", "success", "system");
    window.alert("Vos paramètres ont été mis à jour !");
    onClose();
  };

  if (!isOpen) return null;

  // Composant Toggle Switch Réutilisable
  const Toggle = ({
    enabled,
    onClick,
  }: {
    enabled: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? "bg-teal-500" : "bg-gray-200"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-4 font-sans">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-h-[90vh] md:max-w-2xl rounded-t-[32px] md:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-gray-900">Paramètres</h2>
            <button
              onClick={() => {
                onClose();
                navigate("/settings");
              }}
              className="text-teal-500 text-xs font-black uppercase tracking-widest hover:underline text-left mt-1"
            >
              Réglages Avancés →
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Body Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-20">
          {/* SECTION : NOTIFICATIONS */}
          <section>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Bell size={14} /> Notifications
            </h3>
            <div className="bg-gray-50 rounded-2xl divide-y divide-gray-100 overflow-hidden border border-gray-100">
              {Object.entries(settings.notifications).map(([key, val]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 hover:bg-white transition-colors"
                >
                  <div>
                    <p className="text-sm font-bold text-gray-800 capitalize">
                      {key}
                    </p>
                    <p className="text-[11px] text-gray-500 italic">
                      Alertes pour vos {key}s
                    </p>
                  </div>
                  <Toggle
                    enabled={val}
                    onClick={() =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          [key]: !val,
                        },
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </section>

          {/* SECTION : PRÉFÉRENCES */}
          <section>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Sun size={14} /> Apparence & Langue
            </h3>
            <div className="bg-gray-50 rounded-2xl p-2 space-y-2 border border-gray-100">
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                    <Globe size={18} />
                  </div>
                  <span className="text-sm font-bold text-gray-700">
                    Langue
                  </span>
                </div>
                <button className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600">
                  {settings.preferences.language} <ChevronDown size={14} />
                </button>
              </div>
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
                    <Sun size={18} />
                  </div>
                  <span className="text-sm font-bold text-gray-700">Thème</span>
                </div>
                <button className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600">
                  {settings.preferences.theme} <ChevronDown size={14} />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 border-t border-gray-100 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-500">
                    <Volume2 size={18} />
                  </div>
                  <span className="text-sm font-bold text-gray-700">
                    Sons activés
                  </span>
                </div>
                <Toggle
                  enabled={settings.preferences.soundEnabled}
                  onClick={() =>
                    setSettings({
                      ...settings,
                      preferences: {
                        ...settings.preferences,
                        soundEnabled: !settings.preferences.soundEnabled,
                      },
                    })
                  }
                />
              </div>
            </div>
          </section>

          {/* SECTION : ACTIONS COMPTE */}
          <section className="space-y-3">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
              Gestion du compte
            </h3>
            <button
              onClick={() => window.confirm("Réinitialiser ?")}
              className="w-full flex items-center gap-3 p-4 bg-amber-50 text-amber-700 rounded-2xl font-bold text-sm hover:bg-amber-100 transition-colors"
            >
              <RefreshCw size={18} /> Réinitialiser les paramètres
            </button>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl font-bold text-sm hover:bg-red-100 transition-colors"
            >
              <LogOut size={18} /> Se déconnecter de JammLine
            </button>
            <button className="w-full flex items-center gap-3 p-4 text-gray-400 rounded-2xl font-bold text-xs hover:text-red-500 transition-colors justify-center">
              <Trash2 size={14} /> Supprimer définitivement mon compte
            </button>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-white shrink-0 flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-200 transition-all"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="flex-[2] flex items-center justify-center gap-2 py-4 bg-teal-500 text-white font-black rounded-2xl shadow-lg shadow-teal-500/30 hover:bg-teal-600 transition-all"
          >
            <Save size={18} /> Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
