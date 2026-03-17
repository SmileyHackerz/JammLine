import React from "react";
import {
  X,
  User,
  Phone,
  Activity,
  Clock,
  AlertCircle,
  Play,
  Check,
  XCircle,
  Calendar,
} from "lucide-react";
import { useApp } from "@monprojet/shared";

interface TicketDetailModalProps {
  ticketId: string | null;
  onClose: () => void;
}

export default function TicketDetailModal({
  ticketId,
  onClose,
}: TicketDetailModalProps) {
  const { tickets, updateTicketStatus } = useApp();

  // Trouver les données du ticket sélectionné
  const ticketData = tickets.find((t: any) => t.id === ticketId);

  if (!ticketData) return null;

  const handleStatusChange = (newStatus: string) => {
    if (
      window.confirm(`Changer le statut en "${newStatus.replace("_", " ")}" ?`)
    ) {
      updateTicketStatus(ticketData.id, newStatus);
      onClose();
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "en_attente":
        return {
          color: "text-amber-600",
          bg: "bg-amber-100",
          label: "En attente",
          icon: Clock,
        };
      case "en_consultation":
        return {
          color: "text-blue-600",
          bg: "bg-blue-100",
          label: "En consultation",
          icon: Activity,
        };
      case "termine":
        return {
          color: "text-emerald-600",
          bg: "bg-emerald-100",
          label: "Terminé",
          icon: Check,
        };
      case "annule":
        return {
          color: "text-red-600",
          bg: "bg-red-100",
          label: "Annulé",
          icon: XCircle,
        };
      default:
        return {
          color: "text-gray-600",
          bg: "bg-gray-100",
          label: status,
          icon: AlertCircle,
        };
    }
  };

  const config = getStatusConfig(ticketData.status);

  return (
    <div className="fixed inset-0 z-[110] flex items-end md:items-center justify-center p-0 md:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full md:max-w-lg rounded-t-[32px] md:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-teal-500 text-white px-4 py-1.5 rounded-full font-bold text-lg shadow-sm">
              #{ticketData.id}
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Détails du Ticket
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-8">
          {/* Statut Actuel */}
          <div
            className={`flex items-center justify-between p-4 rounded-2xl ${config.bg} ${config.color}`}
          >
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-xs">
              <config.icon size={18} />
              Statut : {config.label}
            </div>
            <span className="text-[10px] font-bold opacity-70">
              MIS À JOUR EN TEMPS RÉEL
            </span>
          </div>

          {/* Informations Patient */}
          <section>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <User size={14} /> Informations Patient
            </h3>
            <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
              <div className="flex justify-between items-center border-b border-gray-200/50 pb-3">
                <span className="text-gray-500 text-sm">Nom complet</span>
                <span className="text-gray-900 font-bold">
                  {ticketData.clientNom}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Téléphone</span>
                <span className="text-gray-900 font-bold flex items-center gap-2">
                  <Phone size={14} className="text-teal-500" />{" "}
                  {ticketData.telephone || "Non renseigné"}
                </span>
              </div>
            </div>
          </section>

          {/* Informations Ticket */}
          <section>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity size={14} /> Suivi Consultation
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 p-3 rounded-xl">
                <p className="text-gray-400 mb-1">Service</p>
                <p className="font-bold text-gray-900">{ticketData.service}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <p className="text-gray-400 mb-1">Priorité</p>
                <p
                  className={`font-bold ${ticketData.priorite === "urgente" ? "text-red-500" : "text-emerald-500"}`}
                >
                  {ticketData.priorite?.toUpperCase()}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <p className="text-gray-400 mb-1">Position</p>
                <p className="font-bold text-gray-900">
                  {ticketData.position}e dans la file
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <p className="text-gray-400 mb-1">Attente estimée</p>
                <p className="font-bold text-gray-900">{ticketData.temps}</p>
              </div>
            </div>

            <div className="mt-3 bg-gray-50 p-3 rounded-xl flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              <p className="text-xs text-gray-500">
                Créé à{" "}
                <span className="font-bold text-gray-700">
                  {ticketData.dateCreation}
                </span>
              </p>
            </div>
          </section>

          {/* Motif */}
          {ticketData.motif && (
            <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                Motif de consultation
              </h3>
              <div className="bg-teal-50/50 border border-teal-100 p-4 rounded-2xl italic text-gray-700 leading-relaxed">
                "{ticketData.motif}"
              </div>
            </section>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 space-y-3 bg-gray-50/50">
          {ticketData.status === "en_attente" && (
            <button
              onClick={() => handleStatusChange("en_consultation")}
              className="w-full flex items-center justify-center gap-2 py-4 bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-all"
            >
              <Play size={20} /> Commencer la consultation
            </button>
          )}

          {ticketData.status === "en_consultation" && (
            <button
              onClick={() => handleStatusChange("termine")}
              className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-all"
            >
              <Check size={20} /> Terminer la consultation
            </button>
          )}

          <button
            onClick={() => handleStatusChange("annule")}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-white border-2 border-red-100 text-red-500 font-bold rounded-2xl hover:bg-red-50 transition-all"
          >
            <XCircle size={18} /> Annuler le ticket
          </button>
        </div>
      </div>
    </div>
  );
}
