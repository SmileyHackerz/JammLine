import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@monprojet/shared";

const ROLES = [
  { key: "patient", label: "Patient", icon: "person", color: "#14B8A6" },
  { key: "medecin", label: "Médecin", icon: "medical", color: "#3B82F6" },
  { key: "admin", label: "Admin", icon: "shield", color: "#EF4444" },
];

const DEMO_ACCOUNTS = [
  {
    role: "patient",
    label: "Amadou Diallo",
    email: "patient1@test.com",
    password: "patient123",
    icon: "person",
    color: "#14B8A6",
  },
  {
    role: "medecin",
    label: "Dr. Marie Diop",
    email: "medecin1@test.com",
    password: "medecin123",
    icon: "medical",
    color: "#3B82F6",
  },
  {
    role: "admin",
    label: "Aliou Faye",
    email: "admin@test.com",
    password: "admin123",
    icon: "shield",
    color: "#EF4444",
  },
];

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("patient");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(
        "Champs manquants",
        "Veuillez remplir l'email et le mot de passe.",
      );
      return;
    }

    setIsLoading(true);
    try {
      await login(email.trim(), password, selectedRole);
    } catch (error) {
      Alert.alert(
        "Connexion échouée",
        error.message || "Email, mot de passe ou rôle incorrect.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (account) => {
    setIsLoading(true);
    try {
      await login(account.email, account.password, account.role);
    } catch (error) {
      Alert.alert("Erreur", error.message || "Connexion rapide échouée.");
    } finally {
      setIsLoading(false);
    }
  };

  const activeRole = ROLES.find((r) => r.key === selectedRole);
  const gradientColors =
    selectedRole === "patient"
      ? ["#14B8A6", "#0D9488"]
      : selectedRole === "medecin"
        ? ["#3B82F6", "#2563EB"]
        : ["#EF4444", "#DC2626"];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient colors={gradientColors} style={styles.gradient}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── En-tête ── */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="medical" size={40} color="#fff" />
            </View>
            <Text style={styles.title}>JammLine</Text>
            <Text style={styles.subtitle}>
              Gestion de files d'attente médicales
            </Text>
          </View>

          {/* ── Formulaire ── */}
          <View style={styles.formContainer}>
            {/* Sélecteur de rôle */}
            <Text style={styles.sectionLabel}>Je suis un(e)</Text>
            <View style={styles.roleContainer}>
              {ROLES.map((role) => (
                <TouchableOpacity
                  key={role.key}
                  style={[
                    styles.roleButton,
                    selectedRole === role.key && {
                      backgroundColor: role.color,
                      borderColor: role.color,
                    },
                  ]}
                  onPress={() => setSelectedRole(role.key)}
                >
                  <Ionicons
                    name={role.icon}
                    size={18}
                    color={selectedRole === role.key ? "#fff" : "#999"}
                  />
                  <Text
                    style={[
                      styles.roleButtonText,
                      selectedRole === role.key && styles.roleButtonTextActive,
                    ]}
                  >
                    {role.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#999"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="exemple@email.com"
                  placeholderTextColor="#bbb"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Mot de passe */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mot de passe</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#999"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#bbb"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Bouton connexion */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                { backgroundColor: activeRole?.color || "#14B8A6" },
                isLoading && styles.disabledButton,
              ]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="log-in-outline" size={20} color="#fff" />
                  <Text style={styles.loginButtonText}>Se connecter</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Lien inscription */}
            <TouchableOpacity
              style={styles.registerLink}
              onPress={() => navigation.navigate("Register")}
              disabled={isLoading}
            >
              <Text style={styles.registerText}>
                Pas encore de compte ?{" "}
                <Text
                  style={[
                    styles.registerTextBold,
                    { color: activeRole?.color || "#14B8A6" },
                  ]}
                >
                  S'inscrire
                </Text>
              </Text>
            </TouchableOpacity>

            {/* ── Connexion rapide (démo) ── */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Connexion rapide (démo)</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.demoContainer}>
              {DEMO_ACCOUNTS.map((account) => (
                <TouchableOpacity
                  key={account.role}
                  style={[styles.demoButton, { borderColor: account.color }]}
                  onPress={() => handleQuickLogin(account)}
                  disabled={isLoading}
                >
                  <View
                    style={[
                      styles.demoIconContainer,
                      { backgroundColor: account.color },
                    ]}
                  >
                    <Ionicons name={account.icon} size={16} color="#fff" />
                  </View>
                  <View style={styles.demoInfo}>
                    <Text style={[styles.demoName, { color: account.color }]}>
                      {account.label}
                    </Text>
                    <Text style={styles.demoRole}>
                      {account.role === "patient"
                        ? "Patient"
                        : account.role === "medecin"
                          ? "Médecin"
                          : "Administrateur"}
                    </Text>
                  </View>
                  <Ionicons
                    name="arrow-forward"
                    size={16}
                    color={account.color}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Text style={styles.footerText}>JammLine v1.0.0 — Démo</Text>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    marginTop: 4,
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 8,
  },
  roleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    gap: 5,
  },
  roleButtonText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "600",
  },
  roleButtonTextActive: {
    color: "#fff",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 15,
    color: "#111827",
  },
  eyeButton: {
    padding: 4,
  },
  loginButton: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  registerLink: {
    alignItems: "center",
    marginTop: 16,
  },
  registerText: {
    color: "#6B7280",
    fontSize: 14,
  },
  registerTextBold: {
    fontWeight: "700",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "600",
    textAlign: "center",
  },
  demoContainer: {
    gap: 10,
  },
  demoButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    backgroundColor: "#FAFAFA",
    gap: 12,
  },
  demoIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  demoInfo: {
    flex: 1,
  },
  demoName: {
    fontSize: 14,
    fontWeight: "700",
  },
  demoRole: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 1,
  },
  footerText: {
    textAlign: "center",
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    marginTop: 20,
  },
});
