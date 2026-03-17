import React, { useState, useEffect } from "react";
import {
  X,
  Activity,
  Clock,
  AlertTriangle,
  ChevronRight,
  ArrowLeft,
  Check,
  AlertCircle,
  ClipboardList,
  Stethoscope,
  Receipt,
  Phone,
  User,
  Loader2,
  Ticket,
  PlusCircle,
} from "lucide-react";
import { useApp, useAuth } from "@monprojet/shared";

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTicketModal({
  isOpen,
  onClose,
}: CreateTicketModalProps) {
  const { services, createTicket, addNotification } = useApp();
  const { userName, currentUser } = useAuth();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const [ticketData, setTicketData] = useState({
    service: "",
    serviceId: null as number | null,
    typeConsult: "Première consultation",
    motif: "",
    phone: currentUser?.profile?.telephone || "",
    priorite: "normale",
    symptomes: "",
    antecedents: "",
  });

  // Bloquer le scroll du fond
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const validateStep = (currentStep: number) => {
    const newErrors: any = {};
    if (currentStep === 1) {
      if (!ticketData.serviceId) newErrors.service = "Service requis";
      if (!ticketData.motif.trim()) newErrors.motif = "Motif requis";
      if (!ticketData.phone.trim()) newErrors.phone = "Téléphone requis";
    }
    if (currentStep === 2) {
      if (!ticketData.symptomes.trim())
        newErrors.symptomes = "Symptômes requis";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const newTicket = createTicket(
        { serviceId: ticketData.serviceId },
        {
          name: userName || "Patient",
          phone: ticketData.phone,
          motif: ticketData.motif,
        },
      );
      addNotification(`Ticket ${newTicket.id} créé`, "success", "ticket");
      window.alert(`Ticket #${newTicket.id} créé avec succès !`);
      handleClose();
    } catch (error) {
      window.alert("Erreur lors de la création");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setTicketData({
      service: "",
      serviceId: null,
      typeConsult: "Première consultation",
      motif: "",
      phone: currentUser?.profile?.telephone || "",
      priorite: "normale",
      symptomes: "",
      antecedents: "",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-end md:items-center justify-center p-0 md:p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
        onClick={handleClose}
      />

      <div className="relative bg-white w-full max-h-[95vh] md:max-w-xl rounded-t-[32px] md:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
        {/* ── HEADER IDENTIQUE À LA PAGE (Dégradé Teal) ── */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 pt-10 pb-8 px-6 text-white shrink-0 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <X size={20} />
          </button>

          <h2 className="text-2xl font-bold mb-1">Nouveau Ticket</h2>
          <p className="opacity-80 text-xs mb-6 font-medium">
            Rejoignez la file d'attente
          </p>

          {/* Indicateur d'étapes miroir */}
          <div className="flex items-center gap-3">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] border-2 transition-all ${
                      step >= s
                        ? "bg-white text-teal-600 border-white"
                        : "bg-transparent text-white/50 border-white/30"
                    }`}
                  >
                    {step > s ? <Check size={14} /> : s}
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${step >= s ? "text-white" : "text-white/40"}`}
                  >
                    {s === 1 ? "Service" : s === 2 ? "Médical" : "Récap"}
                  </span>
                </div>
                {s < 3 && (
                  <div
                    className={`w-6 h-[1px] ${step > s ? "bg-white" : "bg-white/30"}`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ── CORPS SCROLLABLE ── */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* ÉTAPE 1 : SERVICE & TÉLÉPHONE */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
              <h3 className="text-lg font-bold text-gray-800">
                Choisissez un service
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {services.map((s: any) => (
                  <button
                    key={s.id}
                    onClick={() =>
                      setTicketData({
                        ...ticketData,
                        serviceId: s.id,
                        service: s.name,
                      })
                    }
                    className={`p-4 rounded-2xl border-2 transition-all text-left ${
                      ticketData.serviceId === s.id
                        ? "bg-teal-50 border-teal-500 shadow-md shadow-teal-500/10"
                        : "bg-gray-50 border-transparent hover:border-gray-200"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${ticketData.serviceId === s.id ? "bg-white shadow-sm" : "bg-white/50"}`}
                    >
                      <Activity size={20} color={s.color} />
                    </div>
                    <p
                      className={`font-bold text-xs leading-tight ${ticketData.serviceId === s.id ? "text-teal-900" : "text-gray-600"}`}
                    >
                      {s.name}
                    </p>
                    <p className="text-[9px] text-gray-400 mt-1 font-bold uppercase">
                      Attente: {s.attente}
                    </p>
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                    Téléphone *
                  </label>
                  <div
                    className={`flex items-center bg-gray-50 border-2 rounded-xl px-4 py-3 transition-all ${errors.phone ? "border-red-200" : "border-transparent focus-within:border-teal-500"}`}
                  >
                    <Phone size={18} className="text-gray-400 mr-3" />
                    <input
                      type="tel"
                      placeholder="+221 77..."
                      className="bg-transparent w-full outline-none text-sm font-semibold"
                      value={ticketData.phone}
                      onChange={(e) =>
                        setTicketData({ ...ticketData, phone: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                    Motif de visite *
                  </label>
                  <textarea
                    className={`w-full bg-gray-50 border-2 rounded-xl p-3 text-sm outline-none transition-all ${errors.motif ? "border-red-200" : "border-transparent focus:border-teal-500"}`}
                    placeholder="Ex: Douleurs abdominales..."
                    rows={2}
                    value={ticketData.motif}
                    onChange={(e) =>
                      setTicketData({ ...ticketData, motif: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* ÉTAPE 2 : MÉDICAL */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
              <h3 className="text-lg font-bold text-gray-800">
                Détails de vos symptômes
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                    Symptômes *
                  </label>
                  <textarea
                    className="w-full bg-gray-50 border-2 border-transparent rounded-xl p-3 text-sm outline-none focus:border-teal-500 min-h-[120px]"
                    placeholder="Quels sont vos symptômes ?"
                    value={ticketData.symptomes}
                    onChange={(e) =>
                      setTicketData({
                        ...ticketData,
                        symptomes: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                    Antécédents
                  </label>
                  <input
                    className="w-full bg-gray-50 border-2 border-transparent rounded-xl p-3 text-sm outline-none focus:border-teal-500"
                    placeholder="Maladies connues ?"
                    value={ticketData.antecedents}
                    onChange={(e) =>
                      setTicketData({
                        ...ticketData,
                        antecedents: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 : RÉCAP */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
              <h3 className="text-lg font-bold text-gray-800">
                Récapitulatif final
              </h3>
              <div className="bg-teal-50 border border-teal-100 rounded-[24px] p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-teal-600/70 text-xs font-bold uppercase">
                    Service
                  </span>
                  <span className="font-black text-teal-900">
                    {ticketData.service}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-teal-600/70 text-xs font-bold uppercase">
                    Contact
                  </span>
                  <span className="font-black text-teal-900">
                    {ticketData.phone}
                  </span>
                </div>
                <div className="border-t border-teal-100 pt-4">
                  <p className="text-[10px] text-teal-500 font-black uppercase mb-1">
                    Motif déclaré
                  </p>
                  <p className="text-sm text-teal-900 font-medium italic">
                    "{ticketData.motif}"
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <AlertCircle className="text-amber-500 shrink-0" size={18} />
                <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
                  En confirmant, vous rejoindrez officiellement la file
                  d'attente en temps réel du service sélectionné.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── FOOTER FIXE ── */}
        <div className="p-6 border-t border-gray-100 bg-white flex gap-3 shrink-0">
          <button
            onClick={() => (step === 1 ? handleClose() : setStep(step - 1))}
            className="w-14 h-14 flex items-center justify-center bg-gray-50 border-2 border-gray-100 text-gray-400 rounded-2xl hover:bg-gray-100 transition-all"
          >
            <ArrowLeft size={20} />
          </button>

          <button
            onClick={() =>
              step < 3
                ? validateStep(step) && setStep(step + 1)
                : handleSubmit()
            }
            disabled={isLoading}
            className="flex-1 flex justify-center items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-teal-500/30 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                {step === 3 ? "Confirmer le ticket" : "Continuer"}
                {step === 3 ? <Check size={20} /> : <ChevronRight size={20} />}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
