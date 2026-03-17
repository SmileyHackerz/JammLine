import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useJammLine } from '../../context/JammLineContext';

export default function MedecinProfileModal({ visible, onClose }) {
  const { profile, setProfile, notifications, setNotifications } = useJammLine();
  const [editingProfile, setEditingProfile] = useState({
    nom: 'Dr. Marie Diop',
    email: 'marie.diop@jammline.com',
    telephone: '+221 77 123 45 67',
    specialite: 'Médecin généraliste',
    service: 'Consultation générale',
    experience: '8 ans',
    diplome: 'Doctorat en médecine',
    ordre: 'ORD-SEN-2020-1234',
    disponible: true,
    consultationDuration: '15 minutes',
    languages: ['Français', 'Anglais', 'Wolof'],
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setProfile(editingProfile);
    setIsEditing(false);
    setNotifications(prev => [
      {
        id: Date.now(),
        message: 'Profil médical mis à jour avec succès',
        type: 'success',
        read: false,
        category: 'profile',
      },
      ...prev,
    ]);
    Alert.alert('Succès', 'Votre profil médical a été mis à jour');
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const renderProfileField = (label, value, key, editable = true) => (
    <View style={styles.profileField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isEditing && editable ? (
        <TextInput
          style={styles.fieldInput}
          value={editingProfile[key]}
          onChangeText={(text) => setEditingProfile(prev => ({ ...prev, [key]: text }))}
          placeholder={label}
        />
      ) : (
        <Text style={styles.fieldValue}>{value || 'Non renseigné'}</Text>
      )}
    </View>
  );

  const renderSwitchField = (label, value, key) => (
    <View style={styles.switchField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isEditing ? (
        <Switch
          value={editingProfile[key]}
          onValueChange={(value) => setEditingProfile(prev => ({ ...prev, [key]: value }))}
          trackColor={{ false: '#ddd', true: '#14B8A6' }}
          thumbColor={editingProfile[key] ? '#fff' : '#f4f3f4'}
        />
      ) : (
        <View style={[
          styles.statusBadge,
          value ? styles.statusAvailable : styles.statusUnavailable
        ]}>
          <Text style={[
            styles.statusText,
            value ? styles.statusAvailableText : styles.statusUnavailableText
          ]}>
            {value ? 'Disponible' : 'Indisponible'}
          </Text>
        </View>
      )}
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
            <Text style={styles.modalTitle}>Profil Médical</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <Ionicons name="medical" size={48} color="#3B82F6" />
                <Text style={styles.avatarText}>DR</Text>
              </View>
              <Text style={styles.profileName}>{editingProfile.nom}</Text>
              <Text style={styles.profileSpecialty}>{editingProfile.specialite}</Text>
              <View style={[
                styles.availabilityBadge,
                editingProfile.disponible ? styles.availableBadge : styles.unavailableBadge
              ]}>
                <Ionicons 
                  name={editingProfile.disponible ? 'checkmark-circle' : 'close-circle'} 
                  size={16} 
                  color={editingProfile.disponible ? '#fff' : '#fff'} 
                />
                <Text style={styles.availabilityText}>
                  {editingProfile.disponible ? 'Disponible' : 'Indisponible'}
                </Text>
              </View>
            </View>

            <View style={styles.profileSection}>
              <Text style={styles.sectionTitle}>Informations professionnelles</Text>
              {renderProfileField('Nom complet', editingProfile.nom, 'nom')}
              {renderProfileField('Email professionnel', editingProfile.email, 'email')}
              {renderProfileField('Téléphone', editingProfile.telephone, 'telephone')}
              {renderProfileField('Spécialité', editingProfile.specialite, 'specialite')}
              {renderProfileField('Service', editingProfile.service, 'service')}
              {renderProfileField('Expérience', editingProfile.experience, 'experience')}
              {renderProfileField('Diplôme', editingProfile.diplome, 'diplome')}
              {renderProfileField('Numéro d\'ordre', editingProfile.ordre, 'ordre')}
            </View>

            <View style={styles.profileSection}>
              <Text style={styles.sectionTitle}>Paramètres de consultation</Text>
              {renderProfileField('Durée consultation', editingProfile.consultationDuration, 'consultationDuration')}
              {renderSwitchField('Disponibilité', editingProfile.disponible, 'disponible')}
              
              <View style={styles.languagesField}>
                <Text style={styles.fieldLabel}>Langues parlées</Text>
                {isEditing ? (
                  <View style={styles.languageTags}>
                    {editingProfile.languages.map((lang, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.languageTag}
                        onPress={() => {
                          const newLanguages = editingProfile.languages.filter((_, i) => i !== index);
                          setEditingProfile(prev => ({ ...prev, languages: newLanguages }));
                        }}
                      >
                        <Text style={styles.languageTagText}>{lang}</Text>
                        <Ionicons name="close" size={12} color="#fff" />
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <View style={styles.languageDisplay}>
                    {editingProfile.languages.map((lang, index) => (
                      <View key={index} style={styles.languageBadge}>
                        <Text style={styles.languageBadgeText}>{lang}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>

            <View style={styles.profileSection}>
              <Text style={styles.sectionTitle}>Statistiques</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>142</Text>
                  <Text style={styles.statLabel}>Patients ce mois</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>4.8</Text>
                  <Text style={styles.statLabel}>Note moyenne</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>98%</Text>
                  <Text style={styles.statLabel}>Taux de présence</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            {!isEditing ? (
              <>
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => setIsEditing(true)}
                >
                  <Ionicons name="create" size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>Modifier</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.closeModalButton]}
                  onPress={onClose}
                >
                  <Text style={styles.actionButtonText}>Fermer</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={handleCancel}
                >
                  <Ionicons name="close" size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.saveButton]}
                  onPress={handleSave}
                >
                  <Ionicons name="checkmark" size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>Enregistrer</Text>
                </TouchableOpacity>
              </>
            )}
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
    width: '90%',
    maxHeight: '85%',
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    position: 'relative',
  },
  avatarText: {
    position: 'absolute',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  profileSpecialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  availableBadge: {
    backgroundColor: '#10B981',
  },
  unavailableBadge: {
    backgroundColor: '#EF4444',
  },
  availabilityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  profileSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  profileField: {
    marginBottom: 15,
  },
  switchField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  fieldValue: {
    fontSize: 14,
    color: '#333',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusAvailable: {
    backgroundColor: '#dcfce7',
  },
  statusUnavailable: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  statusAvailableText: {
    color: '#166534',
  },
  statusUnavailableText: {
    color: '#dc2626',
  },
  languagesField: {
    marginBottom: 15,
  },
  languageTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  languageTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  languageTagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  languageDisplay: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  languageBadge: {
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  languageBadgeText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
  },
  editButton: {
    backgroundColor: '#3B82F6',
  },
  saveButton: {
    backgroundColor: '#10B981',
  },
  cancelButton: {
    backgroundColor: '#EF4444',
  },
  closeModalButton: {
    backgroundColor: '#6B7280',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
