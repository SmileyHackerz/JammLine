import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useJammLine } from '../../context/JammLineContext';

export default function AddUserModal() {
  const {
    showAddUserModal,
    setShowAddUserModal,
    newUserForm,
    setNewUserForm,
    addUser,
    services,
  } = useJammLine();

  const handleInputChange = (field, value) => {
    setNewUserForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!newUserForm.nom || !newUserForm.email || !newUserForm.role) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    addUser(newUserForm);
    setShowAddUserModal(false);
    setNewUserForm({ nom: '', email: '', role: 'Infirmière', service: 'Accueil' });
  };

  if (!showAddUserModal) return null;

  return (
    <Modal
      visible={showAddUserModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowAddUserModal(false)}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Ajouter un utilisateur</Text>
          <TouchableOpacity onPress={() => setShowAddUserModal(false)}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom *</Text>
            <TextInput
              style={styles.input}
              value={newUserForm.nom}
              onChangeText={(value) => handleInputChange('nom', value)}
              placeholder="Nom de l'utilisateur"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={newUserForm.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="email@exemple.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Rôle *</Text>
            <View style={styles.roleButtons}>
              {['Médecin', 'Infirmière', 'Secrétaire', 'Admin'].map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.roleButton,
                    newUserForm.role === role && styles.roleButtonSelected
                  ]}
                  onPress={() => handleInputChange('role', role)}
                >
                  <Text style={[
                    styles.roleButtonText,
                    newUserForm.role === role && styles.roleButtonTextSelected
                  ]}>
                    {role}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Service</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {services.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  style={[
                    styles.serviceButton,
                    newUserForm.service === service.name && styles.serviceButtonSelected
                  ]}
                  onPress={() => handleInputChange('service', service.name)}
                >
                  <Text style={[
                    styles.serviceButtonText,
                    newUserForm.service === service.name && styles.serviceButtonTextSelected
                  ]}>
                    {service.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowAddUserModal(false)}
          >
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Ajouter</Text>
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  roleButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  roleButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  roleButtonSelected: {
    backgroundColor: '#14B8A6',
    borderColor: '#14B8A6',
  },
  roleButtonText: {
    fontSize: 14,
    color: '#666',
  },
  roleButtonTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  serviceButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    marginRight: 10,
  },
  serviceButtonSelected: {
    backgroundColor: '#14B8A6',
    borderColor: '#14B8A6',
  },
  serviceButtonText: {
    fontSize: 14,
    color: '#666',
  },
  serviceButtonTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  submitButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#14B8A6',
    alignItems: 'center',
    marginLeft: 10,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
