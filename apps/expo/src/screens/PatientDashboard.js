import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth, useApp } from "@monprojet/shared";

export default function PatientDashboard() {
  const { userName } = useAuth();
  const { services, tickets, statistics, notifications } = useApp();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  // Ticket actif du patient connecté
  const currentTicket = tickets.find(
    (t) =>
      t.clientNom === userName &&
      (t.status === "en_attente" || t.status === "en_consultation"),
  );

  // Historique des tickets terminés
  const ticketHistory = tickets.filter(
    (t) => t.clientNom === userName && t.status === "termine",
  );

  // Notifications non lues
  const unreadCount = notifications.filter((n) => !n.read).length;

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const formatTime = (minutes) => {
    if (!minutes) return "–";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins} min`;
  };

  const getStatusColor = (status) => {
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

  const getStatusLabel = (status) => {
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "en_attente":
        return "time";
      case "en_consultation":
        return "medical";
      case "termine":
        return "checkmark-circle";
      default:
        return "close-circle";
    }
  };

  const estimatedWait = currentTicket ? currentTicket.position * 15 : 0;

  return (
    <View style={styles.container}>
      {/* ── En-tête ── */}
      <LinearGradient colors={["#14B8A6", "#0D9488"]} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.welcomeText}>Bonjour,</Text>
            <Text style={styles.userName}>{userName} 👋</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications" size={22} color="#fff" />
            {unreadCount > 0 && (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Mini stats dans le header */}
        <View style={styles.headerStats}>
          <View style={styles.headerStatItem}>
            <Text style={styles.headerStatValue}>{statistics.enAttente}</Text>
            <Text style={styles.headerStatLabel}>En attente</Text>
          </View>
          <View style={styles.headerStatDivider} />
          <View style={styles.headerStatItem}>
            <Text style={styles.headerStatValue}>
              {statistics.enConsultation}
            </Text>
            <Text style={styles.headerStatLabel}>En consultation</Text>
          </View>
          <View style={styles.headerStatDivider} />
          <View style={styles.headerStatItem}>
            <Text style={styles.headerStatValue}>
              {statistics.tempsMoyenAttente} min
            </Text>
            <Text style={styles.headerStatLabel}>Temps moyen</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#14B8A6"
            colors={["#14B8A6"]}
          />
        }
      >
        {/* ── Ticket actif ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mon ticket actuel</Text>

          {currentTicket ? (
            <View style={styles.ticketCard}>
              {/* Numéro de ticket */}
              <View style={styles.ticketTopRow}>
                <View style={styles.ticketNumBadge}>
                  <Ionicons name="ticket" size={16} color="#fff" />
                  <Text style={styles.ticketNumText}>{currentTicket.id}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        getStatusColor(currentTicket.status) + "20",
                    },
                  ]}
                >
                  <Ionicons
                    name={getStatusIcon(currentTicket.status)}
                    size={14}
                    color={getStatusColor(currentTicket.status)}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(currentTicket.status) },
                    ]}
                  >
                    {getStatusLabel(currentTicket.status)}
                  </Text>
                </View>
              </View>

              {/* Service */}
              <Text style={styles.ticketService}>{currentTicket.service}</Text>
              {currentTicket.motif ? (
                <Text style={styles.ticketMotif}>
                  Motif : {currentTicket.motif}
                </Text>
              ) : null}

              {/* Infos file d'attente */}
              {currentTicket.status === "en_attente" && (
                <View style={styles.queueInfo}>
                  <View style={styles.queueInfoItem}>
                    <Ionicons name="people" size={20} color="#14B8A6" />
                    <Text style={styles.queueInfoValue}>
                      {currentTicket.position}
                    </Text>
                    <Text style={styles.queueInfoLabel}>
                      {currentTicket.position === 1
                        ? "Vous êtes le prochain !"
                        : "personne(s) avant vous"}
                    </Text>
                  </View>
                  <View style={styles.queueInfoDivider} />
                  <View style={styles.queueInfoItem}>
                    <Ionicons name="time" size={20} color="#F59E0B" />
                    <Text style={styles.queueInfoValue}>
                      {currentTicket.temps}
                    </Text>
                    <Text style={styles.queueInfoLabel}>Temps estimé</Text>
                  </View>
                </View>
              )}

              {currentTicket.status === "en_consultation" && (
                <View style={styles.consultingBanner}>
                  <Ionicons name="pulse" size={20} color="#3B82F6" />
                  <Text style={styles.consultingText}>
                    Votre consultation est en cours
                  </Text>
                </View>
              )}

              {/* Barre de progression */}
              {currentTicket.status === "en_attente" && (
                <View style={styles.progressSection}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Progression</Text>
                    <Text style={styles.progressPercent}>
                      {currentTicket.position === 1
                        ? "Presque !"
                        : `Position ${currentTicket.position}`}
                    </Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${Math.max(
                            10,
                            100 - (currentTicket.position - 1) * 15,
                          )}%`,
                        },
                      ]}
                    />
                  </View>
                </View>
              )}

              {/* Heure de création */}
              <Text style={styles.ticketCreatedAt}>
                Créé à {currentTicket.dateCreation}
              </Text>
            </View>
          ) : (
            /* Aucun ticket actif */
            <View style={styles.noTicketCard}>
              <View style={styles.noTicketIconWrapper}>
                <Ionicons name="ticket-outline" size={50} color="#D1FAE5" />
              </View>
              <Text style={styles.noTicketTitle}>Aucun ticket actif</Text>
              <Text style={styles.noTicketSubtitle}>
                Prenez un ticket pour rejoindre la file d'attente
              </Text>
              <TouchableOpacity
                style={styles.takeTicketButton}
                onPress={() => navigation.navigate("Ticket")}
                activeOpacity={0.85}
              >
                <Ionicons name="add-circle" size={20} color="#fff" />
                <Text style={styles.takeTicketButtonText}>
                  Prendre un ticket
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ── Services disponibles ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Services disponibles</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Ticket")}>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.servicesScrollContent}
          >
            {services
              .filter((s) => s.disponible)
              .map((service) => (
                <TouchableOpacity
                  key={service.id}
                  style={[
                    styles.serviceCard,
                    { borderTopColor: service.color },
                  ]}
                  onPress={() => navigation.navigate("Ticket")}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.serviceIconContainer,
                      { backgroundColor: service.color + "15" },
                    ]}
                  >
                    <Ionicons
                      name={service.icon}
                      size={24}
                      color={service.color}
                    />
                  </View>
                  <Text style={styles.serviceName} numberOfLines={2}>
                    {service.name}
                  </Text>
                  <View style={styles.serviceFooter}>
                    <Ionicons name="people-outline" size={13} color="#9CA3AF" />
                    <Text style={styles.serviceQueue}>
                      {service.enAttente} en attente
                    </Text>
                  </View>
                  <View style={styles.serviceTimeRow}>
                    <Ionicons name="time-outline" size={13} color="#9CA3AF" />
                    <Text style={styles.serviceTime}>~{service.attente}</Text>
                  </View>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>

        {/* ── Historique ── */}
        {ticketHistory.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Historique récent</Text>
            {ticketHistory.slice(0, 3).map((ticket) => (
              <View key={ticket.id} style={styles.historyItem}>
                <View
                  style={[
                    styles.historyIconContainer,
                    { backgroundColor: "#D1FAE5" },
                  ]}
                >
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyService}>{ticket.service}</Text>
                  <Text style={styles.historyDate}>
                    Créé à {ticket.dateCreation}
                  </Text>
                </View>
                <Text style={styles.historyStatus}>Terminé</Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Notifications récentes ── */}
        <View style={[styles.section, { marginBottom: 30 }]}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          {notifications.slice(0, 3).map((notif) => (
            <View
              key={notif.id}
              style={[styles.notifItem, !notif.read && styles.notifItemUnread]}
            >
              <View
                style={[
                  styles.notifDot,
                  {
                    backgroundColor:
                      notif.type === "success"
                        ? "#10B981"
                        : notif.type === "warning"
                          ? "#F59E0B"
                          : "#3B82F6",
                  },
                ]}
              />
              <Text
                style={[
                  styles.notifMessage,
                  !notif.read && styles.notifMessageUnread,
                ]}
                numberOfLines={2}
              >
                {notif.message}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  // ── Header ──
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
  headerLeft: {},
  welcomeText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  notificationButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 22,
    position: "relative",
  },
  notifBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#EF4444",
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  notifBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  headerStats: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 14,
    padding: 12,
    justifyContent: "space-around",
    alignItems: "center",
  },
  headerStatItem: {
    alignItems: "center",
  },
  headerStatValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerStatLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 11,
    marginTop: 2,
  },
  headerStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.3)",
  },

  // ── Contenu ──
  content: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 13,
    color: "#14B8A6",
    fontWeight: "600",
    marginBottom: 12,
  },

  // ── Ticket actif ──
  ticketCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    shadowColor: "#14B8A6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#E0F7F4",
  },
  ticketTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  ticketNumBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#14B8A6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  ticketNumText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  ticketService: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  ticketMotif: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 14,
  },
  queueInfo: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    alignItems: "center",
    justifyContent: "space-around",
  },
  queueInfoItem: {
    alignItems: "center",
    gap: 4,
  },
  queueInfoValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  queueInfoLabel: {
    fontSize: 11,
    color: "#6B7280",
    textAlign: "center",
    maxWidth: 100,
  },
  queueInfoDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#E5E7EB",
  },
  consultingBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    gap: 10,
  },
  consultingText: {
    color: "#3B82F6",
    fontWeight: "600",
    fontSize: 14,
  },
  progressSection: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  progressPercent: {
    fontSize: 13,
    color: "#14B8A6",
    fontWeight: "600",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#14B8A6",
    borderRadius: 4,
  },
  ticketCreatedAt: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 6,
    textAlign: "right",
  },

  // ── Pas de ticket ──
  noTicketCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  noTicketIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F0FDF4",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  noTicketTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
  },
  noTicketSubtitle: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20,
  },
  takeTicketButton: {
    backgroundColor: "#14B8A6",
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: "#14B8A6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  takeTicketButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  // ── Services ──
  servicesScrollContent: {
    paddingRight: 16,
    gap: 12,
  },
  serviceCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    width: 140,
    borderTopWidth: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  serviceIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    lineHeight: 17,
  },
  serviceFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 3,
  },
  serviceQueue: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  serviceTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  serviceTime: {
    fontSize: 11,
    color: "#9CA3AF",
  },

  // ── Historique ──
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  historyIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  historyInfo: {
    flex: 1,
  },
  historyService: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  historyDate: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },
  historyStatus: {
    fontSize: 12,
    fontWeight: "600",
    color: "#10B981",
  },

  // ── Notifications ──
  notifItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  notifItemUnread: {
    backgroundColor: "#F0FDFA",
    borderWidth: 1,
    borderColor: "#CCFBF1",
  },
  notifDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  notifMessage: {
    flex: 1,
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  notifMessageUnread: {
    color: "#111827",
    fontWeight: "600",
  },
});
