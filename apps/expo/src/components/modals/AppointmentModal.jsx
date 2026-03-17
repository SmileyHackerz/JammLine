import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useJammLine } from '../../context/JammLineContext';

export default function AppointmentModal({ visible, onClose, patient }) {
  const { reservations, setReservations, notifications, setNotifications } = useJammLine();
  const [selectedAction, setSelectedAction] = useState(null);

  // Si aucun patient n'est sélectionné, on ne rend pas le modal
  if (!visible || !patient) {
    return null;
  }

  const handleCallPatient = () => {
    Alert.alert(
      'Appeler le patient',
      `Voulez-vous appeler ${patient.clientNom} pour consultation?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Appeler', 
          onPress: () => {
            // Mettre en consultation
            setReservations(prev => 
              prev.map(r => 
                r.id === patient.id 
                  ? { ...r, status: 'en_consultation' }
                  : r
              )
            );
            
            // Notification
            setNotifications(prev => [
              {
                id: Date.now(),
                message: `Dr. appelle ${patient.clientNom} pour consultation`,
                type: 'info',
                read: false,
                category: 'consultation',
              },
              ...prev,
            ]);
            
            Alert.alert('Patient appelé', `${patient.clientNom} a été appelé pour consultation`);
            onClose();
          }
        }
      ]
    );
  };

  const handleFinishConsultation = () => {
    Alert.alert(
      'Terminer consultation',
      `Terminer la consultation de ${patient.clientNom}?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Terminer', 
          onPress: () => {
            // Marquer comme terminé
            setReservations(prev => 
              prev.map(r => 
                r.id === patient.id 
                  ? { ...r, status: 'termine' }
                  : r
              )
            );
            
            // Notification
            setNotifications(prev => [
              {
                id: Date.now(),
                message: `Consultation terminée pour ${patient.clientNom}`,
                type: 'success',
                read: false,
                category: 'consultation',
              },
              ...prev,
            ]);
            
            Alert.alert('Consultation terminée', `La consultation de ${patient.clientNom} est terminée`);
            onClose();
          }
        }
      ]
    );
  };

  const handlePostponePatient = () => {
    Alert.alert(
      'Reporter le patient',
      `Reporter ${patient.clientNom} à plus tard?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Reporter', 
          onPress: () => {
            // Remettre en attente avec une position plus basse
            setReservations(prev => 
              prev.map(r => 
                r.id === patient.id 
                  ? { ...r, status: 'en_attente', position: r.position + 5 }
                  : r
              )
            );
            
            setNotifications(prev => [
              {
                id: Date.now(),
                message: `${patient.clientNom} a été reporté`,
                type: 'warning',
                read: false,
                category: 'consultation',
              },
              ...prev,
            ]);
            
            Alert.alert('Patient reporté', `${patient.clientNom} a été reporté dans la file`);
            onClose();
          }
        }
      ]
    );
  };

  const handleEmergencyPriority = () => {
    Alert.alert(
      'Priorité d\'urgence',
      `Mettre ${patient.clientNom} en priorité urgente?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Urgent', 
          style: 'destructive',
          onPress: () => {
            // Mettre en priorité urgente
            setReservations(prev => 
              prev.map(r => 
                r.id === patient.id 
                  ? { ...r, priorite: 'urgente', position: 1 }
                  : r.status === 'en_attente' && r.id !== patient.id
                    ? { ...r, position: r.position + 1 }
                    : r
              )
            );
            
            setNotifications(prev => [
              {
                id: Date.now(),
                message: `${patient.clientNom} mis en priorité urgente`,
                type: 'error',
                read: false,
                category: 'consultation',
              },
              ...prev,
            ]);
            
            Alert.alert('Priorité urgente', `${patient.clientNom} a été mis en priorité urgente`);
            onClose();
          }
        }
      ]
    );
  };

  const handleViewMedicalHistory = () => {
    Alert.alert(
      'Historique médical',
      `Afficher l\'historique médical de ${patient.clientNom}`,
      [
        { text: 'OK', onPress: () => {
          // Simulation d'affichage de l'historique
          Alert.alert('Historique', 'Fonctionnalité en développement - affichage de l\'historique médical complet');
        }}
      ]
    );
  };

  const handleSendReminder = () => {
    setNotifications(prev => [
      {
        id: Date.now(),
        message: `Rappel envoyé à ${patient.clientNom}`,
        type: 'info',
        read: false,
        category: 'consultation',
      },
      ...prev,
    ]);
    
    Alert.alert('Rappel envoyé', `Un rappel a été envoyé à ${patient.clientNom}`);
  };

  const renderActionButton = (icon, title, onPress, color = '#3B82F6', disabled = false) => (
    <TouchableOpacity
      style={[styles.actionButton, { backgroundColor: disabled ? '#ccc' : color }]}
      onPress={onPress}
      disabled={disabled}
    >
      <Ionicons name={icon} size={24} color="#fff" />
      <Text style={styles.actionButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  const renderPatientInfo = () => (
    <View style={styles.patientInfoCard}>
      <View style={styles.patientHeader}>
        <View style={styles.patientAvatar}>
          <Ionicons name="person" size={32} color="#3B82F6" />
        </View>
        <View style={styles.patientDetails}>
          <Text style={styles.patientName}>{patient.clientNom}</Text>
          <Text style={styles.patientService}>{patient.service}</Text>
          <View style={styles.patientMeta}>
            <Text style={styles.patientId}>#{patient.id}</Text>
            <View style={[
              styles.priorityBadge,
              patient.priorite === 'urgente' ? styles.priorityUrgent : styles.priorityNormal
            ]}>
              <Text style={[
                styles.priorityText,
                patient.priorite === 'urgente' ? styles.priorityUrgentText : styles.priorityNormalText
              ]}>
                {patient.priorite === 'urgente' ? 'Urgent' : 'Normal'}
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.patientInfoGrid}>
        <View style={styles.infoItem}>
          <Ionicons name="medical" size={16} color="#666" />
          <Text style={styles.infoLabel}>Motif:</Text>
          <Text style={styles.infoValue}>{patient.motif}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="time" size={16} color="#666" />
          <Text style={styles.infoLabel}>Temps:</Text>
          <Text style={styles.infoValue}>{patient.temps}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="calendar" size={16} color="#666" />
          <Text style={styles.infoLabel}>Créé:</Text>
          <Text style={styles.infoValue}>{patient.dateCreation}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="people" size={16} color="#666" />
          <Text style={styles.infoLabel}>Position:</Text>
          <Text style={styles.infoValue}>#{patient.position}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Gestion du Patient</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {renderPatientInfo()}

            <View style={styles.actionsSection}>
              <Text style={styles.sectionTitle}>Actions immédiates</Text>
              <View style={styles.actionsGrid}>
                {patient.status === 'en_attente' && renderActionButton(
                  'call', 'Appeler', handleCallPatient, '#10B981'
                )}
                {patient.status === 'en_consultation' && renderActionButton(
                  'checkmark', 'Terminer', handleFinishConsultation, '#10B981'
                )}
                {patient.status === 'en_attente' && renderActionButton(
                  'time', 'Reporter', handlePostponePatient, '#F59E0B'
                )}
                {patient.priorite !== 'urgente' && renderActionButton(
                  'warning', 'Urgence', handleEmergencyPriority, '#EF4444'
                )}
              </View>
            </View>

            <View style={styles.actionsSection}>
              <Text style={styles.sectionTitle}>Actions supplémentaires</Text>
              <View style={styles.secondaryActionsGrid}>
                {renderActionButton(
                  'document-text', 'Historique', handleViewMedicalHistory, '#6366F1'
                )}
                {renderActionButton(
                  'notifications', 'Rappel', handleSendReminder, '#8B5CF6'
                )}
                {renderActionButton(
                  'chatbubble', 'Message', () => Alert.alert('Message', 'Fonctionnalité de messagerie en cours'), '#14B8A6'
                )}
                {renderActionButton(
                  'print', 'Imprimer', () => Alert.alert('Impression', 'Fonctionnalité d\'impression en cours'), '#EC4899'
                )}
              </View>
            </View>

            <View style={styles.notesSection}>
              <Text style={styles.sectionTitle}>Notes rapides</Text>
              <View style={styles.notesCard}>
                <Text style={styles.notesPlaceholder}>
                  Cliquez ici pour ajouter des notes sur ce patient...
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={onClose}
            >
              <Text style={styles.closeModalButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '95%',
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    flex: 1,
    padding: 20,
  },
  patientInfoCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  patientAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  patientService: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  patientMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  patientId: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityUrgent: {
    backgroundColor: '#fee2e2',
  },
  priorityNormal: {
    backgroundColor: '#f0f9ff',
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  priorityUrgentText: {
    color: '#dc2626',
  },
  priorityNormalText: {
    color: '#0369a1',
  },
  patientInfoGrid: {
    gap: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    minWidth: 50,
  },
  infoValue: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  actionsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  secondaryActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 70,
    borderRadius: 12,
    gap: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  notesSection: {
    marginBottom: 20,
  },
  notesCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    minHeight: 60,
  },
  notesPlaceholder: {
    color: '#999',
    fontStyle: 'italic',
    fontSize: 14,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  closeModalButton: {
    backgroundColor: '#6B7280',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
