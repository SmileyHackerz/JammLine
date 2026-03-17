import React, { useEffect } from "react";
import {
  X,
  User,
  Phone,
  Activity,
  Clock,
  Calendar,
  Users,
  AlertTriangle,
  CheckCircle,
  Bell,
  MessageSquare,
  Printer,
  FileText,
  Play,
  Check,
  ChevronRight,
} from "lucide-react";
import { useApp } from "@monprojet/shared";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: any;
}

export default function AppointmentModal({
  isOpen,
  onClose,
  patient,
}: AppointmentModalProps) {
  const { setTickets, addNotification } = useApp();

  // 1. Bloquer le scroll du fond
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

  if (!isOpen || !patient) return null;

  // ─── Actions Logique ──────────────────────────────────────────────────────

  const handleCallPatient = () => {
    if (
      window.confirm(
        `Voulez-vous appeler ${patient.clientNom} pour consultation?`,
      )
    ) {
      setTickets((prev: any[]) =>
        prev.map((t) =>
          t.id === patient.id ? { ...t, status: "en_consultation" } : t,
        ),
      );
      addNotification(
        `Dr. appelle ${patient.clientNom} pour consultation`,
        "info",
        "consultation",
      );
      onClose();
    }
  };

  const handleFinishConsultation = () => {
    if (window.confirm(`Terminer la consultation de ${patient.clientNom}?`)) {
      setTickets((prev: any[]) =>
        prev.map((t) =>
          t.id === patient.id ? { ...t, status: "termine" } : t,
        ),
      );
      addNotification(
        `Consultation terminée pour ${patient.clientNom}`,
        "success",
        "consultation",
      );
      onClose();
    }
  };

  const handleEmergencyPriority = () => {
    if (window.confirm(`Mettre ${patient.clientNom} en priorité urgente?`)) {
      setTickets((prev: any[]) =>
        prev.map((t) =>
          t.id === patient.id
            ? { ...t, priorite: "urgente", position: 1 }
            : t.status === "en_attente"
              ? { ...t, position: t.position + 1 }
              : t,
        ),
      );
      addNotification(
        `${patient.clientNom} mis en priorité urgente`,
        "error",
        "consultation",
      );
      window.alert("Priorité urgente activée");
    }
  };

  // ─── Composants Internes ──────────────────────────────────────────────────

  const ActionButton = ({
    icon: Icon,
    title,
    onClick,
    colorClass,
    disabled = false,
  }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-all shadow-sm hover:shadow-md active:scale-95 disabled:opacity-30 ${colorClass}`}
    >
      <Icon size={24} />
      <span className="text-[10px] font-bold uppercase tracking-tight text-center">
        {title}
      </span>
    </button>
  );

  return (
    <div className="fixed inset-0 z-[130] flex items-end md:items-center justify-center p-0 md:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-h-[95vh] md:max-w-xl rounded-t-[32px] md:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
          <h2 className="text-xl font-bold text-gray-900">
            Gestion du Patient
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Patient Info Card */}
          <div className="bg-gray-50 rounded-[24px] p-5 border border-gray-100">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <User size={32} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-900">
                    {patient.clientNom}
                  </h3>
                  <span className="text-xs font-black text-gray-300">
                    #{patient.id}
                  </span>
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  {patient.service}
                </p>
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg mt-2 text-[10px] font-bold ${
                    patient.priorite === "urgente"
                      ? "bg-red-100 text-red-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  <AlertTriangle size={12} /> {patient.priorite?.toUpperCase()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-white/60 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Activity size={14} className="text-teal-500" />{" "}
                <span className="font-bold">{patient.motif || "Général"}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Clock size={14} className="text-amber-500" />{" "}
                <span className="font-bold">{patient.temps}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Calendar size={14} className="text-blue-500" />{" "}
                <span className="font-bold">{patient.dateCreation}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Users size={14} className="text-purple-500" />{" "}
                <span className="font-bold">Pos. {patient.position}</span>
              </div>
            </div>
          </div>

          {/* Actions Immédiates */}
          <section>
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
              Actions Prioritaires
            </h4>
            <div className="grid grid-cols-4 gap-3">
              {patient.status === "en_attente" && (
                <ActionButton
                  icon={Play}
                  title="Appeler"
                  onClick={handleCallPatient}
                  colorClass="bg-emerald-500 text-white"
                />
              )}
              {patient.status === "en_consultation" && (
                <ActionButton
                  icon={Check}
                  title="Terminer"
                  onClick={handleFinishConsultation}
                  colorClass="bg-emerald-500 text-white"
                />
              )}
              <ActionButton
                icon={Clock}
                title="Reporter"
                onClick={() => window.alert("Patient reporté de 5 places")}
                colorClass="bg-amber-500 text-white"
              />
              <ActionButton
                icon={AlertTriangle}
                title="Urgence"
                onClick={handleEmergencyPriority}
                colorClass="bg-red-500 text-white"
                disabled={patient.priorite === "urgente"}
              />
              <ActionButton
                icon={MessageSquare}
                title="Message"
                onClick={() => {}}
                colorClass="bg-teal-500 text-white"
              />
            </div>
          </section>

          {/* Actions Secondaires */}
          <section>
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
              Outils Médicaux
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center gap-3 p-4 bg-indigo-50 text-indigo-700 rounded-2xl font-bold text-sm hover:bg-indigo-100 transition-colors">
                <FileText size={20} /> Historique Médical
              </button>
              <button className="flex items-center gap-3 p-4 bg-purple-50 text-purple-700 rounded-2xl font-bold text-sm hover:bg-purple-100 transition-colors">
                <Bell size={20} /> Envoyer Rappel
              </button>
              <button className="flex items-center gap-3 p-4 bg-pink-50 text-pink-700 rounded-2xl font-bold text-sm hover:bg-pink-100 transition-colors col-span-2">
                <Printer size={20} /> Imprimer Ordonnance / Justificatif
              </button>
            </div>
          </section>

          {/* Notes rapides */}
          <section className="pb-6">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
              Notes de consultation
            </h4>
            <textarea
              placeholder="Cliquez ici pour ajouter des notes sur ce patient..."
              className="w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-4 text-sm outline-none focus:border-blue-300 focus:bg-white transition-all min-h-[100px] resize-none"
            />
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-white shrink-0">
          <button
            onClick={onClose}
            className="w-full py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all"
          >
            Fermer la fiche
          </button>
        </div>
      </div>
    </div>
  );
}
