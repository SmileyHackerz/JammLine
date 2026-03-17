import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useJammLine } from '../../context/JammLineContext';
import { useTicket } from '../../context/TicketContext';

export default function CreateTicketModal({ visible, onClose }) {
  const { currentPatientName, notifications, setNotifications } = useJammLine();
  const { services, createTicket } = useTicket();
  
  const [ticketData, setTicketData] = useState({
    service: '',
    typeConsult: 'Première consultation',
    motif: '',
    priorite: 'normale',
    symptomes: '',
    dureeSymptomes: '',
    antecedents: '',
    traitements: '',
    allergies: '',
    notes: '',
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  const totalSteps = 3;

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!ticketData.service) newErrors.service = 'Veuillez sélectionner un service';
      if (!ticketData.motif) newErrors.motif = 'Veuillez renseigner le motif';
    }
    
    if (step === 2) {
      if (!ticketData.symptomes) newErrors.symptomes = 'Veuillez décrire les symptômes';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const selectedService = services.find(s => s.name === ticketData.service);

      if (!selectedService) {
        Alert.alert('Erreur', 'Veuillez sélectionner un service valide.');
        return;
      }

      const newTicket = await createTicket(selectedService.id, {
        name: currentPatientName || 'Patient',
        phone: '',
      });
      
      setNotifications(prev => [
        {
          id: Date.now(),
          message: `Ticket ${newTicket.id} créé avec succès`,
          type: 'success',
          read: false,
          category: 'ticket',
        },
        ...prev,
      ]);
      
      Alert.alert('Succès', `Votre ticket ${newTicket.id} a été créé. Position: ${newTicket.position}`);
      handleClose();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer le ticket. Veuillez réessayer.');
    }
  };

  const handleClose = () => {
    setTicketData({
      service: '',
      typeConsult: 'Première consultation',
      motif: '',
      priorite: 'normale',
      symptomes: '',
      dureeSymptomes: '',
      antecedents: '',
      traitements: '',
      allergies: '',
      notes: '',
    });
    setCurrentStep(1);
    setErrors({});
    onClose();
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[...Array(totalSteps)].map((_, index) => (
        <View key={index} style={styles.stepItem}>
          <View style={[
            styles.stepDot,
            currentStep > index + 1 && styles.stepDotCompleted,
            currentStep === index + 1 && styles.stepDotActive
          ]}>
            <Text style={[
              styles.stepDotText,
              currentStep > index + 1 && styles.stepDotTextCompleted,
              currentStep === index + 1 && styles.stepDotTextActive
            ]}>
              {currentStep > index + 1 ? '✓' : index + 1}
            </Text>
          </View>
          {index < totalSteps - 1 && (
            <View style={[
              styles.stepLine,
              currentStep > index + 1 && styles.stepLineCompleted
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Informations de base</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Service *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.serviceOptions}>
            {services.map(service => (
              <TouchableOpacity
                key={service.id}
                style={[
                  styles.serviceOption,
                  ticketData.service === service.name && styles.serviceOptionSelected
                ]}
                onPress={() => setTicketData(prev => ({ ...prev, service: service.name }))}
              >
                <Ionicons
                  name="medical"
                  size={20}
                  color={ticketData.service === service.name ? '#fff' : service.color}
                />
                <Text
                  style={[
                    styles.serviceOptionText,
                    ticketData.service === service.name && styles.serviceOptionTextSelected
                  ]}
                >
                  {service.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        {errors.service && <Text style={styles.errorText}>{errors.service}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Type de consultation</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.typeOptions}>
            {['Première consultation', 'Suivi', 'Urgence', 'Deuxième avis'].map(type => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeOption,
                  ticketData.typeConsult === type && styles.typeOptionSelected
                ]}
                onPress={() => setTicketData(prev => ({ ...prev, typeConsult: type }))}
              >
                <Text style={[
                  styles.typeOptionText,
                  ticketData.typeConsult === type && styles.typeOptionTextSelected
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Motif de consultation *</Text>
        <TextInput
          style={[styles.formInput, errors.motif && styles.formInputError]}
          value={ticketData.motif}
          onChangeText={(text) => setTicketData(prev => ({ ...prev, motif: text }))}
          placeholder="Décrivez brièvement le motif de votre visite"
          multiline
          numberOfLines={3}
        />
        {errors.motif && <Text style={styles.errorText}>{errors.motif}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Priorité</Text>
        <View style={styles.priorityOptions}>
          <TouchableOpacity
            style={[
              styles.priorityOption,
              ticketData.priorite === 'normale' && styles.priorityOptionSelected
            ]}
            onPress={() => setTicketData(prev => ({ ...prev, priorite: 'normale' }))}
          >
            <Ionicons name="time" size={20} color={ticketData.priorite === 'normale' ? '#fff' : '#14B8A6'} />
            <Text style={[
              styles.priorityOptionText,
              ticketData.priorite === 'normale' && styles.priorityOptionTextSelected
            ]}>
              Normal
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.priorityOption,
              ticketData.priorite === 'urgente' && styles.priorityOptionSelected
            ]}
            onPress={() => setTicketData(prev => ({ ...prev, priorite: 'urgente' }))}
          >
            <Ionicons name="warning" size={20} color={ticketData.priorite === 'urgente' ? '#fff' : '#EF4444'} />
            <Text style={[
              styles.priorityOptionText,
              ticketData.priorite === 'urgente' && styles.priorityOptionTextSelected
            ]}>
              Urgent
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Symptômes et détails médicaux</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Symptômes *</Text>
        <TextInput
          style={[styles.formInput, errors.symptomes && styles.formInputError]}
          value={ticketData.symptomes}
          onChangeText={(text) => setTicketData(prev => ({ ...prev, symptomes: text }))}
          placeholder="Décrivez vos symptômes en détail"
          multiline
          numberOfLines={4}
        />
        {errors.symptomes && <Text style={styles.errorText}>{errors.symptomes}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Durée des symptômes</Text>
        <TextInput
          style={styles.formInput}
          value={ticketData.dureeSymptomes}
          onChangeText={(text) => setTicketData(prev => ({ ...prev, dureeSymptomes: text }))}
          placeholder="Depuis quand avez-vous ces symptômes?"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Antécédents médicaux</Text>
        <TextInput
          style={styles.formInput}
          value={ticketData.antecedents}
          onChangeText={(text) => setTicketData(prev => ({ ...prev, antecedents: text }))}
          placeholder="Maladies chroniques, opérations antérieures..."
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Traitements en cours</Text>
        <TextInput
          style={styles.formInput}
          value={ticketData.traitements}
          onChangeText={(text) => setTicketData(prev => ({ ...prev, traitements: text }))}
          placeholder="Médicaments que vous prenez actuellement"
          multiline
          numberOfLines={2}
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Informations supplémentaires</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Allergies</Text>
        <TextInput
          style={styles.formInput}
          value={ticketData.allergies}
          onChangeText={(text) => setTicketData(prev => ({ ...prev, allergies: text }))}
          placeholder="Allergies connues (médicaments, aliments...)"
          multiline
          numberOfLines={2}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Notes additionnelles</Text>
        <TextInput
          style={styles.formInput}
          value={ticketData.notes}
          onChangeText={(text) => setTicketData(prev => ({ ...prev, notes: text }))}
          placeholder="Informations supplémentaires que vous jugez utiles"
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.summarySection}>
        <Text style={styles.summaryTitle}>Récapitulatif</Text>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryItem}><Text style={styles.summaryLabel}>Service:</Text> {ticketData.service}</Text>
          <Text style={styles.summaryItem}><Text style={styles.summaryLabel}>Type:</Text> {ticketData.typeConsult}</Text>
          <Text style={styles.summaryItem}><Text style={styles.summaryLabel}>Motif:</Text> {ticketData.motif}</Text>
          <Text style={styles.summaryItem}><Text style={styles.summaryLabel}>Priorité:</Text> {ticketData.priorite}</Text>
          {ticketData.symptomes && (
            <Text style={styles.summaryItem}><Text style={styles.summaryLabel}>Symptômes:</Text> {ticketData.symptomes.substring(0, 50)}...</Text>
          )}
        </View>
      </View>
    </View>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Créer un ticket médical</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {renderStepIndicator()}

          <ScrollView style={styles.modalBody}>
            {renderStepContent()}
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.previousButton]}
              onPress={handlePrevious}
              disabled={currentStep === 1}
            >
              <Ionicons name="arrow-back" size={20} color={currentStep === 1 ? '#ccc' : '#666'} />
              <Text style={[styles.actionButtonText, currentStep === 1 && styles.disabledText]}>
                Précédent
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.nextButton]}
              onPress={handleNext}
            >
              <Text style={styles.nextButtonText}>
                {currentStep === totalSteps ? 'Créer le ticket' : 'Suivant'}
              </Text>
              <Ionicons 
                name={currentStep === totalSteps ? 'checkmark' : 'arrow-forward'} 
                size={20} 
                color="#fff" 
              />
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
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e5e5e5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepDotActive: {
    backgroundColor: '#14B8A6',
  },
  stepDotCompleted: {
    backgroundColor: '#10B981',
  },
  stepDotText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  stepDotTextActive: {
    color: '#fff',
  },
  stepDotTextCompleted: {
    color: '#fff',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#e5e5e5',
    marginHorizontal: 5,
  },
  stepLineCompleted: {
    backgroundColor: '#10B981',
  },
  modalBody: {
    flex: 1,
    padding: 20,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  formInputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  serviceOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  serviceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  serviceOptionSelected: {
    backgroundColor: '#14B8A6',
    borderColor: '#14B8A6',
  },
  serviceOptionText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  serviceOptionTextSelected: {
    color: '#fff',
  },
  typeOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  typeOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  typeOptionSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  typeOptionText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  typeOptionTextSelected: {
    color: '#fff',
  },
  priorityOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  priorityOptionSelected: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  priorityOptionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  priorityOptionTextSelected: {
    color: '#fff',
  },
  summarySection: {
    marginTop: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  summaryCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
  },
  summaryItem: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  summaryLabel: {
    fontWeight: '600',
    color: '#333',
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
  previousButton: {
    backgroundColor: '#f3f4f6',
  },
  nextButton: {
    backgroundColor: '#14B8A6',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  disabledText: {
    color: '#ccc',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
