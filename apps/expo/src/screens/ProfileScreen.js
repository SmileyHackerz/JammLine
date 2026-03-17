import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Switch,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@monprojet/shared";

export default function ProfileScreen() {
  const { userName, userType, currentUser, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: userName || "",
    email: currentUser?.email || "",
    phone: currentUser?.profile?.telephone || "+221 77 000 00 00",
    address: currentUser?.profile?.adresse || "Dakar, Sénégal",
  });
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleSave = async () => {
    try {
      await updateProfile({
        telephone: userInfo.phone,
        adresse: userInfo.address,
      });
      setIsEditing(false);
      Alert.alert("Succès", "Votre profil a été mis à jour avec succès.");
    } catch (error) {
      Alert.alert("Erreur", "Impossible de mettre à jour le profil.");
    }
  };

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Se déconnecter",
        style: "destructive",
        onPress: () => logout(),
      },
    ]);
  };

  const getRoleColor = () => {
    switch (userType) {
      case "patient":
        return "#14B8A6";
      case "medecin":
        return "#3B82F6";
      case "admin":
        return "#EF4444";
      default:
        return "#666";
    }
  };

  const getRoleIcon = () => {
    switch (userType) {
      case "patient":
        return "person";
      case "medecin":
        return "medical";
      case "admin":
        return "shield";
      default:
        return "person";
    }
  };

  const getRoleLabel = () => {
    switch (userType) {
      case "patient":
        return "Patient";
      case "medecin":
        return currentUser?.profile?.specialite || "Médecin";
      case "admin":
        return currentUser?.profile?.role || "Administrateur";
      default:
        return "Utilisateur";
    }
  };

  const getProfileExtra = () => {
    if (!currentUser?.profile) return [];
    const p = currentUser.profile;
    if (userType === "patient") {
      return [
        {
          label: "Date de naissance",
          value: p.dateNaissance,
          icon: "calendar-outline",
        },
        { label: "Genre", value: p.genre, icon: "person-outline" },
        {
          label: "Groupe sanguin",
          value: p.groupeSanguin,
          icon: "water-outline",
        },
        { label: "Mutuelle", value: p.mutuelle, icon: "card-outline" },
        {
          label: "Allergies",
          value: p.allergies,
          icon: "alert-circle-outline",
        },
        { label: "Traitements", value: p.traitements, icon: "medkit-outline" },
      ].filter((item) => item.value);
    }
    if (userType === "medecin") {
      return [
        { label: "Spécialité", value: p.specialite, icon: "medical-outline" },
        { label: "Service", value: p.service, icon: "business-outline" },
        { label: "Expérience", value: p.experience, icon: "time-outline" },
        { label: "Diplôme", value: p.diplome, icon: "school-outline" },
        { label: "N° Ordre", value: p.ordre, icon: "ribbon-outline" },
        {
          label: "Disponibilité",
          value: p.disponible ? "Disponible" : "Indisponible",
          icon: "checkmark-circle-outline",
        },
      ].filter((item) => item.value !== undefined);
    }
    if (userType === "admin") {
      return [
        { label: "Rôle", value: p.role, icon: "shield-outline" },
        { label: "Service", value: p.service, icon: "business-outline" },
      ].filter((item) => item.value);
    }
    return [];
  };

  const profileExtra = getProfileExtra();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[getRoleColor(), getRoleColor() + "CC"]}
        style={styles.header}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: "rgba(255,255,255,0.25)" },
              ]}
            >
              <Ionicons name={getRoleIcon()} size={44} color="#fff" />
            </View>
          </View>

          <Text style={styles.profileName}>{userInfo.name}</Text>
          <Text style={styles.profileRole}>{getRoleLabel()}</Text>

          {/* Badge rôle */}
          <View style={styles.roleBadge}>
            <Ionicons name={getRoleIcon()} size={13} color={getRoleColor()} />
            <Text style={[styles.roleBadgeText, { color: getRoleColor() }]}>
              {userType === "patient"
                ? "Patient"
                : userType === "medecin"
                  ? "Médecin"
                  : "Administrateur"}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* ── Informations de base ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Informations personnelles</Text>
            <TouchableOpacity
              style={[styles.editButton, { borderColor: getRoleColor() }]}
              onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
            >
              <Ionicons
                name={isEditing ? "checkmark" : "create-outline"}
                size={16}
                color={getRoleColor()}
              />
              <Text style={[styles.editButtonText, { color: getRoleColor() }]}>
                {isEditing ? "Sauvegarder" : "Modifier"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoContainer}>
            {/* Nom */}
            <View style={styles.infoRow}>
              <View style={styles.infoIconWrapper}>
                <Ionicons name="person-outline" size={16} color="#9CA3AF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nom complet</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.infoInput}
                    value={userInfo.name}
                    onChangeText={(text) =>
                      setUserInfo((prev) => ({ ...prev, name: text }))
                    }
                    autoCapitalize="words"
                  />
                ) : (
                  <Text style={styles.infoValue}>{userInfo.name}</Text>
                )}
              </View>
            </View>

            {/* Email */}
            <View style={styles.infoRow}>
              <View style={styles.infoIconWrapper}>
                <Ionicons name="mail-outline" size={16} color="#9CA3AF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{userInfo.email}</Text>
              </View>
            </View>

            {/* Téléphone */}
            <View style={styles.infoRow}>
              <View style={styles.infoIconWrapper}>
                <Ionicons name="call-outline" size={16} color="#9CA3AF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Téléphone</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.infoInput}
                    value={userInfo.phone}
                    onChangeText={(text) =>
                      setUserInfo((prev) => ({ ...prev, phone: text }))
                    }
                    keyboardType="phone-pad"
                  />
                ) : (
                  <Text style={styles.infoValue}>{userInfo.phone}</Text>
                )}
              </View>
            </View>

            {/* Adresse */}
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <View style={styles.infoIconWrapper}>
                <Ionicons name="location-outline" size={16} color="#9CA3AF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Adresse</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.infoInput}
                    value={userInfo.address}
                    onChangeText={(text) =>
                      setUserInfo((prev) => ({ ...prev, address: text }))
                    }
                  />
                ) : (
                  <Text style={styles.infoValue}>{userInfo.address}</Text>
                )}
              </View>
            </View>
          </View>

          {isEditing && (
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: getRoleColor() }]}
              onPress={handleSave}
            >
              <Ionicons name="checkmark-circle" size={18} color="#fff" />
              <Text style={styles.saveButtonText}>
                Enregistrer les modifications
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Informations spécifiques au rôle ── */}
        {profileExtra.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {userType === "patient"
                ? "Dossier médical"
                : userType === "medecin"
                  ? "Informations professionnelles"
                  : "Informations administratives"}
            </Text>
            <View style={styles.infoContainer}>
              {profileExtra.map((item, index) => (
                <View
                  key={item.label}
                  style={[
                    styles.infoRow,
                    index === profileExtra.length - 1 && {
                      borderBottomWidth: 0,
                    },
                  ]}
                >
                  <View style={styles.infoIconWrapper}>
                    <Ionicons name={item.icon} size={16} color="#9CA3AF" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>{item.label}</Text>
                    <Text
                      style={[
                        styles.infoValue,
                        item.value === "Disponible" && {
                          color: "#10B981",
                          fontWeight: "700",
                        },
                        item.value === "Indisponible" && {
                          color: "#EF4444",
                          fontWeight: "700",
                        },
                      ]}
                    >
                      {item.value}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Préférences</Text>

          <View style={styles.preferenceRow}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceTitle}>Notifications</Text>
              <Text style={styles.preferenceDescription}>
                Recevoir des notifications pour vos tickets
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#E5E7EB", true: getRoleColor() + "40" }}
              thumbColor={notifications ? getRoleColor() : "#9CA3AF"}
            />
          </View>

          <View style={styles.preferenceRow}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceTitle}>Mode sombre</Text>
              <Text style={styles.preferenceDescription}>
                Activer le thème sombre de l'application
              </Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#E5E7EB", true: getRoleColor() + "40" }}
              thumbColor={darkMode ? getRoleColor() : "#9CA3AF"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sécurité</Text>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="key" size={20} color="#666" />
            <Text style={styles.menuItemText}>Changer le mot de passe</Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="finger-print" size={20} color="#666" />
            <Text style={styles.menuItemText}>
              Authentification biométrique
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À propos</Text>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#6B7280"
            />
            <Text style={styles.menuItemText}>Version de l'application</Text>
            <Text style={styles.menuItemSubtext}>v1.0.0</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="document-text-outline" size={20} color="#6B7280" />
            <Text style={styles.menuItemText}>Conditions d'utilisation</Text>
            <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color="#6B7280"
            />
            <Text style={styles.menuItemText}>
              Politique de confidentialité
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color="#EF4444" />
          <Text style={styles.logoutButtonText}>Se déconnecter</Text>
        </TouchableOpacity>
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
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  profileHeader: {
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 14,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.4)",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    marginBottom: 12,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  roleBadgeText: {
    fontSize: 13,
    fontWeight: "700",
  },

  // ── Contenu ──
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 5,
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
  infoContainer: {},
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    gap: 12,
  },
  infoIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "500",
  },
  infoInput: {
    fontSize: 15,
    color: "#111827",
    borderBottomWidth: 1.5,
    borderBottomColor: "#14B8A6",
    paddingVertical: 4,
  },
  saveButton: {
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  preferenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  preferenceInfo: {
    flex: 1,
    marginRight: 12,
  },
  preferenceTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 3,
  },
  preferenceDescription: {
    fontSize: 13,
    color: "#9CA3AF",
    lineHeight: 17,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    gap: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: 15,
    color: "#374151",
    fontWeight: "500",
  },
  menuItemSubtext: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    borderRadius: 14,
    padding: 16,
    marginBottom: 30,
    borderWidth: 1.5,
    borderColor: "#FECACA",
    gap: 10,
  },
  logoutButtonText: {
    color: "#EF4444",
    fontSize: 16,
    fontWeight: "700",
  },
});
