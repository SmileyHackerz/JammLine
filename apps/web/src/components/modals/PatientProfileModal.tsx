import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Droplet,
  CreditCard,
  AlertCircle,
  Edit2,
  Save,
  Undo,
  Loader2,
  CheckCircle,
  Activity,
  Info,
  Heart,
} from "lucide-react";
import { useAuth, useApp } from "@monprojet/shared";
import { useNavigate } from "react-router-dom";

interface PatientProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PatientProfileModal({
  isOpen,
  onClose,
}: PatientProfileModalProps) {
  const { currentUser, updateProfile } = useAuth();
  const { addNotification } = useApp();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    dateNaissance: "",
    genre: "",
    adresse: "",
    mutuelle: "",
    groupeSanguin: "",
    allergies: "",
    traitements: "",
  });

  // Charger les données à l'ouverture
  // Dans PatientProfileModal.tsx, remplace le useEffect par celui-ci :

  useEffect(() => {
    if (currentUser && isOpen) {
      setForm({
        nom: currentUser.nom || "", // Supabase utilise .nom
        email: currentUser.email || "",
        telephone: currentUser.telephone || "", // Supabase utilise .telephone
        dateNaissance: currentUser.dateNaissance || "",
        genre: currentUser.genre || "",
        adresse: currentUser.adresse || "",
        mutuelle: currentUser.mutuelle || "",
        groupeSanguin: currentUser.groupeSanguin || "",
        allergies: currentUser.allergies || "",
        traitements: currentUser.traitements || "",
      });
    }
  }, [currentUser, isOpen]);

  // Bloquer le scroll du fond
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        ...form,
        telephone: form.telephone,
        adresse: form.adresse,
      });
      addNotification("Profil mis à jour avec succès", "success", "profile");
      setIsEditing(false);
      window.alert("Votre profil a été mis à jour !");
    } catch (error) {
      window.alert("Erreur lors de la mise à jour");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Helper pour les champs
  const Field = ({ label, value, name, icon: Icon, editable = true }: any) => {
    const uniqueId = `modal-input-${name}`; // 👈 ID UNIQUE
    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={uniqueId}
          className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"
        >
          {label}
        </label>
        <div
          className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${
            isEditing && editable
              ? "bg-white border-teal-500 shadow-sm"
              : "bg-gray-50 border-transparent text-gray-500"
          }`}
        >
          <Icon
            size={16}
            className={
              isEditing && editable ? "text-teal-500" : "text-gray-400"
            }
          />
          {isEditing && editable ? (
            <input
              id={uniqueId} // 👈 BRANCHEMENT DE L'ID
              className="bg-transparent w-full outline-none text-sm font-bold text-gray-900"
              value={value}
              onChange={(e) => setForm({ ...form, [name]: e.target.value })}
              autoFocus={false} // 👈 SECURITÉ
            />
          ) : (
            <span className="text-sm font-bold text-gray-800">
              {value || "Non renseigné"}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-end md:items-center justify-center p-0 md:p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-h-[90vh] md:max-w-2xl rounded-t-[32px] md:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
        {/* Header (Miroir NouveauTicket) */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 pt-10 pb-8 px-6 text-white shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center mb-3 shadow-xl backdrop-blur-md">
              <span className="text-2xl font-black">
                {form.nom?.charAt(0) || "P"}
              </span>
            </div>
            <h2 className="text-2xl font-bold">{form.nom}</h2>
            <p className="opacity-80 text-xs font-medium">{form.email}</p>

            <button
              onClick={() => {
                onClose();
                navigate("/profile");
              }}
              className="mt-4 px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
            >
              Paramètres complets →
            </button>
          </div>
        </div>

        {/* Body Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Section 1 : Personnel */}
          <section className="space-y-4">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <User size={14} /> Informations Personnelles
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Nom complet"
                value={form.nom}
                name="nom"
                icon={User}
              />
              <Field
                label="Téléphone"
                value={form.telephone}
                name="telephone"
                icon={Phone}
              />
              <Field
                label="Date de Naissance"
                value={form.dateNaissance}
                name="dateNaissance"
                icon={Calendar}
              />
              <Field
                label="Genre"
                value={form.genre}
                name="genre"
                icon={User}
              />
              <div className="md:col-span-2">
                <Field
                  label="Adresse Résidentielle"
                  value={form.adresse}
                  name="adresse"
                  icon={MapPin}
                />
              </div>
            </div>
          </section>

          {/* Section 2 : Médical */}
          <section className="space-y-4">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Heart size={14} className="text-red-500" /> Dossier Médical
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Mutuelle / Assurance"
                value={form.mutuelle}
                name="mutuelle"
                icon={CreditCard}
              />
              <Field
                label="Groupe Sanguin"
                value={form.groupeSanguin}
                name="groupeSanguin"
                icon={Droplet}
              />
              <div className="md:col-span-2">
                <Field
                  label="Allergies connues"
                  value={form.allergies}
                  name="allergies"
                  icon={AlertCircle}
                />
              </div>
              <div className="md:col-span-2">
                <Field
                  label="Traitements en cours"
                  value={form.traitements}
                  name="traitements"
                  icon={Activity}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Footer Fixe */}
        <div className="p-6 border-t border-gray-100 bg-white shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full flex items-center justify-center gap-2 py-4 bg-teal-500 text-white font-black rounded-2xl shadow-lg shadow-teal-500/30 hover:bg-teal-600 transition-all"
            >
              <Edit2 size={18} /> Modifier mon profil
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 py-4 bg-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-200 transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-[2] flex items-center justify-center gap-2 py-4 bg-emerald-500 text-white font-black rounded-2xl shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <CheckCircle size={18} /> Enregistrer
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
