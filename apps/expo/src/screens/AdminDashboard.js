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
  TextInput,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuth, useApp } from "@monprojet/shared";

const TABS = [
  { key: "overview", label: "Aperçu", icon: "grid-outline" },
  { key: "tickets", label: "Tickets", icon: "ticket-outline" },
  { key: "services", label: "Services", icon: "medical-outline" },
  { key: "users", label: "Utilisateurs", icon: "people-outline" },
];

export default function AdminDashboard() {
  const { userName } = useAuth();
  const { tickets, services, users, statistics, updateTicketStatus, addUser } =
    useApp();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [searchText, setSearchText] = useState("");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    nom: "",
    email: "",
    role: "Médecin",
    service: "",
  });

  // ─── Rafraîchissement ─────────────────────────────────────────────────────────
  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  // ─── Tickets filtrés pour la recherche ───────────────────────────────────────
  const filteredTickets = tickets.filter(
    (ticket) =>
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
      Alert.alert("Champs manquants", "Veuillez remplir tous les champs.");
      return;
    }
    addUser(newUser);
    setNewUser({ nom: "", email: "", role: "Médecin", service: "" });
    setShowAddUserModal(false);
    Alert.alert("Succès", `${newUser.nom} a été ajouté(e) avec succès.`);
  };

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const getStatusColor = (status) => {
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

  const getRoleColor = (role) => {
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

  // ─── Rendu carte statistique ──────────────────────────────────────────────────
  const renderStatCard = (title, value, icon, color) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View
        style={[styles.statIconContainer, { backgroundColor: color + "20" }]}
      >
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  // ─── Rendu d'un ticket ────────────────────────────────────────────────────────
  const renderTicketItem = ({ item }) => (
    <View style={styles.ticketItem}>
      <View style={styles.ticketItemHeader}>
        <View style={styles.ticketItemLeft}>
          <Text style={styles.ticketItemNumber}>{item.id}</Text>
          <View
            style={[
              styles.ticketPriorityDot,
              {
                backgroundColor:
                  item.priorite === "urgente" ? "#EF4444" : "#10B981",
              },
            ]}
          />
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) + "20" },
          ]}
        >
          <Text
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.ticketItemBody}>
        <View style={styles.ticketItemRow}>
          <Ionicons name="person-outline" size={15} color="#9CA3AF" />
          <Text style={styles.ticketItemPatient}>{item.clientNom}</Text>
        </View>
        <View style={styles.ticketItemRow}>
          <Ionicons name="call-outline" size={15} color="#9CA3AF" />
          <Text style={styles.ticketItemDetail}>{item.telephone || "—"}</Text>
        </View>
        <View style={styles.ticketItemRow}>
          <Ionicons name="medical-outline" size={15} color="#9CA3AF" />
          <Text style={styles.ticketItemDetail}>{item.service}</Text>
        </View>
        <View style={styles.ticketItemRow}>
          <Ionicons name="time-outline" size={15} color="#9CA3AF" />
          <Text style={styles.ticketItemDetail}>
            Créé à {item.dateCreation}
          </Text>
        </View>
        {item.motif ? (
          <View style={styles.ticketItemRow}>
            <Ionicons name="document-text-outline" size={15} color="#9CA3AF" />
            <Text style={styles.ticketItemDetail} numberOfLines={1}>
              {item.motif}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Actions rapides admin */}
      {item.status === "en_attente" && (
        <TouchableOpacity
          style={styles.ticketActionButton}
          onPress={() => updateTicketStatus(item.id, "en_consultation")}
        >
          <Ionicons name="play" size={14} color="#3B82F6" />
          <Text style={styles.ticketActionText}>Démarrer</Text>
        </TouchableOpacity>
      )}
      {item.status === "en_consultation" && (
        <TouchableOpacity
          style={[styles.ticketActionButton, { borderColor: "#10B981" }]}
          onPress={() => updateTicketStatus(item.id, "termine")}
        >
          <Ionicons name="checkmark" size={14} color="#10B981" />
          <Text style={[styles.ticketActionText, { color: "#10B981" }]}>
            Terminer
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // ─── Rendu d'un service ───────────────────────────────────────────────────────
  const renderServiceItem = ({ item }) => (
    <View style={[styles.serviceItem, { borderLeftColor: item.color }]}>
      <View style={styles.serviceItemHeader}>
        <View style={styles.serviceNameRow}>
          <View
            style={[
              styles.serviceIconContainer,
              { backgroundColor: item.color + "20" },
            ]}
          >
            <Ionicons name={item.icon} size={18} color={item.color} />
          </View>
          <Text style={styles.serviceItemName}>{item.name}</Text>
        </View>
        <View
          style={[
            styles.serviceStatusBadge,
            { backgroundColor: item.disponible ? "#D1FAE5" : "#FEE2E2" },
          ]}
        >
          <Text
            style={[
              styles.serviceStatusText,
              { color: item.disponible ? "#10B981" : "#EF4444" },
            ]}
          >
            {item.disponible ? "Disponible" : "Indisponible"}
          </Text>
        </View>
      </View>

      <Text style={styles.serviceItemDescription}>{item.description}</Text>

      <View style={styles.serviceStats}>
        <View style={styles.serviceStatItem}>
          <Ionicons name="people-outline" size={14} color="#6B7280" />
          <Text style={styles.serviceStatText}>
            {item.enAttente} en attente
          </Text>
        </View>
        <View style={styles.serviceStatItem}>
          <Ionicons name="time-outline" size={14} color="#6B7280" />
          <Text style={styles.serviceStatText}>~{item.attente}</Text>
        </View>
      </View>
    </View>
  );

  // ─── Rendu d'un utilisateur ───────────────────────────────────────────────────
  const renderUserItem = ({ item }) => (
    <View style={styles.userItem}>
      <View
        style={[
          styles.userAvatar,
          { backgroundColor: getRoleColor(item.role) },
        ]}
      >
        <Text style={styles.userAvatarText}>
          {item.nom.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.nom}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.userService}>{item.service}</Text>
      </View>
      <View style={styles.userRight}>
        <View
          style={[
            styles.roleBadge,
            { backgroundColor: getRoleColor(item.role) + "20" },
          ]}
        >
          <Text style={[styles.roleText, { color: getRoleColor(item.role) }]}>
            {item.role}
          </Text>
        </View>
        <View
          style={[
            styles.statutBadge,
            {
              backgroundColor: item.statut === "actif" ? "#D1FAE5" : "#FEE2E2",
            },
          ]}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: "700",
              color: item.statut === "actif" ? "#10B981" : "#EF4444",
            }}
          >
            {item.statut === "actif" ? "Actif" : "Inactif"}
          </Text>
        </View>
      </View>
    </View>
  );

  // ─── Rendu principal ──────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <LinearGradient colors={["#EF4444", "#DC2626"]} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerLabel}>Administration</Text>
            <Text style={styles.headerName}>{userName} 👨‍💼</Text>
          </View>
          <View style={styles.headerBadge}>
            <Ionicons name="shield-checkmark" size={28} color="#fff" />
          </View>
        </View>

        {/* Stats rapides */}
        <View style={styles.headerStats}>
          <View style={styles.headerStatItem}>
            <Text style={styles.headerStatValue}>
              {statistics.totalTickets}
            </Text>
            <Text style={styles.headerStatLabel}>Total tickets</Text>
          </View>
          <View style={styles.headerStatDivider} />
          <View style={styles.headerStatItem}>
            <Text style={styles.headerStatValue}>{statistics.enAttente}</Text>
            <Text style={styles.headerStatLabel}>En attente</Text>
          </View>
          <View style={styles.headerStatDivider} />
          <View style={styles.headerStatItem}>
            <Text style={styles.headerStatValue}>{statistics.termine}</Text>
            <Text style={styles.headerStatLabel}>Terminés</Text>
          </View>
          <View style={styles.headerStatDivider} />
          <View style={styles.headerStatItem}>
            <Text style={styles.headerStatValue}>{users.length}</Text>
            <Text style={styles.headerStatLabel}>Utilisateurs</Text>
          </View>
        </View>
      </LinearGradient>

      {/* ── Onglets ── */}
      <View style={styles.tabContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, selectedTab === tab.key && styles.activeTab]}
            onPress={() => setSelectedTab(tab.key)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={tab.icon}
              size={16}
              color={selectedTab === tab.key ? "#fff" : "#6B7280"}
            />
            <Text
              style={[
                styles.tabText,
                selectedTab === tab.key && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Contenu ── */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#EF4444"
            colors={["#EF4444"]}
          />
        }
      >
        {/* ─── Aperçu ─── */}
        {selectedTab === "overview" && (
          <View>
            <Text style={styles.sectionTitle}>Statistiques globales</Text>
            <View style={styles.statsGrid}>
              {renderStatCard(
                "Total Tickets",
                statistics.totalTickets,
                "ticket",
                "#EF4444",
              )}
              {renderStatCard(
                "En attente",
                statistics.enAttente,
                "time",
                "#F59E0B",
              )}
              {renderStatCard(
                "En consultation",
                statistics.enConsultation,
                "medical",
                "#3B82F6",
              )}
              {renderStatCard(
                "Terminés",
                statistics.termine,
                "checkmark-circle",
                "#10B981",
              )}
              {renderStatCard(
                "Temps moyen",
                `${statistics.tempsMoyenAttente} min`,
                "hourglass",
                "#8B5CF6",
              )}
              {renderStatCard(
                "Utilisateurs",
                users.length,
                "people",
                "#EC4899",
              )}
            </View>

            {/* Répartition par rôle */}
            <Text style={styles.sectionTitle}>
              Répartition des utilisateurs
            </Text>
            <View style={styles.rolesGrid}>
              {[
                {
                  role: "Patients",
                  count: users.filter((u) => u.role === "Patient").length,
                  color: "#14B8A6",
                  icon: "person",
                },
                {
                  role: "Médecins",
                  count: users.filter((u) => u.role === "Médecin").length,
                  color: "#3B82F6",
                  icon: "medical",
                },
                {
                  role: "Admins",
                  count: users.filter((u) => u.role === "Admin").length,
                  color: "#EF4444",
                  icon: "shield",
                },
                {
                  role: "Infirmières",
                  count: users.filter((u) => u.role === "Infirmière").length,
                  color: "#8B5CF6",
                  icon: "heart",
                },
              ].map((item) => (
                <View key={item.role} style={styles.roleCard}>
                  <View
                    style={[
                      styles.roleIconContainer,
                      { backgroundColor: item.color + "20" },
                    ]}
                  >
                    <Ionicons name={item.icon} size={22} color={item.color} />
                  </View>
                  <Text style={styles.roleCount}>{item.count}</Text>
                  <Text style={styles.roleLabel}>{item.role}</Text>
                </View>
              ))}
            </View>

            {/* Derniers tickets */}
            <Text style={styles.sectionTitle}>Derniers tickets</Text>
            {tickets.slice(0, 3).map((ticket) => (
              <View key={ticket.id} style={styles.recentTicketItem}>
                <View
                  style={[
                    styles.recentTicketDot,
                    { backgroundColor: getStatusColor(ticket.status) },
                  ]}
                />
                <View style={styles.recentTicketInfo}>
                  <Text style={styles.recentTicketName}>
                    {ticket.clientNom}
                  </Text>
                  <Text style={styles.recentTicketService}>
                    {ticket.service}
                  </Text>
                </View>
                <View>
                  <Text style={styles.recentTicketId}>{ticket.id}</Text>
                  <Text
                    style={[
                      styles.recentTicketStatus,
                      { color: getStatusColor(ticket.status) },
                    ]}
                  >
                    {getStatusLabel(ticket.status)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ─── Tickets ─── */}
        {selectedTab === "tickets" && (
          <View>
            {/* Barre de recherche */}
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={18} color="#9CA3AF" />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher par nom, ID ou service..."
                placeholderTextColor="#9CA3AF"
                value={searchText}
                onChangeText={setSearchText}
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText("")}>
                  <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>

            {/* Filtres rapides par statut */}
            <View style={styles.filterRow}>
              {["tous", "en_attente", "en_consultation", "termine"].map(
                (filter) => (
                  <TouchableOpacity
                    key={filter}
                    style={[
                      styles.filterChip,
                      searchText === filter && { backgroundColor: "#EF4444" },
                    ]}
                  >
                    <Text style={styles.filterChipText}>
                      {filter === "tous"
                        ? "Tous"
                        : filter === "en_attente"
                          ? "En attente"
                          : filter === "en_consultation"
                            ? "En cours"
                            : "Terminés"}
                    </Text>
                  </TouchableOpacity>
                ),
              )}
            </View>

            <FlatList
              data={filteredTickets}
              renderItem={renderTicketItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="ticket-outline" size={52} color="#D1D5DB" />
                  <Text style={styles.emptyTitle}>Aucun ticket trouvé</Text>
                  <Text style={styles.emptySubtitle}>
                    Essayez un autre terme de recherche.
                  </Text>
                </View>
              }
            />
          </View>
        )}

        {/* ─── Services ─── */}
        {selectedTab === "services" && (
          <View>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Gestion des services</Text>
              <View style={styles.serviceCountBadge}>
                <Text style={styles.serviceCountText}>
                  {services.filter((s) => s.disponible).length}/
                  {services.length} actifs
                </Text>
              </View>
            </View>

            <FlatList
              data={services}
              renderItem={renderServiceItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="medical-outline" size={52} color="#D1D5DB" />
                  <Text style={styles.emptyTitle}>Aucun service configuré</Text>
                </View>
              }
            />
          </View>
        )}

        {/* ─── Utilisateurs ─── */}
        {selectedTab === "users" && (
          <View>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Gestion des utilisateurs</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowAddUserModal(true)}
              >
                <Ionicons name="person-add" size={16} color="#fff" />
                <Text style={styles.addButtonText}>Ajouter</Text>
              </TouchableOpacity>
            </View>

            {/* Barre de recherche utilisateurs */}
            <View style={[styles.searchContainer, { marginBottom: 16 }]}>
              <Ionicons name="search" size={18} color="#9CA3AF" />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher un utilisateur..."
                placeholderTextColor="#9CA3AF"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>

            <FlatList
              data={users.filter(
                (u) =>
                  u.nom.toLowerCase().includes(searchText.toLowerCase()) ||
                  u.email.toLowerCase().includes(searchText.toLowerCase()),
              )}
              renderItem={renderUserItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="people-outline" size={52} color="#D1D5DB" />
                  <Text style={styles.emptyTitle}>
                    Aucun utilisateur trouvé
                  </Text>
                </View>
              }
            />
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* ── Modal Ajout Utilisateur ── */}
      <Modal
        visible={showAddUserModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddUserModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ajouter un utilisateur</Text>
              <TouchableOpacity onPress={() => setShowAddUserModal(false)}>
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            {[
              {
                label: "Nom complet",
                key: "nom",
                placeholder: "Ex : Dr. Marie Diop",
                icon: "person-outline",
              },
              {
                label: "Email",
                key: "email",
                placeholder: "exemple@jammline.com",
                icon: "mail-outline",
                keyboardType: "email-address",
              },
              {
                label: "Service",
                key: "service",
                placeholder: "Ex : Consultation Générale",
                icon: "medical-outline",
              },
            ].map((field) => (
              <View key={field.key} style={styles.modalField}>
                <Text style={styles.modalFieldLabel}>{field.label}</Text>
                <View style={styles.modalInputWrapper}>
                  <Ionicons
                    name={field.icon}
                    size={16}
                    color="#9CA3AF"
                    style={{ marginRight: 8 }}
                  />
                  <TextInput
                    style={styles.modalInput}
                    placeholder={field.placeholder}
                    placeholderTextColor="#9CA3AF"
                    value={newUser[field.key]}
                    onChangeText={(text) =>
                      setNewUser((prev) => ({ ...prev, [field.key]: text }))
                    }
                    keyboardType={field.keyboardType || "default"}
                    autoCapitalize={field.key === "email" ? "none" : "words"}
                  />
                </View>
              </View>
            ))}

            {/* Sélecteur de rôle */}
            <View style={styles.modalField}>
              <Text style={styles.modalFieldLabel}>Rôle</Text>
              <View style={styles.roleSelector}>
                {["Médecin", "Infirmière", "Admin", "Patient"].map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.roleSelectorButton,
                      newUser.role === role && {
                        backgroundColor: getRoleColor(role),
                        borderColor: getRoleColor(role),
                      },
                    ]}
                    onPress={() => setNewUser((prev) => ({ ...prev, role }))}
                  >
                    <Text
                      style={[
                        styles.roleSelectorText,
                        newUser.role === role && { color: "#fff" },
                      ]}
                    >
                      {role}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalConfirmButton}
              onPress={handleAddUser}
            >
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.modalConfirmText}>Confirmer l'ajout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  headerLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },
  headerName: {
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
  headerStats: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    justifyContent: "space-around",
    alignItems: "center",
  },
  headerStatItem: {
    alignItems: "center",
  },
  headerStatValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerStatLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 10,
    marginTop: 2,
    fontWeight: "500",
  },
  headerStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.3)",
  },

  // ── Onglets ──────────────────────────────────────────────────────────────────
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 6,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    gap: 4,
  },
  activeTab: {
    backgroundColor: "#EF4444",
    borderColor: "#EF4444",
  },
  tabText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
  },
  activeTabText: {
    color: "#fff",
  },

  // ── Contenu ──────────────────────────────────────────────────────────────────
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    marginTop: 4,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  // ── Grille de stats ───────────────────────────────────────────────────────────
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 10,
  },
  statCard: {
    width: "47%",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 0,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 3,
  },
  statTitle: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },

  // ── Rôles ────────────────────────────────────────────────────────────────────
  rolesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  roleCard: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  roleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  roleCount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
  },
  roleLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },

  // ── Derniers tickets ──────────────────────────────────────────────────────────
  recentTicketItem: {
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
  recentTicketDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  recentTicketInfo: {
    flex: 1,
  },
  recentTicketName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  recentTicketService: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },
  recentTicketId: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#6B7280",
    textAlign: "right",
  },
  recentTicketStatus: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "right",
    marginTop: 2,
  },

  // ── Recherche ─────────────────────────────────────────────────────────────────
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  filterChipText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },

  // ── Ticket item ───────────────────────────────────────────────────────────────
  ticketItem: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  ticketItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  ticketItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ticketItemNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#EF4444",
  },
  ticketPriorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  ticketItemBody: {
    gap: 6,
    marginBottom: 10,
  },
  ticketItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ticketItemPatient: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  ticketItemDetail: {
    fontSize: 13,
    color: "#6B7280",
    flex: 1,
  },
  ticketActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#3B82F6",
    gap: 6,
  },
  ticketActionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3B82F6",
  },

  // ── Service item ──────────────────────────────────────────────────────────────
  serviceItem: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  serviceItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  serviceNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  serviceIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceItemName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
  },
  serviceStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  serviceStatusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  serviceItemDescription: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 10,
    lineHeight: 18,
  },
  serviceStats: {
    flexDirection: "row",
    gap: 16,
  },
  serviceStatItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  serviceStatText: {
    fontSize: 12,
    color: "#6B7280",
  },
  serviceCountBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  serviceCountText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },

  // ── Bouton ajouter ────────────────────────────────────────────────────────────
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EF4444",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },

  // ── Utilisateur item ──────────────────────────────────────────────────────────
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  userAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  userAvatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  userEmail: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 1,
  },
  userService: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  userRight: {
    alignItems: "flex-end",
    gap: 5,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  roleText: {
    fontSize: 11,
    fontWeight: "700",
  },
  statutBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },

  // ── Vide ──────────────────────────────────────────────────────────────────────
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
  },

  // ── Modal ─────────────────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  modalField: {
    marginBottom: 16,
  },
  modalFieldLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
  },
  modalInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#F9FAFB",
  },
  modalInput: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
  },
  roleSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  roleSelectorButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  roleSelectorText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  modalConfirmButton: {
    backgroundColor: "#EF4444",
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modalConfirmText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
