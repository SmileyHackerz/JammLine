import React, { useState } from "react";
import {
  X,
  User,
  Mail,
  Shield,
  Activity,
  Check,
  Phone,
  Loader2,
} from "lucide-react"; // Ajout de Phone et Loader2
import { useApp } from "@monprojet/shared";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
  const { services } = useApp();

  // 1. FIX : Ajout de l'état de chargement
  const [isLoading, setIsLoading] = useState(false);

  // 2. FIX : Ajout de 'telephone' dans l'objet form
  const [form, setForm] = useState({
    nom: "",
    email: "",
    role: "Médecin",
    service: "Consultation Générale",
    telephone: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nom || !form.email || !form.role) {
      window.alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsLoading(true);

    try {
      // Appel de l'API Vercel que nous avons créée
      const response = await fetch("/api/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: "Password123!", // Mot de passe par défaut
          nom: form.nom,
          role: form.role.toLowerCase(), // 'medecin', 'patient', etc.
          service: form.service,
          telephone: form.telephone,
        }),
      });

      const result = await response.json();

      if (!response.ok)
        throw new Error(result.error || "Erreur lors de la création");

      window.alert(`L'utilisateur ${form.nom} a été créé avec succès !`);

      // Réinitialisation
      setForm({
        nom: "",
        email: "",
        role: "Médecin",
        service: "Consultation Générale",
        telephone: "",
      });
      onClose();

      // Rafraîchir pour voir le nouvel utilisateur
      window.location.reload();
    } catch (error: any) {
      window.alert("Erreur : " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative bg-white w-full md:max-w-lg rounded-t-[32px] md:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            Ajouter un utilisateur
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 max-h-[70vh] overflow-y-auto"
        >
          <div className="space-y-4">
            {/* Nom */}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Nom complet *
              </label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-teal-500 transition-colors">
                <User size={18} className="text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Dr. Marie Diop"
                  className="bg-transparent w-full outline-none text-sm font-bold"
                  value={form.nom}
                  onChange={(e) => handleInputChange("nom", e.target.value)}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Email *
              </label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-teal-500 transition-colors">
                <Mail size={18} className="text-gray-400 mr-3" />
                <input
                  type="email"
                  placeholder="email@jammline.com"
                  className="bg-transparent w-full outline-none text-sm font-bold"
                  value={form.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
            </div>

            {/* Téléphone (AJOUTÉ) */}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Téléphone
              </label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-teal-500 transition-colors">
                <Phone size={18} className="text-gray-400 mr-3" />
                <input
                  type="tel"
                  placeholder="+221 77..."
                  className="bg-transparent w-full outline-none text-sm font-bold"
                  value={form.telephone}
                  onChange={(e) =>
                    handleInputChange("telephone", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Rôle */}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Rôle *
              </label>
              <div className="flex flex-wrap gap-2">
                {["Médecin", "Infirmière", "Admin", "Patient"].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleInputChange("role", role)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                      form.role === role
                        ? "bg-teal-500 border-teal-500 text-white shadow-md"
                        : "bg-gray-50 border-gray-100 text-gray-500 hover:border-gray-200"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Service */}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Service
              </label>
              <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
                {services.map((service: any) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => handleInputChange("service", service.name)}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                      form.service === service.name
                        ? "bg-teal-500 border-teal-500 text-white shadow-md"
                        : "bg-gray-50 border-gray-100 text-gray-400"
                    }`}
                  >
                    {service.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 px-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-4 px-4 bg-teal-500 text-white font-bold rounded-2xl shadow-lg shadow-teal-500/30 hover:bg-teal-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <Check size={20} /> Créer le compte
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
