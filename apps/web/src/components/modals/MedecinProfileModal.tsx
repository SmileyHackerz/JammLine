import React, { useState, useEffect } from "react";
import {
  X,
  Activity,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Phone,
  Briefcase,
  Clock,
  Award,
  Hash,
  Globe,
  Edit2,
  Save,
  Undo,
  Loader2,
  Star,
  Users,
  Check,
} from "lucide-react";
import { useAuth, useApp } from "@monprojet/shared";
import { useNavigate } from "react-router-dom";

interface MedecinProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FieldProps {
  label: string;
  value: string;
  name: string;
  icon: any;
  isEditing: boolean;
  setForm: (val: any) => void;
  form: any;
}

const Field = ({
  label,
  value,
  name,
  isEditing,
  setForm,
  form,
  icon: Icon,
}: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
      {label}
    </label>
    <div
      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
        isEditing
          ? "bg-white border-blue-500 shadow-sm"
          : "bg-gray-50 border-transparent"
      }`}
    >
      <Icon
        size={16}
        className={isEditing ? "text-blue-500" : "text-gray-400"}
      />
      {isEditing ? (
        <input
          className="bg-transparent w-full outline-none text-sm font-semibold text-gray-900"
          value={value}
          onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        />
      ) : (
        <span className="text-sm font-semibold text-gray-800">
          {value || "Non renseigné"}
        </span>
      )}
    </div>
  </div>
);

export default function MedecinProfileModal({
  isOpen,
  onClose,
}: MedecinProfileModalProps) {
  const { currentUser, updateProfile } = useAuth();
  const { addNotification } = useApp();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    specialite: "",
    service: "",
    experience: "",
    diplome: "",
    ordre: "",
    disponible: true,
    consultationDuration: "15 minutes",
    languages: ["Français", "Anglais"],
  });

  // 1. EMPECHER LE SCROLL DU FOND QUAND LA MODALE EST OUVERTE
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Dans MedecinProfileModal.tsx, remplace le useEffect :

  useEffect(() => {
    if (currentUser && isOpen) {
      setForm({
        nom: currentUser.nom || "",
        email: currentUser.email || "",
        telephone: currentUser.telephone || "",
        specialite: currentUser.specialite || "Non renseignée",
        service: currentUser.service || "Accueil",
        experience: currentUser.experience || "",
        diplome: currentUser.diplome || "",
        ordre: currentUser.ordre || "",
        disponible:
          currentUser.disponible !== undefined ? currentUser.disponible : true,
        consultationDuration: currentUser.consultationDuration || "15 minutes",
        languages: currentUser.languages || ["Français"],
      });
    }
  }, [currentUser, isOpen]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        ...form,
        specialite: form.specialite,
        disponible: form.disponible,
      });

      addNotification(
        "Profil médical mis à jour avec succès",
        "success",
        "profile",
      );
      setIsEditing(false);
      window.alert("Votre profil médical a été mis à jour");
    } catch (error) {
      window.alert("Erreur lors de la mise à jour");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-end md:items-center justify-center p-0 md:p-4">
      {/* Backdrop sombre */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />

      {/* MODAL CONTAINER : flex-col + max-h pour limiter la taille */}
      <div className="relative bg-white w-full max-h-[90vh] md:max-h-[85vh] md:max-w-2xl rounded-t-[32px] md:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
        {/* HEADER (Fixe) : shrink-0 pour ne pas s'écraser */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-gray-900">Profil Médical</h2>
            <button
              onClick={() => {
                onClose();
                navigate("/profile");
              }}
              className="text-blue-500 text-xs font-bold hover:underline text-left mt-1"
            >
              Voir les paramètres complets →
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* BODY (Scrollable) : flex-1 + overflow-y-auto */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Section Identité */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-blue-50 border-4 border-white shadow-md flex items-center justify-center mb-4 relative shrink-0">
              <Activity size={36} className="text-blue-500" />
              <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm text-[10px] font-black text-blue-600 border border-blue-100">
                DR
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900">{form.nom}</h3>
            <p className="text-sm text-gray-500 mb-4">{form.specialite}</p>

            <div
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-bold text-xs text-white shadow-sm transition-colors ${form.disponible ? "bg-emerald-500" : "bg-red-500"}`}
            >
              {form.disponible ? (
                <CheckCircle size={14} />
              ) : (
                <XCircle size={14} />
              )}
              {form.disponible ? "Disponible" : "Indisponible"}
            </div>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "Patients/mois",
                val: "142",
                icon: Users,
                col: "text-blue-600",
              },
              {
                label: "Note moyenne",
                val: "4.8",
                icon: Star,
                col: "text-amber-500",
              },
              {
                label: "Présence",
                val: "98%",
                icon: CheckCircle,
                col: "text-emerald-500",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-gray-50 p-3 rounded-2xl flex flex-col items-center text-center border border-gray-100"
              >
                <stat.icon size={18} className={`${stat.col} mb-1`} />
                <span className="text-lg font-bold text-gray-900">
                  {stat.val}
                </span>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Section Infos Pro */}
          <section className="space-y-4">
            <h4 className="text-sm font-black text-gray-900 uppercase border-l-4 border-blue-500 pl-3">
              Informations professionnelles
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Nom complet"
                value={form.nom}
                name="nom"
                icon={User}
                isEditing={isEditing} // 👈 AJOUTE CECI
                setForm={setForm} // 👈 AJOUTE CECI
                form={form}
              />
              <Field
                label="Email professionnel"
                value={form.email}
                name="email"
                icon={Mail}
                isEditing={isEditing} // 👈 AJOUTE CECI
                setForm={setForm} // 👈 AJOUTE CECI
                form={form}
              />
              <Field
                label="Téléphone"
                value={form.telephone}
                name="telephone"
                icon={Phone}
                isEditing={isEditing} // 👈 AJOUTE CECI
                setForm={setForm} // 👈 AJOUTE CECI
                form={form}
              />
              <Field
                label="Spécialité"
                value={form.specialite}
                name="specialite"
                icon={Activity}
                isEditing={isEditing} // 👈 AJOUTE CECI
                setForm={setForm} // 👈 AJOUTE CECI
                form={form}
              />
              <Field
                label="Service"
                value={form.service}
                name="service"
                icon={Briefcase}
                isEditing={isEditing} // 👈 AJOUTE CECI
                setForm={setForm} // 👈 AJOUTE CECI
                form={form}
              />
              <Field
                label="Expérience"
                value={form.experience}
                name="experience"
                icon={Clock}
                isEditing={isEditing} // 👈 AJOUTE CECI
                setForm={setForm} // 👈 AJOUTE CECI
                form={form}
              />
              <Field
                label="Diplôme"
                value={form.diplome}
                name="diplome"
                icon={Award}
                isEditing={isEditing} // 👈 AJOUTE CECI
                setForm={setForm} // 👈 AJOUTE CECI
                form={form}
              />
              <Field
                label="Numéro d'ordre"
                value={form.ordre}
                name="ordre"
                icon={Hash}
                isEditing={isEditing} // 👈 AJOUTE CECI
                setForm={setForm} // 👈 AJOUTE CECI
                form={form}
              />
            </div>
          </section>

          {/* Section Consultation & Langues */}
          <section className="space-y-4">
            <h4 className="text-sm font-black text-gray-900 uppercase border-l-4 border-emerald-500 pl-3">
              Consultation & Langues
            </h4>
            <Field
              label="Durée moyenne"
              value={form.consultationDuration}
              name="consultationDuration"
              icon={Clock}
            />

            <div className="flex flex-col gap-3">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Langues parlées
              </label>
              <div className="flex flex-wrap gap-2">
                {form.languages.map((lang, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-bold border border-blue-100"
                  >
                    <Globe size={14} /> {lang}
                    {isEditing && (
                      <button
                        onClick={() =>
                          setForm({
                            ...form,
                            languages: form.languages.filter(
                              (_, i) => i !== idx,
                            ),
                          })
                        }
                        className="hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Switch disponibilité */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-6">
              <div>
                <p className="text-sm font-bold text-gray-900">
                  Ma disponibilité
                </p>
                <p className="text-xs text-gray-500">Apparaître comme actif</p>
              </div>
              <button
                disabled={!isEditing}
                onClick={() =>
                  setForm({ ...form, disponible: !form.disponible })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${!isEditing ? "opacity-50 cursor-not-allowed" : ""} ${form.disponible ? "bg-emerald-500" : "bg-gray-300"}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.disponible ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>
          </section>
        </div>

        {/* FOOTER (Fixe) : shrink-0 pour rester visible en bas */}
        <div className="p-6 border-t border-gray-100 shrink-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          {!isEditing ? (
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-all"
              >
                <Edit2 size={18} /> Modifier mon profil
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all"
              >
                Fermer
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-white border-2 border-red-100 text-red-500 font-bold rounded-2xl hover:bg-red-50 transition-all"
              >
                <Undo size={18} /> Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-[2] flex items-center justify-center gap-2 py-4 bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <Save size={18} /> Enregistrer
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
