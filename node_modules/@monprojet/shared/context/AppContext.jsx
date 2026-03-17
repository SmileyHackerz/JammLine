import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "./AuthContext";

const AppContext = createContext(null);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
}

export function AppProvider({ children }) {
  const { user, profile } = useAuth();
  const [services, setServices] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ─── 1. CHARGEMENT INITIAL DES DONNÉES ──────────────────────────────────────
  useEffect(() => {
    fetchInitialData();

    // ─── 2. ABONNEMENT TEMPS RÉEL (MAGIQUE) ───
    // Dès qu'un ticket est ajouté ou modifié en BDD, on met à jour l'UI
    const ticketSubscription = supabase
      .channel("public:tickets")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tickets" },
        () => {
          fetchTickets(); // Re-fetch les tickets au moindre changement
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ticketSubscription);
    };
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    await Promise.all([
      fetchServices(),
      fetchTickets(),
      fetchNotifications(),
      fetchUsers(),
    ]);
    setIsLoading(false);
  };

  const fetchServices = async () => {
    const { data } = await supabase.from("services").select("*").order("id");
    if (data) setServices(data);
  };

  const fetchTickets = async () => {
    const { data } = await supabase
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: true });

    // On adapte le format BDD vers le format attendu par tes composants
    if (data) {
      const formatted = data.map((t) => ({
        id: t.ticket_number,
        db_id: t.id, // ID réel en BDD
        clientNom: t.patient_name || "Patient", // On pourra joindre avec profiles plus tard
        service: services.find((s) => s.id === t.service_id)?.name || "Général",
        serviceId: t.service_id,
        status: t.status,
        priorite: t.priorite,
        dateCreation: new Date(t.created_at).toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        motif: t.motif,
        position: t.position,
        telephone: t.patient_phone,
      }));
      setTickets(formatted);
    }
  };

  const fetchNotifications = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", session.user.id) // 👈 FILTRE STRICT
      .order("created_at", { ascending: false });

    if (data) setNotifications(data);
  };

  const fetchUsers = async () => {
    const { data } = await supabase.from("profiles").select("*");
    if (data) setUsers(data);
  };

  // ─── 3. ACTIONS (ÉCRITURE EN BDD) ──────────────────────────────────────────

  const createTicket = async (serviceInfo, patientInfo) => {
    const ticketCount = tickets.length + 1;
    const ticketNumber = `T${String(ticketCount).padStart(3, "0")}`;

    const { data, error } = await supabase
      .from("tickets")
      .insert([
        {
          ticket_number: ticketNumber,
          patient_id: user?.id,
          patient_name: patientInfo.name,
          patient_phone: patientInfo.phone,
          service_id: serviceInfo.serviceId,
          motif: patientInfo.motif,
          status: "en_attente",
          position:
            tickets.filter(
              (t) =>
                t.serviceId === serviceInfo.serviceId &&
                t.status === "en_attente",
            ).length + 1,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    if (userType === "patient") {
      addNotification(
        `Votre ticket ${ticketNumber} est enregistré`,
        "success",
        "ticket",
      );
    }
    return data;
  };

  const updateTicketStatus = async (ticketNumber, newStatus) => {
    const { error } = await supabase
      .from("tickets")
      .update({ status: newStatus })
      .eq("ticket_number", ticketNumber);

    if (error) throw error;
  };

  const addNotification = async (
    message,
    type = "info",
    category = "general",
  ) => {
    if (!user) return;
    await supabase.from("notifications").insert([
      {
        user_id: user.id,
        message,
        type,
        category,
      },
    ]);
    fetchNotifications();
  };

  const markNotificationRead = async (id) => {
    await supabase.from("notifications").update({ est_lu: true }).eq("id", id);
    fetchNotifications();
  };

  // ─── 4. STATISTIQUES DYNAMIQUES ──────────────────────────────────────────────
  const getStatistics = () => ({
    totalTickets: tickets.length,
    enAttente: tickets.filter((t) => t.status === "en_attente").length,
    termine: tickets.filter((t) => t.status === "termine").length,
    enConsultation: tickets.filter((t) => t.status === "en_consultation")
      .length,
    tempsMoyenAttente: 15,
  });

  const value = {
    services,
    tickets,
    users,
    notifications,
    statistics: getStatistics(),
    isLoading,
    createTicket,
    updateTicketStatus,
    addNotification,
    markNotificationRead,
    setTickets, // Pour compatibilité
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
