import React, { useState } from "react";
import { useAuth, useApp } from "@monprojet/shared";
import TicketDetailModal from "../components/modals/TicketDetailModal";
import MedecinProfileModal from "../components/modals/MedecinProfileModal";
import AppointmentModal from "../components/modals/AppointmentModal";
import { Settings } from "lucide-react";
import SettingsModal from "../components/modals/SettingsModal";
import NotificationsModal from "../components/modals/NotificationsModal";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Activity,
  Users,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Phone,
  FileText,
  Play,
  Check,
  X,
} from "lucide-react";

export default function MedecinDashboard() {
  const { userName } = useAuth();
  const navigate = useNavigate();
  const { tickets, updateTicketStatus, services, notifications } = useApp();
  const [selectedTab, setSelectedTab] = useState("en_attente");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // ─── Filtrage des tickets ─────────────────────────────────────────
  const waitingTickets = tickets.filter((t: any) => t.status === "en_attente");
  const consultingTickets = tickets.filter(
    (t: any) => t.status === "en_consultation",
  );
  const completedTickets = tickets.filter((t: any) => t.status === "termine");

  const getCurrentTickets = () => {
    switch (selectedTab) {
      case "en_attente":
        return waitingTickets;
      case "en_consultation":
        return consultingTickets;
      case "termine":
        return completedTickets;
      default:
        return waitingTickets;
    }
  };

  const TABS = [
    {
      key: "en_attente",
      label: "En attente",
      count: waitingTickets.length,
      color: "#F59E0B",
    },
    {
      key: "en_consultation",
      label: "En cours",
      count: consultingTickets.length,
      color: "#3B82F6",
    },
    {
      key: "termine",
      label: "Terminés",
      count: completedTickets.length,
      color: "#10B981",
    },
  ];

  // ─── Actions sur les tickets (Version Web) ──────────────────────────────────────────────────
  const handleStartConsultation = (ticket: any) => {
    if (window.confirm(`Commencer la consultation de ${ticket.clientNom} ?`)) {
      updateTicketStatus(ticket.id, "en_consultation");
    }
  };

  const handleCompleteConsultation = (ticket: any) => {
    if (
      window.confirm(
        `Marquer la consultation de ${ticket.clientNom} comme terminée ?`,
      )
    ) {
      updateTicketStatus(ticket.id, "termine");
    }
  };

  const handleCancelTicket = (ticket: any) => {
    if (
      window.confirm(
        `Annuler le ticket de ${ticket.clientNom} ? Cette action est irréversible.`,
      )
    ) {
      updateTicketStatus(ticket.id, "annule");
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const getServiceColor = (serviceId: number) => {
    const service = services.find((s: any) => s.id === serviceId);
    return service?.color || "#6B7280";
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-12">
      {/* ── Header (Dégradé Bleu) ── */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 pt-12 pb-8 px-5 rounded-b-[30px] shadow-md md:max-w-5xl md:mx-auto">
        <div className="max-w-4xl mx-auto flex justify-between items-center mb-6">
          {/* GAUCHE : PROFIL MEDECIN */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setIsProfileModalOpen(true)}
          >
            <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center backdrop-blur-md">
              <Activity size={24} color="#fff" />
            </div>
            <div>
              <p className="text-white/70 text-[10px] font-black uppercase tracking-widest leading-none mb-1">
                Espace Médical
              </p>
              <h1 className="text-xl font-bold text-white leading-none group-hover:underline">
                Dr. {userName} 👨‍⚕️
              </h1>
            </div>
          </div>

          {/* DROITE : ACTIONS UNIFORMES */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all active:scale-90"
            >
              <Bell size={20} color="#fff" />
              {notifications.filter((n: any) => !n.read).length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-blue-600 animate-pulse">
                  {notifications.filter((n: any) => !n.read).length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all"
            >
              <Settings size={20} color="#fff" />
            </button>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="flex bg-white/15 rounded-2xl py-4 px-4 justify-around items-center backdrop-blur-sm border border-white/20 max-w-4xl mx-auto">
          <div className="text-center flex-1">
            <p className="text-white text-3xl font-bold">
              {waitingTickets.length}
            </p>
            <p className="text-white/80 text-xs font-medium mt-1">En attente</p>
          </div>
          <div className="w-px h-10 bg-white/30"></div>
          <div className="text-center flex-1">
            <p className="text-white text-3xl font-bold">
              {consultingTickets.length}
            </p>
            <p className="text-white/80 text-xs font-medium mt-1">En cours</p>
          </div>
          <div className="w-px h-10 bg-white/30"></div>
          <div className="text-center flex-1">
            <p className="text-white text-3xl font-bold">
              {completedTickets.length}
            </p>
            <p className="text-white/80 text-xs font-medium mt-1">Terminés</p>
          </div>
        </div>
      </div>

      {/* ── Onglets ── */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 p-2 gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {TABS.map((tab) => {
            const isActive = selectedTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition border ${
                  isActive
                    ? "text-white shadow-sm"
                    : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                }`}
                style={
                  isActive
                    ? { backgroundColor: tab.color, borderColor: tab.color }
                    : {}
                }
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? "bg-white/30 text-white" : "text-white"}`}
                    style={!isActive ? { backgroundColor: tab.color } : {}}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Contenu ── */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        {/* Bouton de rafraîchissement (Web) */}
        <div className="flex justify-center md:hidden mb-6">
          <button
            onClick={handleRefresh}
            className={`text-blue-500 text-sm font-bold flex items-center gap-2 ${isRefreshing ? "opacity-50" : ""}`}
          >
            <Clock size={16} className={isRefreshing ? "animate-spin" : ""} />
            {isRefreshing ? "Actualisation..." : "Actualiser la liste"}
          </button>
        </div>

        {/* Liste des tickets */}
        <div className="space-y-4">
          {getCurrentTickets().length === 0 ? (
            /* État vide */
            <div className="bg-white rounded-[20px] p-12 flex flex-col items-center shadow-sm text-center animate-in fade-in zoom-in-95">
              <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                <Users size={48} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {selectedTab === "en_attente"
                  ? "Aucun patient en attente"
                  : selectedTab === "en_consultation"
                    ? "Aucune consultation en cours"
                    : "Aucune consultation terminée"}
              </h3>
              <p className="text-sm text-gray-500">
                La file d'attente est vide pour le moment.
              </p>
            </div>
          ) : (
            /* Cartes de tickets */
            getCurrentTickets().map((item: any) => {
              const serviceColor = getServiceColor(item.serviceId);

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedTicketId(item.id)}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4"
                >
                  {/* En-tête de la carte */}
                  <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-3 py-1.5 rounded-lg text-sm font-bold"
                        style={{
                          backgroundColor: serviceColor + "20",
                          color: serviceColor,
                        }}
                      >
                        {item.id}
                      </span>
                      {item.priorite === "urgente" && (
                        <div className="flex items-center gap-1 bg-red-500 px-2 py-1 rounded-md">
                          <AlertTriangle size={12} color="#fff" />
                          <span className="text-[10px] font-bold text-white tracking-wider">
                            URGENT
                          </span>
                        </div>
                      )}
                    </div>

                    <div
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold ${
                        item.status === "en_attente"
                          ? "bg-amber-100 text-amber-700"
                          : item.status === "en_consultation"
                            ? "bg-blue-100 text-blue-700"
                            : item.status === "termine"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status === "en_attente"
                        ? "En attente"
                        : item.status === "en_consultation"
                          ? "En consultation"
                          : item.status === "termine"
                            ? "Terminé"
                            : "Annulé"}
                    </div>
                  </div>

                  {/* Infos Patient */}
                  <div className="flex items-center gap-4 mb-5">
                    <div
                      className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-sm cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation(); // Pour ne pas ouvrir la TicketDetailModal
                        setSelectedPatient(item); // Ouvre l'AppointmentModal
                      }}
                    >
                      <User size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">
                        {item.clientNom}
                      </h3>
                      <p className="text-sm text-gray-500">{item.service}</p>
                    </div>
                  </div>

                  {/* Détails du ticket (Grille sur PC, Liste sur Mobile) */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-5 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={16} className="text-gray-400" />{" "}
                      {item.telephone || "—"}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={16} className="text-gray-400" /> Arrivée:{" "}
                      {item.dateCreation} · {item.temps}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users size={16} className="text-gray-400" /> Position :{" "}
                      <span className="font-bold text-gray-900">
                        {item.position}
                      </span>
                    </div>
                    {item.motif && (
                      <div className="flex items-start gap-2 text-gray-600 md:col-span-2">
                        <FileText
                          size={16}
                          className="text-gray-400 mt-0.5 shrink-0"
                        />
                        <span className="line-clamp-2">{item.motif}</span>
                      </div>
                    )}
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex justify-end gap-3 border-t border-gray-100 pt-4 mt-2">
                    {item.status === "en_attente" && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // 👈 EMPECHE D'OUVRIR LA MODALE
                            handleCancelTicket(item);
                          }}
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-red-500 text-red-500 font-bold hover:bg-red-50 transition text-sm"
                        >
                          <X size={16} /> Annuler
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // 👈 EMPECHE D'OUVRIR LA MODALE
                            handleStartConsultation(item);
                          }}
                          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition shadow-md shadow-blue-500/20 text-sm"
                        >
                          <Play size={16} /> Commencer
                        </button>
                      </>
                    )}

                    {item.status === "en_consultation" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // 👈 EMPECHE D'OUVRIR LA MODALE
                          handleCompleteConsultation(item);
                        }}
                        className="w-full md:w-auto flex justify-center items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition shadow-md shadow-emerald-500/20"
                      >
                        <CheckCircle size={18} /> Terminer la consultation
                      </button>
                    )}

                    {item.status === "termine" && (
                      <div className="w-full flex justify-center items-center gap-2 text-emerald-500 font-bold py-2">
                        <CheckCircle size={18} /> Consultation terminée
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <TicketDetailModal
        ticketId={selectedTicketId}
        onClose={() => setSelectedTicketId(null)}
      />
      <MedecinProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
      <AppointmentModal
        isOpen={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
        patient={selectedPatient}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
}
