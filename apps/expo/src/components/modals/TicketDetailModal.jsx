import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useJammLine } from '../../context/JammLineContext';

export default function TicketDetailModal() {
  const {
    selectedTicket,
    setSelectedTicket,
    updateTicketStatus,
    reservations,
  } = useJammLine();

  if (!selectedTicket) return null;

  const ticketData = reservations.find(r => r.id === selectedTicket);
  if (!ticketData) return null;

  const handleStatusChange = (newStatus) => {
    updateTicketStatus(selectedTicket, newStatus);
    setSelectedTicket(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'en_attente': return '#F59E0B';
      case 'en_consultation': return '#3B82F6';
      case 'termine': return '#10B981';
      case 'annule': return '#EF4444';
      default: return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'en_attente': return 'En attente';
      case 'en_consultation': return 'En consultation';
      case 'termine': return 'Terminé';
      case 'annule': return 'Annulé';
      default: return status;
    }
  };

  return (
    <Modal
      visible={!!selectedTicket}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setSelectedTicket(null)}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Détails du Ticket</Text>
          <TouchableOpacity onPress={() => setSelectedTicket(null)}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.ticketHeader}>
            <View style={styles.ticketNumber}>
              <Text style={styles.ticketNumberText}>#{ticketData.id}</Text>
            </View>
            <View style={[styles.ticketStatus, { backgroundColor: getStatusColor(ticketData.status) }]}>
              <Text style={styles.statusText}>{getStatusText(ticketData.status)}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations du patient</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nom:</Text>
              <Text style={styles.infoValue}>{ticketData.patientName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Téléphone:</Text>
              <Text style={styles.infoValue}>{ticketData.patientPhone}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations du ticket</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Service:</Text>
              <Text style={styles.infoValue}>{ticketData.service}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Position:</Text>
              <Text style={styles.infoValue}>{ticketData.position}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Priorité:</Text>
              <Text style={styles.infoValue}>{ticketData.priority}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Temps estimé:</Text>
              <Text style={styles.infoValue}>{ticketData.estimatedTime} min</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Créé le:</Text>
              <Text style={styles.infoValue}>
                {new Date(ticketData.createdAt).toLocaleDateString('fr-FR')} à{' '}
                {new Date(ticketData.createdAt).toLocaleTimeString('fr-FR')}
              </Text>
            </View>
          </View>

          {ticketData.motif && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Motif de consultation</Text>
              <Text style={styles.motifText}>{ticketData.motif}</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          {ticketData.status === 'en_attente' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleStatusChange('en_consultation')}
            >
              <Ionicons name="play" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Commencer consultation</Text>
            </TouchableOpacity>
          )}
          
          {ticketData.status === 'en_consultation' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleStatusChange('termine')}
            >
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Terminer consultation</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelActionButton]}
            onPress={() => handleStatusChange('annule')}
          >
            <Ionicons name="close" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    padding: 20,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  ticketNumber: {
    backgroundColor: '#14B8A6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  ticketNumberText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  ticketStatus: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  motifText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#14B8A6',
    padding: 15,
    borderRadius: 8,
    gap: 10,
  },
  cancelActionButton: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
