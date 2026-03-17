import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@monprojet/shared";

export default function SettingsScreen() {
  const { userType } = useAuth();
  const [settings, setSettings] = useState({
    notifications: true,
    soundEnabled: true,
    vibrationEnabled: true,
    autoRefresh: true,
    darkMode: false,
    language: "fr",
    timeZone: "UTC",
  });

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

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearCache = () => {
    Alert.alert(
      "Vider le cache",
      "Êtes-vous sûr de vouloir vider le cache de l'application ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Vider",
          onPress: () => Alert.alert("Succès", "Cache vidé avec succès"),
        },
      ],
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      "Réinitialiser les paramètres",
      "Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Réinitialiser",
          onPress: () => {
            setSettings({
              notifications: true,
              soundEnabled: true,
              vibrationEnabled: true,
              autoRefresh: true,
              darkMode: false,
              language: "fr",
              timeZone: "UTC",
            });
            Alert.alert("Succès", "Paramètres réinitialisés");
          },
        },
      ],
    );
  };

  const openLink = (url) => {
    Linking.openURL(url).catch(() => {
      Alert.alert("Erreur", "Impossible d'ouvrir le lien");
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[getRoleColor(), getRoleColor() + "DD"]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>Paramètres</Text>
          <Text style={styles.subtitle}>Personnalisez votre expérience</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Notifications push</Text>
              <Text style={styles.settingDescription}>
                Recevoir des notifications pour les mises à jour
              </Text>
            </View>
            <Switch
              value={settings.notifications}
              onValueChange={(value) =>
                handleSettingChange("notifications", value)
              }
              trackColor={{ false: "#E5E7EB", true: getRoleColor() + "40" }}
              thumbColor={settings.notifications ? getRoleColor() : "#9CA3AF"}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Son</Text>
              <Text style={styles.settingDescription}>
                Activer les sons de notification
              </Text>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={(value) =>
                handleSettingChange("soundEnabled", value)
              }
              trackColor={{ false: "#E5E7EB", true: getRoleColor() + "40" }}
              thumbColor={settings.soundEnabled ? getRoleColor() : "#9CA3AF"}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Vibration</Text>
              <Text style={styles.settingDescription}>
                Vibrer lors des notifications
              </Text>
            </View>
            <Switch
              value={settings.vibrationEnabled}
              onValueChange={(value) =>
                handleSettingChange("vibrationEnabled", value)
              }
              trackColor={{ false: "#E5E7EB", true: getRoleColor() + "40" }}
              thumbColor={
                settings.vibrationEnabled ? getRoleColor() : "#9CA3AF"
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Apparence</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Mode sombre</Text>
              <Text style={styles.settingDescription}>
                Activer le thème sombre de l'application
              </Text>
            </View>
            <Switch
              value={settings.darkMode}
              onValueChange={(value) => handleSettingChange("darkMode", value)}
              trackColor={{ false: "#E5E7EB", true: getRoleColor() + "40" }}
              thumbColor={settings.darkMode ? getRoleColor() : "#9CA3AF"}
            />
          </View>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="language" size={20} color="#666" />
            <View style={styles.menuItemInfo}>
              <Text style={styles.menuItemText}>Langue</Text>
              <Text style={styles.menuItemSubtext}>Français</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="time" size={20} color="#666" />
            <View style={styles.menuItemInfo}>
              <Text style={styles.menuItemText}>Fuseau horaire</Text>
              <Text style={styles.menuItemSubtext}>UTC+0</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Données et stockage</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Actualisation automatique</Text>
              <Text style={styles.settingDescription}>
                Mettre à jour les données automatiquement
              </Text>
            </View>
            <Switch
              value={settings.autoRefresh}
              onValueChange={(value) =>
                handleSettingChange("autoRefresh", value)
              }
              trackColor={{ false: "#E5E7EB", true: getRoleColor() + "40" }}
              thumbColor={settings.autoRefresh ? getRoleColor() : "#9CA3AF"}
            />
          </View>

          <TouchableOpacity style={styles.menuItem} onPress={handleClearCache}>
            <Ionicons name="trash" size={20} color="#666" />
            <Text style={styles.menuItemText}>Vider le cache</Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="download" size={20} color="#666" />
            <Text style={styles.menuItemText}>Exporter les données</Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => openLink("mailto:support@jammline.com")}
          >
            <Ionicons name="mail" size={20} color="#666" />
            <Text style={styles.menuItemText}>Contacter le support</Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => openLink("https://jammline.com/help")}
          >
            <Ionicons name="help-circle" size={20} color="#666" />
            <Text style={styles.menuItemText}>Centre d'aide</Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => openLink("https://jammline.com/feedback")}
          >
            <Ionicons name="chatbubble" size={20} color="#666" />
            <Text style={styles.menuItemText}>Envoyer un feedback</Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Légal</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => openLink("https://jammline.com/terms")}
          >
            <Ionicons name="document-text" size={20} color="#666" />
            <Text style={styles.menuItemText}>Conditions d'utilisation</Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => openLink("https://jammline.com/privacy")}
          >
            <Ionicons name="shield-checkmark" size={20} color="#666" />
            <Text style={styles.menuItemText}>
              Politique de confidentialité
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => openLink("https://jammline.com/licenses")}
          >
            <Ionicons name="code" size={20} color="#666" />
            <Text style={styles.menuItemText}>Licences open source</Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetSettings}
        >
          <Ionicons name="refresh" size={20} color="#EF4444" />
          <Text style={styles.resetButtonText}>
            Réinitialiser tous les paramètres
          </Text>
        </TouchableOpacity>

        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>JammLine v1.0.0</Text>
          <Text style={styles.buildText}>Build 2024.1.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: "#666",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemInfo: {
    flex: 1,
    marginLeft: 15,
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
  },
  menuItemSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  resetButtonText: {
    color: "#EF4444",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  versionInfo: {
    alignItems: "center",
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  buildText: {
    fontSize: 14,
    color: "#999",
  },
});
