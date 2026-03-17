import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useJammLine } from '../../context/JammLineContext';

export default function SettingsModal({ visible, onClose, userType }) {
  const { notifications, setNotifications, profile, setProfile } = useJammLine();
  const [settings, setSettings] = useState({
    notifications: {
      ticket: true,
      reservation: true,
      rappel: true,
      system: true,
      general: true,
    },
    preferences: {
      language: 'fr',
      theme: 'light',
      autoRefresh: true,
      soundEnabled: true,
      vibrationEnabled: true,
    },
    privacy: {
      shareData: false,
      analyticsEnabled: true,
      locationEnabled: false,
    },
    accessibility: {
      fontSize: 'medium',
      highContrast: false,
      reducedMotion: false,
    },
  });

  const handleSaveSettings = () => {
    setNotifications(prev => [
      {
        id: Date.now(),
        message: 'Paramètres enregistrés avec succès',
        type: 'success',
        read: false,
        category: 'system',
      },
      ...prev,
    ]);
    
    Alert.alert('Succès', 'Vos paramètres ont été enregistrés');
    onClose();
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Réinitialiser',
      'Réinitialiser tous les paramètres aux valeurs par défaut?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: () => {
            setSettings({
              notifications: {
                ticket: true,
                reservation: true,
                rappel: true,
                system: true,
                general: true,
              },
              preferences: {
                language: 'fr',
                theme: 'light',
                autoRefresh: true,
                soundEnabled: true,
                vibrationEnabled: true,
              },
              privacy: {
                shareData: false,
                analyticsEnabled: true,
                locationEnabled: false,
              },
              accessibility: {
                fontSize: 'medium',
                highContrast: false,
                reducedMotion: false,
              },
            });
            Alert.alert('Réinitialisé', 'Les paramètres ont été réinitialisés');
          },
        },
      ]
    );
  };

  const renderSettingItem = (label, value, key, editable = true) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingDescription}>
          {key === 'ticket' && 'Recevoir des alertes pour vos tickets'}
          {key === 'reservation' && 'Notifications de réservations'}
          {key === 'rappel' && 'Rappels de rendez-vous'}
          {key === 'system' && 'Messages système importants'}
          {key === 'general' && 'Notifications générales'}
        </Text>
      </View>
      <View style={[
        styles.statusBadge,
        value ? styles.statusAvailable : styles.statusUnavailable
      ]}>
        <Text style={[
          styles.statusText,
          value ? styles.statusAvailableText : styles.statusUnavailableText
        ]}>
          {value ? 'Activé' : 'Désactivé'}
        </Text>
      </View>
    </View>
  );

  const renderPreferenceSettings = () => (
    <View style={styles.settingsSection}>
      <Text style={styles.sectionTitle}>Préférences</Text>
      <View style={styles.settingsGroup}>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Langue</Text>
            <Text style={styles.settingDescription}>Choisir la langue de l\'application</Text>
          </View>
          <TouchableOpacity style={styles.languageSelector}>
            <Text style={styles.languageText}>Français</Text>
            <Ionicons name="chevron-down" size={16} color="#666" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Thème</Text>
            <Text style={styles.settingDescription}>Apparence de l\'interface</Text>
          </View>
          <TouchableOpacity style={styles.themeSelector}>
            <Text style={styles.themeText}>Clair</Text>
            <Ionicons name="chevron-down" size={16} color="#666" />
          </TouchableOpacity>
        </View>

        {Object.entries(settings.preferences).filter(([key]) => 
          !['language', 'theme'].includes(key)
        ).map(([key, value]) => (
          <View key={key} style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>
                {key === 'autoRefresh' && 'Actualisation auto'}
                {key === 'soundEnabled' && 'Sons'}
                {key === 'vibrationEnabled' && 'Vibrations'}
              </Text>
              <Text style={styles.settingDescription}>
                {key === 'autoRefresh' && 'Mettre à jour automatiquement'}
                {key === 'soundEnabled' && 'Activer les sons de notification'}
                {key === 'vibrationEnabled' && 'Vibrer pour les notifications'}
              </Text>
            </View>
            <Switch
              value={value}
              onValueChange={(newValue) => setSettings(prev => ({
                ...prev,
                preferences: { ...prev.preferences, [key]: newValue }
              }))}
              trackColor={{ false: '#ddd', true: '#14B8A6' }}
              thumbColor={value ? '#fff' : '#f4f3f4'}
            />
          </View>
        ))}
      </View>
    </View>
  );

  const renderPrivacySettings = () => (
    <View style={styles.settingsSection}>
      <Text style={styles.sectionTitle}>Confidentialité</Text>
      <View style={styles.settingsGroup}>
        {Object.entries(settings.privacy).map(([key, value]) => (
          <View key={key} style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>
                {key === 'shareData' && 'Partage de données'}
                {key === 'analyticsEnabled' && 'Analytics'}
                {key === 'locationEnabled' && 'Localisation'}
              </Text>
              <Text style={styles.settingDescription}>
                {key === 'shareData' && 'Partager des données anonymes'}
                {key === 'analyticsEnabled' && 'Aider à améliorer l\'application'}
                {key === 'locationEnabled' && 'Utiliser votre position'}
              </Text>
            </View>
            <Switch
              value={value}
              onValueChange={(newValue) => setSettings(prev => ({
                ...prev,
                privacy: { ...prev.privacy, [key]: newValue }
              }))}
              trackColor={{ false: '#ddd', true: '#14B8A6' }}
              thumbColor={value ? '#fff' : '#f4f3f4'}
            />
          </View>
        ))}
      </View>
    </View>
  );

  const renderAccessibilitySettings = () => (
    <View style={styles.settingsSection}>
      <Text style={styles.sectionTitle}>Accessibilité</Text>
      <View style={styles.settingsGroup}>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Taille du texte</Text>
            <Text style={styles.settingDescription}>Ajuster la taille des polices</Text>
          </View>
          <TouchableOpacity style={styles.fontSizeSelector}>
            <Text style={styles.fontSizeText}>Moyenne</Text>
            <Ionicons name="chevron-down" size={16} color="#666" />
          </TouchableOpacity>
        </View>

        {Object.entries(settings.accessibility).filter(([key]) => 
          key !== 'fontSize'
        ).map(([key, value]) => (
          <View key={key} style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>
                {key === 'highContrast' && 'Contraste élevé'}
                {key === 'reducedMotion' && 'Mouvements réduits'}
              </Text>
              <Text style={styles.settingDescription}>
                {key === 'highContrast' && 'Améliorer le contraste des couleurs'}
                {key === 'reducedMotion' && 'Réduire les animations'}
              </Text>
            </View>
            <Switch
              value={value}
              onValueChange={(newValue) => setSettings(prev => ({
                ...prev,
                accessibility: { ...prev.accessibility, [key]: newValue }
              }))}
              trackColor={{ false: '#ddd', true: '#14B8A6' }}
              thumbColor={value ? '#fff' : '#f4f3f4'}
            />
          </View>
        ))}
      </View>
    </View>
  );

  const renderAccountActions = () => (
    <View style={styles.settingsSection}>
      <Text style={styles.sectionTitle}>Compte</Text>
      <View style={styles.settingsGroup}>
        <TouchableOpacity style={styles.actionItem} onPress={() => Alert.alert('Déconnexion', 'Fonctionnalité de déconnexion')}>
          <Ionicons name="log-out" size={20} color="#EF4444" />
          <Text style={styles.actionText}>Se déconnecter</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionItem} onPress={handleResetSettings}>
          <Ionicons name="refresh" size={20} color="#F59E0B" />
          <Text style={styles.actionText}>Réinitialiser les paramètres</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionItem} onPress={() => Alert.alert('Suppression', 'Fonctionnalité de suppression de compte')}>
          <Ionicons name="trash" size={20} color="#DC2626" />
          <Text style={[styles.actionText, styles.dangerText]}>Supprimer le compte</Text>
        </TouchableOpacity>
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
            <Text style={styles.modalTitle}>Paramètres</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>Notifications</Text>
              <View style={styles.settingsGroup}>
                {Object.entries(settings.notifications).map(([key, value]) => (
                  renderSettingItem(
                    key === 'ticket' ? 'Tickets' :
                    key === 'reservation' ? 'Réservations' :
                    key === 'rappel' ? 'Rappels' :
                    key === 'system' ? 'Système' : 'Général',
                    value,
                    key
                  )
                ))}
              </View>
            </View>

            <View style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>Préférences</Text>
              <View style={styles.settingsGroup}>
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Langue</Text>
                    <Text style={styles.settingDescription}>Choisir la langue de l'application</Text>
                  </View>
                  <TouchableOpacity style={styles.languageSelector}>
                    <Text style={styles.languageText}>Français</Text>
                    <Ionicons name="chevron-down" size={16} color="#666" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Thème</Text>
                    <Text style={styles.settingDescription}>Apparence de l'interface</Text>
                  </View>
                  <TouchableOpacity style={styles.themeSelector}>
                    <Text style={styles.themeText}>Clair</Text>
                    <Ionicons name="chevron-down" size={16} color="#666" />
                  </TouchableOpacity>
                </View>

                {renderSettingItem('Actualisation auto', settings.preferences.autoRefresh, 'autoRefresh')}
                {renderSettingItem('Sons', settings.preferences.soundEnabled, 'soundEnabled')}
                {renderSettingItem('Vibrations', settings.preferences.vibrationEnabled, 'vibrationEnabled')}
              </View>
            </View>

            <View style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>Confidentialité</Text>
              <View style={styles.settingsGroup}>
                {renderSettingItem('Partage de données', settings.privacy.shareData, 'shareData')}
                {renderSettingItem('Analytics', settings.privacy.analyticsEnabled, 'analyticsEnabled')}
                {renderSettingItem('Localisation', settings.privacy.locationEnabled, 'locationEnabled')}
              </View>
            </View>

            <View style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>Accessibilité</Text>
              <View style={styles.settingsGroup}>
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Taille du texte</Text>
                    <Text style={styles.settingDescription}>Ajuster la taille des polices</Text>
                  </View>
                  <TouchableOpacity style={styles.fontSizeSelector}>
                    <Text style={styles.fontSizeText}>Moyenne</Text>
                    <Ionicons name="chevron-down" size={16} color="#666" />
                  </TouchableOpacity>
                </View>

                {renderSettingItem('Contraste élevé', settings.accessibility.highContrast, 'highContrast')}
                {renderSettingItem('Mouvements réduits', settings.accessibility.reducedMotion, 'reducedMotion')}
              </View>
            </View>

            <View style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>Compte</Text>
              <View style={styles.settingsGroup}>
                <TouchableOpacity style={styles.actionItem} onPress={() => Alert.alert('Déconnexion', 'Fonctionnalité de déconnexion')}>
                  <Ionicons name="log-out" size={20} color="#EF4444" />
                  <Text style={styles.actionText}>Se déconnecter</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionItem} onPress={handleResetSettings}>
                  <Ionicons name="refresh" size={20} color="#F59E0B" />
                  <Text style={styles.actionText}>Réinitialiser les paramètres</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionItem} onPress={() => Alert.alert('Suppression', 'Fonctionnalité de suppression de compte')}>
                  <Ionicons name="trash" size={20} color="#DC2626" />
                  <Text style={[styles.actionText, styles.dangerText]}>Supprimer le compte</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.saveButton]}
              onPress={handleSaveSettings}
            >
              <Text style={styles.saveButtonText}>Enregistrer</Text>
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
  settingsSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  settingsGroup: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  languageText: {
    fontSize: 14,
    color: '#333',
    marginRight: 5,
  },
  themeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  themeText: {
    fontSize: 14,
    color: '#333',
    marginRight: 5,
  },
  fontSizeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  fontSizeText: {
    fontSize: 14,
    color: '#333',
    marginRight: 5,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  languageText: {
    fontSize: 14,
    color: '#333',
    marginRight: 5,
  },
  themeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  themeText: {
    fontSize: 14,
    color: '#333',
    marginRight: 5,
  },
  fontSizeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  fontSizeText: {
    fontSize: 14,
    color: '#333',
    marginRight: 5,
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
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 15,
  },
  actionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  dangerText: {
    color: '#DC2626',
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
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  saveButton: {
    backgroundColor: '#14B8A6',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
