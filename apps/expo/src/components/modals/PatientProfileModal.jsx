import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useJammLine } from '../../context/JammLineContext';

export default function PatientProfileModal({ visible, onClose }) {
  const { profile, setProfile, notifications, setNotifications } = useJammLine();
  const [editingProfile, setEditingProfile] = useState({ ...profile });
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setProfile(editingProfile);
    setIsEditing(false);
    setNotifications(prev => [
      {
        id: Date.now(),
        message: 'Profil mis à jour avec succès',
        type: 'success',
        read: false,
        category: 'profile',
      },
      ...prev,
    ]);
    Alert.alert('Succès', 'Votre profil a été mis à jour');
  };

  const handleCancel = () => {
    setEditingProfile({ ...profile });
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
            <Text style={styles.modalTitle}>Mon Profil</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <Ionicons name="person" size={48} color="#14B8A6" />
                <Text style={styles.avatarText}>{editingProfile.nom?.charAt(0) || 'P'}</Text>
              </View>
              <Text style={styles.profileName}>{editingProfile.nom}</Text>
              <Text style={styles.profileEmail}>{editingProfile.email}</Text>
            </View>

            <View style={styles.profileSection}>
              <Text style={styles.sectionTitle}>Informations personnelles</Text>
              {renderProfileField('Nom complet', editingProfile.nom, 'nom')}
              {renderProfileField('Email', editingProfile.email, 'email')}
              {renderProfileField('Téléphone', editingProfile.telephone, 'telephone')}
              {renderProfileField('Date de naissance', editingProfile.dateNaissance, 'dateNaissance')}
              {renderProfileField('Genre', editingProfile.genre, 'genre')}
              {renderProfileField('Adresse', editingProfile.adresse, 'adresse')}
            </View>

            <View style={styles.profileSection}>
              <Text style={styles.sectionTitle}>Informations médicales</Text>
              {renderProfileField('Mutuelle', editingProfile.mutuelle, 'mutuelle')}
              {renderProfileField('Groupe sanguin', editingProfile.groupeSanguin, 'groupeSanguin')}
              {renderProfileField('Allergies', editingProfile.allergies, 'allergies')}
              {renderProfileField('Traitements en cours', editingProfile.traitements, 'traitements')}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#14B8A6',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
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
