import React, { useState } from "react";
import { useAuth, useApp } from "@monprojet/shared";
import CreateTicketModal from "../components/modals/CreateTicketModal";
import PatientProfileModal from "../components/modals/PatientProfileModal";
import { Settings } from "lucide-react";
import SettingsModal from "../components/modals/SettingsModal";
import NotificationsModal from "../components/modals/NotificationsModal";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  LogOut,
  Ticket,
  Clock,
  Activity,
  CheckCircle,
  XCircle,
  Users,
  HeartPulse,
  PlusCircle,
} from "lucide-react";

export default function PatientDashboard() {
  const { userName } = useAuth();
  const { logout } = useAuth();
  const { services, tickets, statistics, notifications } = useApp();
  const navigate = useNavigate();
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Simulation de rafraîchissement Web
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ─── Logique de données ──────────────────────────────────────────────────
  const currentTicket = tickets.find(
    (t: any) =>
      t.clientNom === userName &&
      (t.status === "en_attente" || t.status === "en_consultation"),
  );

  const ticketHistory = tickets.filter(
    (t: any) => t.clientNom === userName && t.status === "termine",
  );

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  // ─── Helpers ─────────────────────────────────────────────────────────────
  const getStatusColor = (status: string) => {
    switch (status) {
      case "en_attente":
        return "#F59E0B";
      case "en_consultation":
        return "#3B82F6";
      case "termine":
        return "#10B981";
      default:
        return "#9CA3AF";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "en_attente":
        return "En attente";
      case "en_consultation":
        return "En consultation";
      case "termine":
        return "Terminé";
      default:
        return "Annulé";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "en_attente":
        return Clock;
      case "en_consultation":
        return Activity;
      case "termine":
        return CheckCircle;
      default:
        return XCircle;
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-12">
      {/* ── En-tête (Dégradé Vert d'eau) ── */}

      <div className="bg-gradient-to-r from-teal-500 to-teal-600 pt-12 pb-8 px-5 rounded-b-[30px] shadow-md md:max-w-4xl md:mx-auto md:mt-0">
        <div className="flex justify-between items-center mb-6">
          {/* Zone Gauche : Profil */}
          <div
            className="cursor-pointer group flex items-center gap-3"
            onClick={() => setIsProfileModalOpen(true)}
          >
            <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center backdrop-blur-md shadow-inner">
              <span className="text-white font-black text-lg">
                {userName?.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">
                Mon Espace
              </p>
              <h1 className="text-xl font-bold text-white leading-none group-hover:underline">
                {userName} 👋
              </h1>
            </div>
          </div>

          {/* Zone Droite : Boutons d'actions uniformes */}
          <div className="flex items-center gap-2">
            {/* Bouton Notifications */}
            <button
              onClick={() => setIsNotificationsOpen(true)} // On va créer cet état
              className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all active:scale-90"
            >
              <Bell size={20} color="#fff" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-teal-600 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Bouton Paramètres */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all active:scale-90"
            >
              <Settings size={20} color="#fff" />
            </button>
            <button
              onClick={async () => {
                await logout();
                navigate("/");
              }}
              className="w-10 h-10 flex items-center justify-center gap-3 p-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl font-bold text-sm transition-all border border-red-100 active:scale-95 shadow-sm group"
            >
              <div className="bg-red-100 p-2 rounded-lg group-hover:bg-red-200 transition-colors">
                <LogOut size={20} />
              </div>
            </button>
          </div>
        </div>

        {/* Mini stats dans le header */}
        <div className="flex bg-white/15 rounded-2xl py-3 px-2 justify-around items-center backdrop-blur-sm border border-white/20">
          <div className="text-center">
            <p className="text-white text-lg font-bold">
              {statistics.enAttente}
            </p>
            <p className="text-white/80 text-[11px] font-medium mt-1">
              En attente
            </p>
          </div>
          <div className="w-px h-8 bg-white/30"></div>
          <div className="text-center">
            <p className="text-white text-lg font-bold">
              {statistics.enConsultation}
            </p>
            <p className="text-white/80 text-[11px] font-medium mt-1">
              En consultation
            </p>
          </div>
          <div className="w-px h-8 bg-white/30"></div>
          <div className="text-center">
            <p className="text-white text-lg font-bold">
              {statistics.tempsMoyenAttente} min
            </p>
            <p className="text-white/80 text-[11px] font-medium mt-1">
              Temps moyen
            </p>
          </div>
        </div>
      </div>

      {/* ── Contenu Principal ── */}
      <div className="px-4 mt-6 max-w-4xl mx-auto space-y-8">
        {/* Bouton de rafraîchissement (Web) */}
        <div className="flex justify-center md:hidden">
          <button
            onClick={handleRefresh}
            className={`text-teal-500 text-sm font-bold flex items-center gap-2 ${isRefreshing ? "opacity-50" : ""}`}
          >
            <Clock size={16} className={isRefreshing ? "animate-spin" : ""} />
            {isRefreshing ? "Actualisation..." : "Tirer pour actualiser"}
          </button>
        </div>

        {/* ── Ticket actif ── */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            Mon ticket actuel
          </h2>

          {currentTicket ? (
            <div className="bg-white rounded-[20px] p-5 shadow-sm border border-teal-50">
              {/* Numéro & Statut */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center bg-teal-500 px-3 py-1.5 rounded-full gap-2">
                  <Ticket size={16} color="#fff" />
                  <span className="text-white font-bold text-sm">
                    {currentTicket.id}
                  </span>
                </div>

                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{
                    backgroundColor:
                      getStatusColor(currentTicket.status) + "20",
                  }}
                >
                  {React.createElement(getStatusIcon(currentTicket.status), {
                    size: 14,
                    color: getStatusColor(currentTicket.status),
                  })}
                  <span
                    className="text-xs font-bold"
                    style={{ color: getStatusColor(currentTicket.status) }}
                  >
                    {getStatusLabel(currentTicket.status)}
                  </span>
                </div>
              </div>

              {/* Service & Motif */}
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {currentTicket.service}
              </h3>
              {currentTicket.motif && (
                <p className="text-sm text-gray-500 mb-4">
                  Motif : {currentTicket.motif}
                </p>
              )}

              {/* Infos file d'attente */}
              {currentTicket.status === "en_attente" && (
                <div className="flex bg-gray-50 rounded-xl p-3.5 mb-4 items-center justify-around">
                  <div className="flex flex-col items-center">
                    <Users size={22} className="text-teal-500 mb-1" />
                    <span className="text-2xl font-bold text-gray-900">
                      {currentTicket.position}
                    </span>
                    <span className="text-[11px] text-gray-500 text-center leading-tight">
                      {currentTicket.position === 1
                        ? "Vous êtes le prochain !"
                        : "personne(s) avant vous"}
                    </span>
                  </div>
                  <div className="w-px h-10 bg-gray-200"></div>
                  <div className="flex flex-col items-center">
                    <Clock size={22} className="text-amber-500 mb-1" />
                    <span className="text-2xl font-bold text-gray-900">
                      {currentTicket.temps}
                    </span>
                    <span className="text-[11px] text-gray-500 text-center">
                      Temps estimé
                    </span>
                  </div>
                </div>
              )}

              {currentTicket.status === "en_consultation" && (
                <div className="flex items-center gap-2 bg-blue-50 text-blue-500 p-3 rounded-xl mb-4">
                  <HeartPulse size={20} />
                  <span className="font-semibold text-sm">
                    Votre consultation est en cours
                  </span>
                </div>
              )}

              {/* Barre de progression */}
              {currentTicket.status === "en_attente" && (
                <div className="mb-3">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm text-gray-500 font-medium">
                      Progression
                    </span>
                    <span className="text-sm text-teal-500 font-bold">
                      {currentTicket.position === 1
                        ? "Presque !"
                        : `Position ${currentTicket.position}`}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(10, 100 - (currentTicket.position - 1) * 15)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-400 text-right mt-4">
                Créé à {currentTicket.dateCreation}
              </p>
            </div>
          ) : (
            /* Aucun ticket actif */
            <div className="bg-white rounded-[20px] p-8 flex flex-col items-center shadow-sm text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                <Ticket size={40} className="text-emerald-200" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Aucun ticket actif
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Prenez un ticket pour rejoindre la file d'attente
              </p>

              <button
                onClick={() => setIsCreateTicketOpen(true)}
                className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-6 py-3.5 rounded-full font-bold shadow-lg shadow-teal-500/30 transition"
              >
                <PlusCircle size={20} />
                Prendre un ticket
              </button>
            </div>
          )}
        </section>

        {/* ── Services disponibles ── */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-gray-900">
              Services disponibles
            </h2>
            <button
              onClick={() => navigate("/ticket")}
              className="text-teal-500 text-sm font-semibold"
            >
              Voir tout
            </button>
          </div>

          {/* Scroll Horizontal masquant la scrollbar avec Tailwind */}
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {services
              .filter((s: any) => s.disponible)
              .map((service: any) => (
                <button
                  key={service.id}
                  onClick={() => navigate("/ticket")}
                  className="min-w-[140px] bg-white rounded-2xl p-4 border-t-4 shadow-sm snap-start text-left hover:bg-gray-50 transition"
                  style={{ borderTopColor: service.color }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                    style={{ backgroundColor: service.color + "15" }}
                  >
                    <Activity size={20} color={service.color} />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
                    {service.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                    <Users size={12} /> {service.enAttente} en attente
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Clock size={12} /> ~{service.attente}
                  </div>
                </button>
              ))}
          </div>
        </section>

        {/* ── Historique ── */}
        {ticketHistory.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              Historique récent
            </h2>
            <div className="space-y-2">
              {ticketHistory.slice(0, 3).map((ticket: any) => (
                <div
                  key={ticket.id}
                  className="flex items-center bg-white rounded-xl p-3.5 shadow-sm border border-gray-100 gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                    <CheckCircle size={20} className="text-emerald-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900">
                      {ticket.service}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Créé à {ticket.dateCreation}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-500">
                    Terminé
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Notifications ── */}
        <section className="pb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            Notifications
          </h2>
          <div className="space-y-2">
            {notifications.slice(0, 3).map((notif: any) => (
              <div
                key={notif.id}
                className={`flex items-start p-3.5 rounded-xl gap-3 shadow-sm border ${
                  !notif.read
                    ? "bg-teal-50/50 border-teal-100"
                    : "bg-white border-gray-100"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 ${
                    notif.type === "success"
                      ? "bg-emerald-500"
                      : notif.type === "warning"
                        ? "bg-amber-500"
                        : "bg-blue-500"
                  }`}
                />
                <p
                  className={`text-sm flex-1 leading-snug ${!notif.read ? "text-gray-900 font-semibold" : "text-gray-600"}`}
                >
                  {notif.message}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <CreateTicketModal
        isOpen={isCreateTicketOpen}
        onClose={() => setIsCreateTicketOpen(false)}
      />
      <PatientProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
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
