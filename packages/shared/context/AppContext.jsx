import React, { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

export function AppProvider({ children }) {
  // ─── Services ───────────────────────────────────────────────────────────────
  const [services] = useState([
    {
      id: 1,
      name: "Consultation Générale",
      icon: "medical",
      color: "#3B82F6",
      disponible: true,
      enAttente: 5,
      attente: "15-20 min",
      estimatedTime: 15,
      description: "Consultation médicale générale",
    },
    {
      id: 2,
      name: "Pédiatrie",
      icon: "person",
      color: "#10B981",
      disponible: true,
      enAttente: 3,
      attente: "10-15 min",
      estimatedTime: 12,
      description: "Consultation pour enfants",
    },
    {
      id: 3,
      name: "Cardiologie",
      icon: "heart",
      color: "#EF4444",
      disponible: false,
      enAttente: 0,
      attente: "30-40 min",
      estimatedTime: 35,
      description: "Consultation cardiaque spécialisée",
    },
    {
      id: 4,
      name: "Urgences",
      icon: "warning",
      color: "#F59E0B",
      disponible: true,
      enAttente: 8,
      attente: "5-10 min",
      estimatedTime: 8,
      description: "Prise en charge des urgences",
    },
    {
      id: 5,
      name: "Radiologie",
      icon: "camera",
      color: "#8B5CF6",
      disponible: true,
      enAttente: 2,
      attente: "20-30 min",
      estimatedTime: 25,
      description: "Examens radiologiques et imagerie",
    },
    {
      id: 6,
      name: "Laboratoire",
      icon: "flask",
      color: "#EC4899",
      disponible: true,
      enAttente: 4,
      attente: "15-25 min",
      estimatedTime: 20,
      description: "Analyses biologiques et examens",
    },
  ]);

  // ─── Tickets / Réservations ──────────────────────────────────────────────────
  const [tickets, setTickets] = useState([
    {
      id: "T001",
      clientNom: "Amadou Diallo",
      telephone: "+221 77 123 45 67",
      service: "Consultation Générale",
      serviceId: 1,
      position: 1,
      temps: "15-20 min",
      priorite: "normale",
      status: "en_attente",
      dateCreation: "09:30",
      motif: "Douleur abdominale",
    },
    {
      id: "T002",
      clientNom: "Fatou Sarr",
      telephone: "+221 77 234 56 78",
      service: "Pédiatrie",
      serviceId: 2,
      position: 1,
      temps: "10-15 min",
      priorite: "normale",
      status: "en_attente",
      dateCreation: "09:35",
      motif: "Fièvre chez enfant",
    },
    {
      id: "T003",
      clientNom: "Ibrahim Ba",
      telephone: "+221 77 345 67 89",
      service: "Cardiologie",
      serviceId: 3,
      position: 1,
      temps: "30-35 min",
      priorite: "urgente",
      status: "en_consultation",
      dateCreation: "09:40",
      motif: "Pression artérielle élevée",
    },
    {
      id: "T004",
      clientNom: "Aminata Fall",
      telephone: "+221 77 456 78 90",
      service: "Consultation Générale",
      serviceId: 1,
      position: 2,
      temps: "20-25 min",
      priorite: "normale",
      status: "en_attente",
      dateCreation: "09:45",
      motif: "Suivi grossesse",
    },
    {
      id: "T005",
      clientNom: "Ousmane Diop",
      telephone: "+221 77 567 89 01",
      service: "Urgences",
      serviceId: 4,
      position: 1,
      temps: "5-10 min",
      priorite: "urgente",
      status: "en_attente",
      dateCreation: "09:50",
      motif: "Douleur thoracique",
    },
    {
      id: "T006",
      clientNom: "Mariama Diallo",
      telephone: "+221 77 678 90 12",
      service: "Radiologie",
      serviceId: 5,
      position: 1,
      temps: "20-30 min",
      priorite: "normale",
      status: "termine",
      dateCreation: "08:00",
      motif: "Radio pulmonaire",
    },
    {
      id: "T007",
      clientNom: "Cheikh Mbaye",
      telephone: "+221 77 789 01 23",
      service: "Laboratoire",
      serviceId: 6,
      position: 1,
      temps: "15-25 min",
      priorite: "normale",
      status: "termine",
      dateCreation: "08:15",
      motif: "Bilan sanguin",
    },
  ]);

  // ─── Utilisateurs ───────────────────────────────────────────────────────────
  const [users, setUsers] = useState([
    {
      id: 1,
      nom: "Dr. Marie Diop",
      email: "medecin1@test.com",
      role: "Médecin",
      service: "Consultation Générale",
      statut: "actif",
    },
    {
      id: 2,
      nom: "Dr. Ahmadou Ba",
      email: "medecin2@test.com",
      role: "Médecin",
      service: "Pédiatrie",
      statut: "actif",
    },
    {
      id: 3,
      nom: "Dr. Aminata Sow",
      email: "medecin3@test.com",
      role: "Médecin",
      service: "Cardiologie",
      statut: "inactif",
    },
    {
      id: 4,
      nom: "Mme. Fatou Ndiaye",
      email: "fatou.ndiaye@jammline.com",
      role: "Infirmière",
      service: "Accueil",
      statut: "actif",
    },
    {
      id: 5,
      nom: "M. Aliou Faye",
      email: "admin@test.com",
      role: "Admin",
      service: "Administration",
      statut: "actif",
    },
    {
      id: 6,
      nom: "Amadou Diallo",
      email: "patient1@test.com",
      role: "Patient",
      service: "-",
      statut: "actif",
    },
    {
      id: 7,
      nom: "Fatou Sarr",
      email: "patient2@test.com",
      role: "Patient",
      service: "-",
      statut: "actif",
    },
  ]);

  // ─── Notifications ───────────────────────────────────────────────────────────
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Votre ticket T001 est bientôt appelé",
      type: "info",
      read: false,
      category: "ticket",
    },
    {
      id: 2,
      message: "Nouveau service de Radiologie disponible",
      type: "success",
      read: false,
      category: "general",
    },
    {
      id: 3,
      message: "Mise à jour du temps d'attente : Urgences 5 min",
      type: "warning",
      read: true,
      category: "ticket",
    },
    {
      id: 4,
      message: "Consultation T003 terminée avec succès",
      type: "success",
      read: false,
      category: "consultation",
    },
    {
      id: 5,
      message: "Rappel : Consultation Générale dans 10 minutes",
      type: "info",
      read: false,
      category: "rappel",
    },
  ]);

  // ─── Statistiques (calculées dynamiquement) ──────────────────────────────────
  const getStatistics = () => ({
    totalTickets: tickets.length,
    enAttente: tickets.filter((t) => t.status === "en_attente").length,
    enConsultation: tickets.filter((t) => t.status === "en_consultation")
      .length,
    termine: tickets.filter((t) => t.status === "termine").length,
    tempsMoyenAttente: 18,
    consultationsAujourdhui: tickets.filter((t) => t.status === "termine")
      .length,
  });

  // ─── Actions Tickets ─────────────────────────────────────────────────────────

  /**
   * Créer un nouveau ticket
   * @param {object} serviceInfo  - { serviceId: number }
   * @param {object} patientInfo  - { name, phone, motif }
   * @returns {object} newTicket
   */
  const createTicket = (serviceInfo, patientInfo) => {
    const service =
      services.find((s) => s.id === serviceInfo.serviceId) || services[0];
    const waitingInService = tickets.filter(
      (t) => t.serviceId === service.id && t.status === "en_attente",
    );

    const newTicket = {
      id: `T${String(tickets.length + 1).padStart(3, "0")}`,
      clientNom: patientInfo.name,
      telephone: patientInfo.phone || "",
      service: service.name,
      serviceId: service.id,
      position: waitingInService.length + 1,
      temps: service.attente,
      priorite: "normale",
      status: "en_attente",
      dateCreation: new Date().toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      motif: patientInfo.motif || "Consultation générale",
    };

    setTickets((prev) => [...prev, newTicket]);
    return newTicket;
  };

  /**
   * Mettre à jour le statut d'un ticket
   */
  const updateTicketStatus = (ticketId, newStatus) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket,
      ),
    );
  };

  /**
   * Filtrer les tickets par statut
   */
  const getTicketsByStatus = (status) =>
    tickets.filter((t) => t.status === status);

  /**
   * Récupérer la position d'un ticket dans la file
   */
  const getQueuePosition = (ticketId) => {
    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) return 0;
    const waiting = tickets.filter(
      (t) => t.serviceId === ticket.serviceId && t.status === "en_attente",
    );
    return waiting.findIndex((t) => t.id === ticketId) + 1;
  };

  // ─── Actions Utilisateurs ─────────────────────────────────────────────────────
  const addUser = (userData) => {
    if (!userData || !userData.nom) return;
    const newUser = {
      id: users.length + 1,
      ...userData,
      statut: "actif",
    };
    setUsers((prev) => [...prev, newUser]);
  };

  const deleteUser = (userId) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  // ─── Actions Notifications ────────────────────────────────────────────────────
  const markNotificationRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addNotification = (message, type = "info", category = "general") => {
    setNotifications((prev) => [
      {
        id: Date.now(),
        message,
        type,
        read: false,
        category,
      },
      ...prev,
    ]);
  };

  // ─── Valeur exposée ──────────────────────────────────────────────────────────
  const value = {
    // Données
    services,
    tickets,
    users,
    notifications,

    // Statistiques
    statistics: getStatistics(),

    // Actions tickets
    createTicket,
    updateTicketStatus,
    getTicketsByStatus,
    getQueuePosition,

    // Actions utilisateurs
    addUser,
    deleteUser,

    // Actions notifications
    markNotificationRead,
    markAllNotificationsRead,
    addNotification,
    setNotifications,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
