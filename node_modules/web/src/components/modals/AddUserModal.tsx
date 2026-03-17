import React, { useState } from "react";
import { X, User, Mail, Shield, Activity, Check } from "lucide-react";
import { useApp } from "@monprojet/shared";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
  const { services, addUser } = useApp();

  const [form, setForm] = useState({
    nom: "",
    email: "",
    role: "Infirmière",
    service: "Consultation Générale",
  });

  const handleInputChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nom || !form.email || !form.role) {
      window.alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    addUser(form);
    onClose();
    setForm({
      nom: "",
      email: "",
      role: "Infirmière",
      service: "Consultation Générale",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
      {/* Backdrop (Fond sombre) */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full md:max-w-lg rounded-t-[32px] md:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
        {/* Header */}
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

        {/* Form Content */}
        <form
          onSubmit={handleSubmit}
          className="p-6 max-h-[70vh] overflow-y-auto"
        >
          {/* Nom */}
          <div className="mb-5">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Nom complet *
            </label>
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-teal-500 transition-colors">
              <User size={18} className="text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Ex: Dr. Marie Diop"
                className="bg-transparent w-full outline-none text-sm"
                value={form.nom}
                onChange={(e) => handleInputChange("nom", e.target.value)}
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Email *
            </label>
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-teal-500 transition-colors">
              <Mail size={18} className="text-gray-400 mr-3" />
              <input
                type="email"
                placeholder="email@exemple.com"
                className="bg-transparent w-full outline-none text-sm"
                value={form.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
          </div>

          {/* Rôle */}
          <div className="mb-5">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Rôle *
            </label>
            <div className="flex flex-wrap gap-2">
              {["Médecin", "Infirmière", "Secrétaire", "Admin"].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleInputChange("role", role)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
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
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Service
            </label>
            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
              {services.map((service: any) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => handleInputChange("service", service.name)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                    form.service === service.name
                      ? "bg-teal-500 border-teal-500 text-white shadow-md"
                      : "bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200"
                  }`}
                >
                  {service.name}
                </button>
              ))}
            </div>
          </div>

          {/* Actions Footer */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 px-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 py-4 px-4 bg-teal-500 text-white font-bold rounded-2xl shadow-lg shadow-teal-500/30 hover:bg-teal-600 transition-all flex items-center justify-center gap-2"
            >
              <Check size={20} /> Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
