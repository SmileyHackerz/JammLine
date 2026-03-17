import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth, useApp } from "@monprojet/shared";

export default function NouveauTicketScreen() {
  const { services, createTicket } = useApp();
  const { userName } = useAuth();
  const navigation = useNavigation();

  const [selectedService, setSelectedService] = useState(null);
  const [step, setStep] = useState(1); // 1 = choisir service, 2 = infos patient, 3 = confirmation
  const [patientInfo, setPatientInfo] = useState({
    name: userName || "",
    phone: "",
    motif: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);

  // ─── Soumettre le ticket ──────────────────────────────────────────────────────
  const handleSubmitTicket = async () => {
    if (!selectedService) {
      Alert.alert("Erreur", "Veuillez sélectionner un service.");
      return;
    }
    if (!patientInfo.name.trim()) {
      Alert.alert("Erreur", "Veuillez entrer votre nom.");
      return;
    }

    setIsLoading(true);
    try {
      // Simuler un délai réseau
      await new Promise((resolve) => setTimeout(resolve, 800));

      const ticket = createTicket(
        { serviceId: selectedService.id },
        {
          name: patientInfo.name.trim(),
          phone: patientInfo.phone.trim(),
          motif: patientInfo.motif.trim() || "Consultation générale",
        },
      );

      setCreatedTicket(ticket);
      setStep(3);
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Impossible de créer le ticket. Veuillez réessayer.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedService(null);
    setPatientInfo({ name: userName || "", phone: "", motif: "" });
    setCreatedTicket(null);
    setStep(1);
  };

  const handleGoToDashboard = () => {
    navigation.navigate("Accueil");
  };

  // ─── Étape 3 : Confirmation ───────────────────────────────────────────────────
  if (step === 3 && createdTicket) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={["#14B8A6", "#0D9488"]}
          style={styles.confirmHeader}
        >
          <View style={styles.confirmIconWrapper}>
            <Ionicons name="checkmark-circle" size={64} color="#fff" />
          </View>
          <Text style={styles.confirmTitle}>Ticket créé !</Text>
          <Text style={styles.confirmSubtitle}>
            Votre ticket a bien été enregistré
          </Text>
        </LinearGradient>

        <ScrollView contentContainerStyle={styles.confirmContent}>
          {/* Numéro de ticket en évidence */}
          <View style={styles.ticketIdCard}>
            <Text style={styles.ticketIdLabel}>Numéro de ticket</Text>
            <Text style={styles.ticketIdValue}>{createdTicket.id}</Text>
            <View
              style={[
                styles.statusPill,
                { backgroundColor: "#FEF3C720", borderColor: "#F59E0B" },
              ]}
            >
              <Ionicons name="time" size={14} color="#F59E0B" />
              <Text style={[styles.statusPillText, { color: "#F59E0B" }]}>
                En attente
              </Text>
            </View>
          </View>

          {/* Détails du ticket */}
          <View style={styles.detailCard}>
            <Text style={styles.detailCardTitle}>Détails de votre demande</Text>

            <View style={styles.detailRow}>
              <View
                style={[
                  styles.detailIcon,
                  {
                    backgroundColor:
                      (selectedService?.color || "#14B8A6") + "20",
                  },
                ]}
              >
                <Ionicons
                  name="medical"
                  size={18}
                  color={selectedService?.color || "#14B8A6"}
                />
              </View>
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>Service</Text>
                <Text style={styles.detailValue}>{createdTicket.service}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: "#EFF6FF" }]}>
                <Ionicons name="person" size={18} color="#3B82F6" />
              </View>
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>Patient</Text>
                <Text style={styles.detailValue}>
                  {createdTicket.clientNom}
                </Text>
              </View>
            </View>

            {createdTicket.telephone ? (
              <View style={styles.detailRow}>
                <View
                  style={[styles.detailIcon, { backgroundColor: "#F0FDF4" }]}
                >
                  <Ionicons name="call" size={18} color="#10B981" />
                </View>
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>Téléphone</Text>
                  <Text style={styles.detailValue}>
                    {createdTicket.telephone}
                  </Text>
                </View>
              </View>
            ) : null}

            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: "#FFFBEB" }]}>
                <Ionicons name="people" size={18} color="#F59E0B" />
              </View>
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>Position dans la file</Text>
                <Text style={styles.detailValue}>
                  {createdTicket.position === 1
                    ? "Vous êtes le prochain !"
                    : `${createdTicket.position}e position`}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: "#FFF7ED" }]}>
                <Ionicons name="time" size={18} color="#F59E0B" />
              </View>
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>Temps d'attente estimé</Text>
                <Text style={styles.detailValue}>{createdTicket.temps}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: "#F9FAFB" }]}>
                <Ionicons name="document-text" size={18} color="#6B7280" />
              </View>
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>Motif</Text>
                <Text style={styles.detailValue}>{createdTicket.motif}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: "#F9FAFB" }]}>
                <Ionicons name="alarm" size={18} color="#6B7280" />
              </View>
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>Heure de création</Text>
                <Text style={styles.detailValue}>
                  {createdTicket.dateCreation}
                </Text>
              </View>
            </View>
          </View>

          {/* Boutons */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleGoToDashboard}
            activeOpacity={0.85}
          >
            <Ionicons name="home" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Suivre mon ticket</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleReset}
            activeOpacity={0.8}
          >
            <Ionicons name="add-circle-outline" size={20} color="#14B8A6" />
            <Text style={styles.secondaryButtonText}>
              Prendre un autre ticket
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <LinearGradient colors={["#14B8A6", "#0D9488"]} style={styles.header}>
        <Text style={styles.headerTitle}>Nouveau Ticket</Text>
        <Text style={styles.headerSubtitle}>
          Rejoignez la file d'attente en quelques secondes
        </Text>

        {/* Indicateur d'étapes */}
        <View style={styles.stepsIndicator}>
          {[1, 2].map((s) => (
            <View key={s} style={styles.stepItem}>
              <View
                style={[
                  styles.stepDot,
                  step >= s ? styles.stepDotActive : styles.stepDotInactive,
                ]}
              >
                {step > s ? (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                ) : (
                  <Text
                    style={[
                      styles.stepDotText,
                      step >= s
                        ? styles.stepDotTextActive
                        : styles.stepDotTextInactive,
                    ]}
                  >
                    {s}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  step >= s ? styles.stepLabelActive : styles.stepLabelInactive,
                ]}
              >
                {s === 1 ? "Service" : "Informations"}
              </Text>
              {s < 2 && (
                <View
                  style={[
                    styles.stepLine,
                    step > s ? styles.stepLineActive : styles.stepLineInactive,
                  ]}
                />
              )}
            </View>
          ))}
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ══════════════════════════════════════════════════
            ÉTAPE 1 : Sélection du service
        ══════════════════════════════════════════════════ */}
        {step === 1 && (
          <View>
            <Text style={styles.stepTitle}>Choisissez un service</Text>
            <Text style={styles.stepDescription}>
              Sélectionnez le service médical pour votre consultation
            </Text>

            <View style={styles.servicesGrid}>
              {services.map((service) => {
                const isSelected = selectedService?.id === service.id;
                const isDisabled = !service.disponible;

                return (
                  <TouchableOpacity
                    key={service.id}
                    style={[
                      styles.serviceCard,
                      isSelected && styles.serviceCardSelected,
                      isSelected && { borderColor: service.color },
                      isDisabled && styles.serviceCardDisabled,
                    ]}
                    onPress={() => {
                      if (!isDisabled) setSelectedService(service);
                    }}
                    activeOpacity={isDisabled ? 1 : 0.8}
                  >
                    {/* Icône */}
                    <View
                      style={[
                        styles.serviceIconBg,
                        {
                          backgroundColor: isDisabled
                            ? "#F3F4F6"
                            : service.color + "20",
                        },
                      ]}
                    >
                      <Ionicons
                        name={service.icon}
                        size={28}
                        color={isDisabled ? "#D1D5DB" : service.color}
                      />
                    </View>

                    {/* Nom */}
                    <Text
                      style={[
                        styles.serviceName,
                        isDisabled && styles.serviceNameDisabled,
                      ]}
                      numberOfLines={2}
                    >
                      {service.name}
                    </Text>

                    {/* Description */}
                    <Text style={styles.serviceDescription} numberOfLines={2}>
                      {service.description}
                    </Text>

                    {/* Footer */}
                    <View style={styles.serviceFooter}>
                      {isDisabled ? (
                        <View style={styles.unavailablePill}>
                          <Ionicons
                            name="close-circle"
                            size={12}
                            color="#EF4444"
                          />
                          <Text style={styles.unavailableText}>
                            Indisponible
                          </Text>
                        </View>
                      ) : (
                        <>
                          <View style={styles.serviceInfoRow}>
                            <Ionicons
                              name="people-outline"
                              size={12}
                              color="#9CA3AF"
                            />
                            <Text style={styles.serviceInfoText}>
                              {service.enAttente} en attente
                            </Text>
                          </View>
                          <View style={styles.serviceInfoRow}>
                            <Ionicons
                              name="time-outline"
                              size={12}
                              color="#9CA3AF"
                            />
                            <Text style={styles.serviceInfoText}>
                              ~{service.attente}
                            </Text>
                          </View>
                        </>
                      )}
                    </View>

                    {/* Checkmark si sélectionné */}
                    {isSelected && (
                      <View
                        style={[
                          styles.selectedCheckmark,
                          { backgroundColor: service.color },
                        ]}
                      >
                        <Ionicons name="checkmark" size={14} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Bouton suivant */}
            <TouchableOpacity
              style={[
                styles.nextButton,
                !selectedService && styles.nextButtonDisabled,
                selectedService && { backgroundColor: selectedService.color },
              ]}
              onPress={() => selectedService && setStep(2)}
              disabled={!selectedService}
              activeOpacity={0.85}
            >
              <Text style={styles.nextButtonText}>
                {selectedService
                  ? `Continuer avec ${selectedService.name}`
                  : "Sélectionnez un service"}
              </Text>
              {selectedService && (
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* ══════════════════════════════════════════════════
            ÉTAPE 2 : Informations patient
        ══════════════════════════════════════════════════ */}
        {step === 2 && (
          <View>
            {/* Rappel du service choisi */}
            {selectedService && (
              <View
                style={[
                  styles.serviceReminder,
                  { borderLeftColor: selectedService.color },
                ]}
              >
                <View
                  style={[
                    styles.serviceReminderIcon,
                    { backgroundColor: selectedService.color + "20" },
                  ]}
                >
                  <Ionicons
                    name={selectedService.icon}
                    size={20}
                    color={selectedService.color}
                  />
                </View>
                <View style={styles.serviceReminderInfo}>
                  <Text style={styles.serviceReminderLabel}>
                    Service sélectionné
                  </Text>
                  <Text style={styles.serviceReminderName}>
                    {selectedService.name}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setStep(1)}
                  style={styles.changeServiceBtn}
                >
                  <Text
                    style={[
                      styles.changeServiceText,
                      { color: selectedService.color },
                    ]}
                  >
                    Modifier
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <Text style={styles.stepTitle}>Vos informations</Text>
            <Text style={styles.stepDescription}>
              Ces informations seront utilisées pour vous identifier dans la
              file d'attente
            </Text>

            {/* Nom complet */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Nom complet <Text style={styles.inputRequired}>*</Text>
              </Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="person-outline"
                  size={18}
                  color="#9CA3AF"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Votre nom complet"
                  placeholderTextColor="#9CA3AF"
                  value={patientInfo.name}
                  onChangeText={(text) =>
                    setPatientInfo((prev) => ({ ...prev, name: text }))
                  }
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Téléphone */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Numéro de téléphone{" "}
                <Text style={styles.inputOptional}>(optionnel)</Text>
              </Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="call-outline"
                  size={18}
                  color="#9CA3AF"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="+221 77 000 00 00"
                  placeholderTextColor="#9CA3AF"
                  value={patientInfo.phone}
                  onChangeText={(text) =>
                    setPatientInfo((prev) => ({ ...prev, phone: text }))
                  }
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Motif */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Motif de consultation{" "}
                <Text style={styles.inputOptional}>(optionnel)</Text>
              </Text>
              <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Décrivez brièvement votre motif de consultation..."
                  placeholderTextColor="#9CA3AF"
                  value={patientInfo.motif}
                  onChangeText={(text) =>
                    setPatientInfo((prev) => ({ ...prev, motif: text }))
                  }
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Récapitulatif */}
            {selectedService && patientInfo.name.trim() && (
              <View style={styles.summaryCard}>
                <View style={styles.summaryHeader}>
                  <Ionicons name="receipt" size={18} color="#14B8A6" />
                  <Text style={styles.summaryTitle}>Récapitulatif</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Service</Text>
                  <Text style={styles.summaryValue}>
                    {selectedService.name}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Patient</Text>
                  <Text style={styles.summaryValue}>{patientInfo.name}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Temps estimé</Text>
                  <Text style={styles.summaryValue}>
                    ~{selectedService.attente}
                  </Text>
                </View>
                <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
                  <Text style={styles.summaryLabel}>En attente</Text>
                  <Text style={styles.summaryValue}>
                    {selectedService.enAttente} personnes
                  </Text>
                </View>
              </View>
            )}

            {/* Boutons navigation */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setStep(1)}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back" size={18} color="#6B7280" />
                <Text style={styles.backButtonText}>Retour</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (!patientInfo.name.trim() || isLoading) &&
                    styles.submitButtonDisabled,
                  selectedService && { backgroundColor: selectedService.color },
                ]}
                onPress={handleSubmitTicket}
                disabled={!patientInfo.name.trim() || isLoading}
                activeOpacity={0.85}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Ionicons name="ticket" size={18} color="#fff" />
                    <Text style={styles.submitButtonText}>
                      Créer mon ticket
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
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
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 20,
  },

  // ── Indicateur d'étapes ──────────────────────────────────────────────────────
  stepsIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotActive: {
    backgroundColor: "#fff",
  },
  stepDotInactive: {
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  stepDotText: {
    fontSize: 13,
    fontWeight: "bold",
  },
  stepDotTextActive: {
    color: "#14B8A6",
  },
  stepDotTextInactive: {
    color: "#fff",
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },
  stepLabelActive: {
    color: "#fff",
  },
  stepLabelInactive: {
    color: "rgba(255,255,255,0.6)",
  },
  stepLine: {
    width: 30,
    height: 2,
    marginHorizontal: 8,
    borderRadius: 1,
  },
  stepLineActive: {
    backgroundColor: "#fff",
  },
  stepLineInactive: {
    backgroundColor: "rgba(255,255,255,0.35)",
  },

  // ── Contenu ──────────────────────────────────────────────────────────────────
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
    marginTop: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
    lineHeight: 20,
  },

  // ── Grille des services ───────────────────────────────────────────────────────
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  serviceCard: {
    width: "47.5%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    position: "relative",
  },
  serviceCardSelected: {
    backgroundColor: "#F0FDFA",
    shadowColor: "#14B8A6",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  serviceCardDisabled: {
    backgroundColor: "#F9FAFB",
    opacity: 0.7,
  },
  serviceIconBg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
    lineHeight: 18,
  },
  serviceNameDisabled: {
    color: "#9CA3AF",
  },
  serviceDescription: {
    fontSize: 11,
    color: "#9CA3AF",
    lineHeight: 15,
    marginBottom: 10,
  },
  serviceFooter: {
    gap: 4,
  },
  unavailablePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  unavailableText: {
    fontSize: 11,
    color: "#EF4444",
    fontWeight: "600",
  },
  serviceInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  serviceInfoText: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  selectedCheckmark: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Bouton suivant ────────────────────────────────────────────────────────────
  nextButton: {
    backgroundColor: "#14B8A6",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#14B8A6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 10,
  },
  nextButtonDisabled: {
    backgroundColor: "#D1D5DB",
    shadowColor: "transparent",
    elevation: 0,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  // ── Rappel du service ─────────────────────────────────────────────────────────
  serviceReminder: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderLeftWidth: 4,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  serviceReminderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceReminderInfo: {
    flex: 1,
  },
  serviceReminderLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  serviceReminderName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginTop: 1,
  },
  changeServiceBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  changeServiceText: {
    fontSize: 13,
    fontWeight: "600",
  },

  // ── Inputs ────────────────────────────────────────────────────────────────────
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  inputRequired: {
    color: "#EF4444",
  },
  inputOptional: {
    color: "#9CA3AF",
    fontWeight: "400",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "#F9FAFB",
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 15,
    color: "#111827",
  },
  textAreaWrapper: {
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  textArea: {
    paddingVertical: 0,
    minHeight: 70,
    textAlignVertical: "top",
  },

  // ── Récapitulatif ─────────────────────────────────────────────────────────────
  summaryCard: {
    backgroundColor: "#F0FDFA",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#CCFBF1",
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0D9488",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#CCFBF1",
  },
  summaryLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },

  // ── Boutons bas de page ───────────────────────────────────────────────────────
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 30,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
    gap: 6,
  },
  backButtonText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "600",
  },
  submitButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 14,
    backgroundColor: "#14B8A6",
    gap: 8,
    shadowColor: "#14B8A6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: "#D1D5DB",
    shadowColor: "transparent",
    elevation: 0,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  // ── Écran de confirmation ─────────────────────────────────────────────────────
  confirmHeader: {
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  confirmIconWrapper: {
    marginBottom: 16,
  },
  confirmTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
  },
  confirmSubtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.85)",
  },
  confirmContent: {
    padding: 20,
    paddingBottom: 40,
  },
  ticketIdCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#14B8A6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#E0F7F4",
  },
  ticketIdLabel: {
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "500",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  ticketIdValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#14B8A6",
    marginBottom: 14,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 6,
  },
  statusPillText: {
    fontSize: 13,
    fontWeight: "700",
  },
  detailCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  detailCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    gap: 14,
  },
  detailIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  detailInfo: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  primaryButton: {
    backgroundColor: "#14B8A6",
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 12,
    shadowColor: "#14B8A6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: "#14B8A6",
    backgroundColor: "#fff",
  },
  secondaryButtonText: {
    color: "#14B8A6",
    fontSize: 15,
    fontWeight: "600",
  },
});
