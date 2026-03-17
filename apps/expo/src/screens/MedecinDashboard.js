import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuth, useApp } from "@monprojet/shared";

export default function MedecinDashboard() {
  const { userName } = useAuth();
  const { tickets, updateTicketStatus, services } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("en_attente");

  // ─── Filtrage des tickets par statut ─────────────────────────────────────────
  const waitingTickets = tickets.filter((t) => t.status === "en_attente");
  const consultingTickets = tickets.filter(
    (t) => t.status === "en_consultation",
  );
  const completedTickets = tickets.filter((t) => t.status === "termine");

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

  // ─── Rafraîchissement ─────────────────────────────────────────────────────────
  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  // ─── Actions sur les tickets ──────────────────────────────────────────────────
  const handleStartConsultation = (ticket) => {
    Alert.alert(
      "Démarrer la consultation",
      `Commencer la consultation de ${ticket.clientNom} ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Commencer",
          onPress: () => {
            updateTicketStatus(ticket.id, "en_consultation");
          },
        },
      ],
    );
  };

  const handleCompleteConsultation = (ticket) => {
    Alert.alert(
      "Terminer la consultation",
      `Marquer la consultation de ${ticket.clientNom} comme terminée ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Terminer",
          style: "destructive",
          onPress: () => {
            updateTicketStatus(ticket.id, "termine");
          },
        },
      ],
    );
  };

  const handleCancelTicket = (ticket) => {
    Alert.alert(
      "Annuler le ticket",
      `Annuler le ticket de ${ticket.clientNom} ?`,
      [
        { text: "Non", style: "cancel" },
        {
          text: "Annuler le ticket",
          style: "destructive",
          onPress: () => updateTicketStatus(ticket.id, "annule"),
        },
      ],
    );
  };

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const getServiceColor = (serviceId) => {
    const service = services.find((s) => s.id === serviceId);
    return service?.color || "#6B7280";
  };

  const getPriorityColor = (priorite) => {
    return priorite === "urgente" ? "#EF4444" : "#10B981";
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

  // ─── Rendu d'un ticket ────────────────────────────────────────────────────────
  const renderTicketItem = ({ item }) => (
    <View style={styles.ticketCard}>
      {/* En-tête du ticket */}
      <View style={styles.ticketHeader}>
        <View style={styles.ticketHeaderLeft}>
          <View
            style={[
              styles.ticketIdBadge,
              { backgroundColor: getServiceColor(item.serviceId) + "20" },
            ]}
          >
            <Text
              style={[
                styles.ticketId,
                { color: getServiceColor(item.serviceId) },
              ]}
            >
              {item.id}
            </Text>
          </View>

          {item.priorite === "urgente" && (
            <View style={styles.urgentBadge}>
              <Ionicons name="warning" size={12} color="#fff" />
              <Text style={styles.urgentText}>URGENT</Text>
            </View>
          )}
        </View>

        <View
          style={[
            styles.statusBadge,
            item.status === "en_attente" && styles.statusWaiting,
            item.status === "en_consultation" && styles.statusConsulting,
            item.status === "termine" && styles.statusDone,
            item.status === "annule" && styles.statusCancelled,
          ]}
        >
          <Text style={styles.statusText}>
            {item.status === "en_attente"
              ? "En attente"
              : item.status === "en_consultation"
                ? "En consultation"
                : item.status === "termine"
                  ? "Terminé"
                  : "Annulé"}
          </Text>
        </View>
      </View>

      {/* Infos patient */}
      <View style={styles.patientInfo}>
        <View style={styles.patientAvatar}>
          <Ionicons name="person" size={22} color="#fff" />
        </View>
        <View style={styles.patientDetails}>
          <Text style={styles.patientName}>{item.clientNom}</Text>
          <Text style={styles.patientService}>{item.service}</Text>
        </View>
      </View>

      {/* Détails du ticket */}
      <View style={styles.ticketDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="call-outline" size={15} color="#9CA3AF" />
          <Text style={styles.detailText}>{item.telephone || "—"}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={15} color="#9CA3AF" />
          <Text style={styles.detailText}>
            Arrivée : {item.dateCreation} · Attente : {item.temps}
          </Text>
        </View>

        {item.motif ? (
          <View style={styles.detailRow}>
            <Ionicons name="document-text-outline" size={15} color="#9CA3AF" />
            <Text style={styles.detailText} numberOfLines={1}>
              {item.motif}
            </Text>
          </View>
        ) : null}

        <View style={styles.detailRow}>
          <Ionicons name="people-outline" size={15} color="#9CA3AF" />
          <Text style={styles.detailText}>Position : {item.position}</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.ticketActions}>
        {item.status === "en_attente" && (
          <>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancelTicket(item)}
            >
              <Ionicons name="close" size={16} color="#EF4444" />
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.startButton}
              onPress={() => handleStartConsultation(item)}
            >
              <Ionicons name="play" size={16} color="#fff" />
              <Text style={styles.startButtonText}>Commencer</Text>
            </TouchableOpacity>
          </>
        )}

        {item.status === "en_consultation" && (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => handleCompleteConsultation(item)}
          >
            <Ionicons name="checkmark-circle" size={16} color="#fff" />
            <Text style={styles.completeButtonText}>Terminer</Text>
          </TouchableOpacity>
        )}

        {item.status === "termine" && (
          <View style={styles.doneContainer}>
            <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            <Text style={styles.doneText}>Consultation terminée</Text>
          </View>
        )}
      </View>
    </View>
  );

  // ─── Rendu principal ──────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={["#3B82F6", "#2563EB"]} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Tableau de bord</Text>
            <Text style={styles.userName}>Dr. {userName} 👨‍⚕️</Text>
          </View>
          <View style={styles.headerBadge}>
            <Ionicons name="medical" size={28} color="#fff" />
          </View>
        </View>

        {/* Statistiques rapides */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{waitingTickets.length}</Text>
            <Text style={styles.statLabel}>En attente</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{consultingTickets.length}</Text>
            <Text style={styles.statLabel}>En cours</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{completedTickets.length}</Text>
            <Text style={styles.statLabel}>Terminés</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Onglets */}
      <View style={styles.tabContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              selectedTab === tab.key && {
                backgroundColor: tab.color,
                borderColor: tab.color,
              },
            ]}
            onPress={() => setSelectedTab(tab.key)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab.key && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
            {tab.count > 0 && (
              <View
                style={[
                  styles.tabBadge,
                  selectedTab === tab.key
                    ? { backgroundColor: "rgba(255,255,255,0.3)" }
                    : { backgroundColor: tab.color },
                ]}
              >
                <Text style={styles.tabBadgeText}>{tab.count}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Liste des tickets */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <FlatList
          data={getCurrentTickets()}
          renderItem={renderTicketItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIcon}>
                <Ionicons name="people-outline" size={52} color="#D1D5DB" />
              </View>
              <Text style={styles.emptyTitle}>
                {selectedTab === "en_attente"
                  ? "Aucun patient en attente"
                  : selectedTab === "en_consultation"
                    ? "Aucune consultation en cours"
                    : "Aucune consultation terminée"}
              </Text>
              <Text style={styles.emptySubtitle}>
                {selectedTab === "en_attente"
                  ? "La file d'attente est vide pour le moment."
                  : "Tirez vers le bas pour actualiser."}
              </Text>
            </View>
          }
          contentContainerStyle={
            getCurrentTickets().length === 0 ? { flexGrow: 1 } : {}
          }
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    paddingTop: 55,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 2,
  },
  headerBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  statLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginVertical: 4,
  },

  // ── Onglets ──────────────────────────────────────────────────────────────────
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    gap: 5,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  tabTextActive: {
    color: "#fff",
  },
  tabBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  tabBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },

  // ── Contenu ──────────────────────────────────────────────────────────────────
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  // ── Carte ticket ─────────────────────────────────────────────────────────────
  ticketCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  ticketHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ticketIdBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ticketId: {
    fontSize: 14,
    fontWeight: "bold",
  },
  urgentBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EF4444",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  urgentText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusWaiting: {
    backgroundColor: "#FEF3C7",
  },
  statusConsulting: {
    backgroundColor: "#DBEAFE",
  },
  statusDone: {
    backgroundColor: "#D1FAE5",
  },
  statusCancelled: {
    backgroundColor: "#FEE2E2",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#374151",
  },

  // Patient info
  patientInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 12,
  },
  patientAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  patientService: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  // Détails
  ticketDetails: {
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: "#4B5563",
    flex: 1,
  },

  // Actions
  ticketActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#EF4444",
    gap: 5,
  },
  cancelButtonText: {
    color: "#EF4444",
    fontSize: 13,
    fontWeight: "600",
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#3B82F6",
    gap: 6,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  completeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#10B981",
    gap: 6,
  },
  completeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  doneContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  doneText: {
    fontSize: 14,
    color: "#10B981",
    fontWeight: "600",
  },

  // ── Vide ─────────────────────────────────────────────────────────────────────
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
