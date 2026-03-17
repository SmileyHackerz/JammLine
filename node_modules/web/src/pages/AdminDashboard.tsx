import React, { useState } from "react";
import { useAuth, useApp } from "@monprojet/shared";
import { useNavigate } from "react-router-dom";
import AddUserModal from "../components/modals/AddUserModal";
import { Settings } from "lucide-react";
import SettingsModal from "../components/modals/SettingsModal";
import NotificationsModal from "../components/modals/NotificationsModal";
import {
  Bell,
  LayoutGrid,
  Ticket,
  Activity,
  Users,
  ShieldCheck,
  Clock,
  CheckCircle,
  Hourglass,
  User,
  Shield,
  Heart,
  Search,
  XCircle,
  Phone,
  FileText,
  Play,
  Check,
  UserPlus,
  X,
  Mail,
} from "lucide-react";

const TABS = [
  { key: "overview", label: "Aperçu", icon: LayoutGrid },
  { key: "tickets", label: "Tickets", icon: Ticket },
  { key: "services", label: "Services", icon: Activity },
  { key: "users", label: "Utilisateurs", icon: Users },
];

export default function AdminDashboard() {
  const { userName } = useAuth();
  const {
    tickets,
    services,
    users,
    statistics,
    updateTicketStatus,
    notifications,
    addUser,
  } = useApp();
  const navigate = useNavigate();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [searchText, setSearchText] = useState("");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    nom: "",
    email: "",
    role: "Médecin",
    service: "",
  });

  // ─── Tickets filtrés ───────────────────────────────────────
  const filteredTickets = tickets.filter(
    (ticket: any) =>
      ticket.clientNom.toLowerCase().includes(searchText.toLowerCase()) ||
      ticket.id.toString().toLowerCase().includes(searchText.toLowerCase()) ||
      ticket.service.toLowerCase().includes(searchText.toLowerCase()),
  );

  // ─── Ajouter un utilisateur ───────────────────────────────────────────────────
  const handleAddUser = () => {
    if (
      !newUser.nom.trim() ||
      !newUser.email.trim() ||
      !newUser.service.trim()
    ) {
      window.alert("Veuillez remplir tous les champs.");
      return;
    }
    addUser(newUser);
    setNewUser({ nom: "", email: "", role: "Médecin", service: "" });
    setShowAddUserModal(false);
    window.alert(`${newUser.nom} a été ajouté(e) avec succès.`);
  };

  // ─── Helpers Couleurs ─────────────────────────────────────────────────────────────────
  const getStatusColor = (status: string) => {
    switch (status) {
      case "en_attente":
        return "#F59E0B";
      case "en_consultation":
        return "#3B82F6";
      case "termine":
        return "#10B981";
      default:
        return "#EF4444";
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Médecin":
        return "#3B82F6";
      case "Admin":
        return "#EF4444";
      case "Infirmière":
        return "#8B5CF6";
      default:
        return "#14B8A6";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-12 font-sans">
      {/* ── Header (Dégradé rouge) ── */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 pt-8 pb-6 px-6 md:px-12 shadow-md rounded-b-3xl">
        <div className="max-w-5xl mx-auto flex justify-between items-center mb-6">
          {/* GAUCHE : PROFIL ADMIN */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setIsProfileModalOpen(true)}
          >
            <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center backdrop-blur-md">
              <ShieldCheck size={24} color="#fff" />
            </div>
            <div>
              <p className="text-white/70 text-[10px] font-black uppercase tracking-widest leading-none mb-1">
                Administration
              </p>
              <h1 className="text-xl font-bold text-white leading-none group-hover:underline">
                {userName} 👨‍💼
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
                <span className="absolute -top-0.5 -right-0.5 bg-white text-red-600 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-red-500 animate-pulse">
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

        {/* Stats rapides */}
        <div className="flex bg-white/10 rounded-2xl py-3 px-4 justify-around items-center max-w-5xl mx-auto backdrop-blur-sm border border-white/20">
          <div className="text-center">
            <p className="text-white text-xl md:text-2xl font-bold">
              {statistics.totalTickets}
            </p>
            <p className="text-white/75 text-xs font-medium mt-1">
              Total tickets
            </p>
          </div>
          <div className="w-px h-8 bg-white/30"></div>
          <div className="text-center">
            <p className="text-white text-xl md:text-2xl font-bold">
              {statistics.enAttente}
            </p>
            <p className="text-white/75 text-xs font-medium mt-1">En attente</p>
          </div>
          <div className="w-px h-8 bg-white/30"></div>
          <div className="text-center">
            <p className="text-white text-xl md:text-2xl font-bold">
              {statistics.termine}
            </p>
            <p className="text-white/75 text-xs font-medium mt-1">Terminés</p>
          </div>
          <div className="w-px h-8 bg-white/30"></div>
          <div className="text-center">
            <p className="text-white text-xl md:text-2xl font-bold">
              {users.length}
            </p>
            <p className="text-white/75 text-xs font-medium mt-1">
              Utilisateurs
            </p>
          </div>
        </div>
      </div>

      {/* ── Onglets ── */}
      <div className="max-w-5xl mx-auto mt-6 px-4">
        <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 p-2 gap-2 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = selectedTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition border ${
                  isActive
                    ? "bg-red-500 text-white border-red-500 shadow-sm"
                    : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Contenu ── */}
      <div className="max-w-5xl mx-auto px-4 mt-8">
        {/* ─── Aperçu ─── */}
        {selectedTab === "overview" && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Statistiques globales
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {[
                {
                  title: "Total Tickets",
                  value: statistics.totalTickets,
                  icon: Ticket,
                  color: "#EF4444",
                },
                {
                  title: "En attente",
                  value: statistics.enAttente,
                  icon: Clock,
                  color: "#F59E0B",
                },
                {
                  title: "En consultation",
                  value: statistics.enConsultation,
                  icon: Activity,
                  color: "#3B82F6",
                },
                {
                  title: "Terminés",
                  value: statistics.termine,
                  icon: CheckCircle,
                  color: "#10B981",
                },
                {
                  title: "Temps moyen",
                  value: `${statistics.tempsMoyenAttente} min`,
                  icon: Hourglass,
                  color: "#8B5CF6",
                },
                {
                  title: "Utilisateurs",
                  value: users.length,
                  icon: Users,
                  color: "#EC4899",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded-xl shadow-sm border-l-4"
                  style={{ borderLeftColor: stat.color }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                    style={{ backgroundColor: stat.color + "20" }}
                  >
                    <stat.icon size={22} color={stat.color} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-xs font-medium text-gray-500">
                    {stat.title}
                  </p>
                </div>
              ))}
            </div>

            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Répartition des utilisateurs
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                {
                  role: "Patients",
                  count: users.filter((u: any) => u.role === "Patient").length,
                  color: "#14B8A6",
                  icon: User,
                },
                {
                  role: "Médecins",
                  count: users.filter((u: any) => u.role === "Médecin").length,
                  color: "#3B82F6",
                  icon: Activity,
                },
                {
                  role: "Admins",
                  count: users.filter((u: any) => u.role === "Admin").length,
                  color: "#EF4444",
                  icon: Shield,
                },
                {
                  role: "Infirmières",
                  count: users.filter((u: any) => u.role === "Infirmière")
                    .length,
                  color: "#8B5CF6",
                  icon: Heart,
                },
              ].map((item) => (
                <div
                  key={item.role}
                  className="bg-white rounded-xl p-4 flex flex-col items-center shadow-sm border border-gray-100"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                    style={{ backgroundColor: item.color + "20" }}
                  >
                    <item.icon size={24} color={item.color} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {item.count}
                  </p>
                  <p className="text-xs font-medium text-gray-500">
                    {item.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Tickets ─── */}
        {selectedTab === "tickets" && (
          <div className="animate-in fade-in duration-300">
            {/* Barre de recherche */}
            <div className="flex items-center bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-200 mb-4">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, ID ou service..."
                className="flex-1 outline-none px-3 text-sm"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              {searchText && (
                <button onClick={() => setSearchText("")}>
                  <XCircle
                    size={18}
                    className="text-gray-400 hover:text-red-500"
                  />
                </button>
              )}
            </div>

            {/* Liste des Tickets */}
            <div className="space-y-4">
              {filteredTickets.map((item: any) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-red-500">
                        {item.id}
                      </span>
                      <div
                        className={`w-2 h-2 rounded-full ${item.priorite === "urgente" ? "bg-red-500" : "bg-emerald-500"}`}
                      ></div>
                    </div>
                    <div
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: getStatusColor(item.status) + "20",
                        color: getStatusColor(item.status),
                      }}
                    >
                      {getStatusLabel(item.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User size={16} className="text-gray-400" />{" "}
                      <span className="font-bold text-gray-900">
                        {item.clientNom}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={16} className="text-gray-400" />{" "}
                      {item.telephone || "—"}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Activity size={16} className="text-gray-400" />{" "}
                      {item.service}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock size={16} className="text-gray-400" /> Créé à{" "}
                      {item.dateCreation}
                    </div>
                  </div>

                  {/* Actions Rapides */}
                  {item.status === "en_attente" && (
                    <button
                      onClick={() =>
                        updateTicketStatus(item.id, "en_consultation")
                      }
                      className="w-full flex justify-center items-center gap-2 py-2 border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 font-semibold transition"
                    >
                      <Play size={16} /> Démarrer la consultation
                    </button>
                  )}
                  {item.status === "en_consultation" && (
                    <button
                      onClick={() => updateTicketStatus(item.id, "termine")}
                      className="w-full flex justify-center items-center gap-2 py-2 border-2 border-emerald-500 text-emerald-500 rounded-lg hover:bg-emerald-50 font-semibold transition"
                    >
                      <Check size={16} /> Terminer
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Services ─── */}
        {selectedTab === "services" && (
          <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                Gestion des services
              </h2>
              <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm font-semibold">
                {services.filter((s: any) => s.disponible).length}/
                {services.length} actifs
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((item: any) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 border-l-4"
                  style={{ borderLeftColor: item.color }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: item.color + "20" }}
                      >
                        <Activity size={20} color={item.color} />
                      </div>
                      <h3 className="font-bold text-gray-900">{item.name}</h3>
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: item.disponible
                          ? "#D1FAE5"
                          : "#FEE2E2",
                        color: item.disponible ? "#10B981" : "#EF4444",
                      }}
                    >
                      {item.disponible ? "Disponible" : "Indisponible"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users size={16} /> {item.enAttente} attente
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} /> ~{item.attente}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Utilisateurs ─── */}
        {selectedTab === "users" && (
          <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                Gestion des utilisateurs
              </h2>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition shadow-sm"
              >
                <UserPlus size={18} /> Ajouter
              </button>
            </div>

            {/* Liste */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {users.map((item: any) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold"
                    style={{ backgroundColor: getRoleColor(item.role) }}
                  >
                    {item.nom.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{item.nom}</h3>
                    <p className="text-xs text-gray-500">{item.email}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.service}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className="px-2 py-1 rounded-md text-xs font-bold"
                      style={{
                        backgroundColor: getRoleColor(item.role) + "20",
                        color: getRoleColor(item.role),
                      }}
                    >
                      {item.role}
                    </span>
                    <span
                      className="text-[10px] font-bold"
                      style={{
                        color: item.statut === "actif" ? "#10B981" : "#EF4444",
                      }}
                    >
                      {item.statut === "actif" ? "Actif" : "Inactif"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
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
