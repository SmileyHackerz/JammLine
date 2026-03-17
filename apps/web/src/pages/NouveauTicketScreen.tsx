import React, { useState } from "react";
import { useAuth, useApp } from "@monprojet/shared";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  Users,
  ArrowRight,
  ArrowLeft,
  Ticket,
  User,
  Phone,
  FileText,
  Activity,
  XCircle,
  Receipt,
  Home,
  PlusCircle,
  Check,
  Loader2,
} from "lucide-react";

export default function NouveauTicketScreen() {
  const { services, createTicket } = useApp();
  const { userName } = useAuth();
  const navigate = useNavigate();

  const [selectedService, setSelectedService] = useState<any>(null);
  const [step, setStep] = useState(1); // 1 = service, 2 = infos, 3 = confirmation
  const [patientInfo, setPatientInfo] = useState({
    name: userName || "",
    phone: "",
    motif: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<any>(null);
  const { userType } = useAuth();
  // ─── Soumettre le ticket ──────────────────────────────────────────────────────
  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) {
      window.alert("Veuillez sélectionner un service.");
      return;
    }
    if (!patientInfo.name.trim()) {
      window.alert("Veuillez entrer votre nom.");
      return;
    }

    setIsLoading(true);
    try {
      // Simuler un délai réseau
      await new Promise((resolve) => setTimeout(resolve, 800));

      const ticket = createTicket(
        { serviceId: selectedService.id },
        {
          name: patientInfo.name.trim(),
          phone: patientInfo.phone.trim(),
          motif: patientInfo.motif.trim() || "Consultation générale",
        },
      );

      setCreatedTicket(ticket);
      setStep(3);
    } catch (error) {
      window.alert("Impossible de créer le ticket. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedService(null);
    setPatientInfo({ name: userName || "", phone: "", motif: "" });
    setCreatedTicket(null);
    setStep(1);
  };

  if (userType !== "patient") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <XCircle size={40} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Accès réservé</h2>
        <p className="text-gray-500 mt-2">
          En tant que {userType}, vous ne pouvez pas prendre de ticket de
          consultation.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 text-teal-600 font-bold hover:underline"
        >
          Retour au tableau de bord
        </button>
      </div>
    );
  }

  // ══════════════════════════════════════════════════
  // ÉTAPE 3 : Confirmation
  // ══════════════════════════════════════════════════
  if (step === 3 && createdTicket) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans pb-12 md:flex md:items-center md:justify-center">
        <div className="w-full max-w-lg mx-auto bg-gray-50 md:bg-white md:shadow-2xl md:rounded-3xl overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 pt-16 pb-12 px-6 flex flex-col items-center text-center">
            <CheckCircle size={64} color="#fff" className="mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">
              Ticket créé !
            </h1>
            <p className="text-white/85 text-sm">
              Votre ticket a bien été enregistré
            </p>
          </div>

          <div className="px-5 py-6 md:px-8 -mt-6">
            {/* Numéro de ticket */}
            <div className="bg-white rounded-2xl p-6 flex flex-col items-center mb-6 shadow-lg shadow-teal-500/10 border border-teal-50 relative z-10">
              <span className="text-xs text-gray-400 font-bold tracking-widest uppercase mb-2">
                Numéro de ticket
              </span>
              <span className="text-5xl font-bold text-teal-500 mb-4">
                {createdTicket.id}
              </span>
              <div className="flex items-center gap-2 bg-amber-50 text-amber-500 border border-amber-200 px-4 py-2 rounded-full font-bold text-sm">
                <Clock size={16} /> En attente
              </div>
            </div>

            {/* Détails */}
            <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">
                Détails de votre demande
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-gray-50">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                    <Activity size={18} className="text-teal-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Service</p>
                    <p className="text-sm font-bold text-gray-900">
                      {createdTicket.service}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 pb-4 border-b border-gray-50">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <User size={18} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Patient</p>
                    <p className="text-sm font-bold text-gray-900">
                      {createdTicket.clientNom}
                    </p>
                  </div>
                </div>
                {createdTicket.telephone && (
                  <div className="flex items-center gap-4 pb-4 border-b border-gray-50">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                      <Phone size={18} className="text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">
                        Téléphone
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {createdTicket.telephone}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-4 pb-4 border-b border-gray-50">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                    <Users size={18} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">
                      Position dans la file
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {createdTicket.position === 1
                        ? "Vous êtes le prochain !"
                        : `${createdTicket.position}e position`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 pb-4 border-b border-gray-50">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                    <FileText size={18} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Motif</p>
                    <p className="text-sm font-bold text-gray-900">
                      {createdTicket.motif}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Boutons */}
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full flex justify-center items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 rounded-xl mb-3 transition shadow-lg shadow-teal-500/30"
            >
              <Home size={18} /> Suivre mon ticket
            </button>
            <button
              onClick={handleReset}
              className="w-full flex justify-center items-center gap-2 bg-white border-2 border-teal-500 text-teal-600 hover:bg-teal-50 font-bold py-3.5 rounded-xl transition"
            >
              <PlusCircle size={18} /> Prendre un autre ticket
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════
  // ÉTAPE 1 ET 2 : Sélection et Formulaire
  // ══════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-12 md:py-10">
      <div className="max-w-xl mx-auto md:bg-white md:rounded-[30px] md:shadow-xl md:overflow-hidden">
        {/* ── Header (Dégradé Vert d'eau) ── */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 pt-12 pb-8 px-6 md:pt-10 md:pb-8 shadow-sm">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
            Nouveau Ticket
          </h1>
          <p className="text-white/80 text-sm mb-6">
            Rejoignez la file d'attente en quelques secondes
          </p>

          {/* Indicateur d'étapes */}
          <div className="flex items-center">
            {[1, 2].map((s) => (
              <React.Fragment key={s}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${step >= s ? "bg-white text-teal-600" : "bg-white/30 text-white"}`}
                  >
                    {step > s ? (
                      <Check size={14} className="text-teal-600" />
                    ) : (
                      s
                    )}
                  </div>
                  <span
                    className={`text-xs font-bold ${step >= s ? "text-white" : "text-white/60"}`}
                  >
                    {s === 1 ? "Service" : "Informations"}
                  </span>
                </div>
                {s < 2 && (
                  <div
                    className={`w-8 h-[2px] mx-3 rounded-full ${step > s ? "bg-white" : "bg-white/30"}`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="p-5 md:p-8">
          {/* ════ ÉTAPE 1 : Service ════ */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Choisissez un service
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Sélectionnez le service médical pour votre consultation
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {services.map((service: any) => {
                  const isSelected = selectedService?.id === service.id;
                  const isDisabled = !service.disponible;

                  return (
                    <button
                      key={service.id}
                      onClick={() => !isDisabled && setSelectedService(service)}
                      disabled={isDisabled}
                      className={`relative text-left p-4 rounded-2xl border-2 transition-all ${
                        isDisabled
                          ? "bg-gray-50 border-transparent opacity-70 cursor-not-allowed"
                          : isSelected
                            ? "bg-teal-50/50 border-teal-500 shadow-md shadow-teal-500/10"
                            : "bg-white border-transparent hover:border-gray-200 shadow-sm"
                      }`}
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                        style={{
                          backgroundColor: isDisabled
                            ? "#F3F4F6"
                            : service.color + "20",
                        }}
                      >
                        <Activity
                          size={24}
                          color={isDisabled ? "#D1D5DB" : service.color}
                        />
                      </div>

                      <h3
                        className={`font-bold text-sm mb-1 leading-tight ${isDisabled ? "text-gray-400" : "text-gray-900"}`}
                      >
                        {service.name}
                      </h3>
                      <p className="text-[10px] text-gray-400 mb-3 line-clamp-2 leading-snug">
                        {service.description}
                      </p>

                      {isDisabled ? (
                        <div className="flex items-center gap-1 text-red-500 font-bold text-[10px]">
                          <XCircle size={12} /> Indisponible
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                            <Users size={12} /> {service.enAttente} en attente
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                            <Clock size={12} /> ~{service.attente}
                          </div>
                        </div>
                      )}

                      {isSelected && (
                        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center">
                          <Check size={14} color="#fff" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => selectedService && setStep(2)}
                disabled={!selectedService}
                className={`w-full flex justify-center items-center gap-2 py-4 rounded-xl font-bold transition-all ${
                  selectedService
                    ? "bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/30"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {selectedService
                  ? `Continuer avec ${selectedService.name}`
                  : "Sélectionnez un service"}
                {selectedService && <ArrowRight size={18} />}
              </button>
            </div>
          )}

          {/* ════ ÉTAPE 2 : Informations ════ */}
          {step === 2 && (
            <form
              onSubmit={handleSubmitTicket}
              className="animate-in fade-in slide-in-from-right-4 duration-300"
            >
              {/* Rappel du service */}
              {selectedService && (
                <div
                  className="flex items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 border-l-4 mb-6"
                  style={{ borderLeftColor: selectedService.color }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: selectedService.color + "20" }}
                  >
                    <Activity size={20} color={selectedService.color} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                      Service sélectionné
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {selectedService.name}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm font-bold px-2 py-1"
                    style={{ color: selectedService.color }}
                  >
                    Modifier
                  </button>
                </div>
              )}

              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Vos informations
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Ces informations vous identifieront dans la file d'attente
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Nom complet <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all">
                    <User size={18} className="text-gray-400 mr-3" />
                    <input
                      type="text"
                      className="bg-transparent w-full outline-none text-sm text-gray-900"
                      placeholder="Votre nom complet"
                      value={patientInfo.name}
                      onChange={(e) =>
                        setPatientInfo({ ...patientInfo, name: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Numéro de téléphone{" "}
                    <span className="text-gray-400 font-normal">
                      (optionnel)
                    </span>
                  </label>
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all">
                    <Phone size={18} className="text-gray-400 mr-3" />
                    <input
                      type="tel"
                      className="bg-transparent w-full outline-none text-sm text-gray-900"
                      placeholder="+221 77 000 00 00"
                      value={patientInfo.phone}
                      onChange={(e) =>
                        setPatientInfo({
                          ...patientInfo,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Motif de consultation{" "}
                    <span className="text-gray-400 font-normal">
                      (optionnel)
                    </span>
                  </label>
                  <div className="flex bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all">
                    <textarea
                      className="bg-transparent w-full outline-none text-sm text-gray-900 min-h-[80px] resize-none"
                      placeholder="Décrivez brièvement votre motif..."
                      value={patientInfo.motif}
                      onChange={(e) =>
                        setPatientInfo({
                          ...patientInfo,
                          motif: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Récapitulatif */}
              {selectedService && patientInfo.name.trim() && (
                <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <Receipt size={16} className="text-teal-600" />
                    <h4 className="font-bold text-teal-700 text-sm">
                      Récapitulatif
                    </h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b border-teal-100/50 pb-2">
                      <span className="text-teal-600/70">Service</span>
                      <span className="font-bold text-teal-900">
                        {selectedService.name}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-teal-100/50 pb-2">
                      <span className="text-teal-600/70">Patient</span>
                      <span className="font-bold text-teal-900">
                        {patientInfo.name}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-teal-100/50 pb-2">
                      <span className="text-teal-600/70">Temps estimé</span>
                      <span className="font-bold text-teal-900">
                        ~{selectedService.attente}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-teal-600/70">En attente</span>
                      <span className="font-bold text-teal-900">
                        {selectedService.enAttente} personnes
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Boutons Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center justify-center px-5 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition"
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  type="submit"
                  disabled={!patientInfo.name.trim() || isLoading}
                  className="flex-1 flex justify-center items-center gap-2 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 disabled:shadow-none text-white font-bold py-4 rounded-xl transition shadow-lg shadow-teal-500/30"
                >
                  {isLoading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      <Ticket size={20} /> Créer mon ticket
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
