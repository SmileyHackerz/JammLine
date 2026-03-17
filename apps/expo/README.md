# JammLine - Application Mobile de Gestion de Files d'Attente Médicales

JammLine est une application mobile Expo React Native permettant de gérer les files d'attente dans les établissements médicaux. Elle offre une solution complète pour les patients, les médecins et les administrateurs.

## 🏥 Fonctionnalités

### Pour les Patients
- **Prise de ticket en ligne** : Réservez votre place dans la file d'attente
- **Suivi en temps réel** : Consultez votre position et le temps d'attente estimé
- **Historique** : Accédez à l'historique de vos consultations
- **Notifications** : Recevez des alertes lorsque votre tour approche

### Pour les Médecins
- **Gestion des files d'attente** : Visualisez et gérez les patients en attente
- **Démarrage/Fin de consultation** : Marquez facilement le statut des consultations
- **Informations patients** : Accédez aux coordonnées des patients
- **Statistiques** : Suivez votre activité quotidienne

### Pour les Administrateurs
- **Tableau de bord complet** : Vue d'ensemble de l'activité
- **Gestion des services** : Configurez les services médicaux disponibles
- **Gestion des utilisateurs** : Administrez les comptes patients et médecins
- **Rapports et statistiques** : Analysez les performances de l'établissement

## 🛠️ Stack Technique

- **Frontend** : React Native avec Expo
- **Navigation** : React Navigation (Stack & Bottom Tabs)
- **UI** : Composants natifs + LinearGradient
- **Icons** : Expo Vector Icons (Ionicons)
- **State Management** : React Context API
- **Storage** : Expo Secure Store pour l'authentification
- **Notifications** : Expo Notifications

## 📱 Installation

### Prérequis
- Node.js (version 16 ou supérieure)
- Expo CLI : `npm install -g expo-cli`
- Expo Go sur votre appareil mobile

### Installation du projet

1. Clonez le projet :
```bash
git clone <repository-url>
cd jammline-app
```

2. Installez les dépendances :
```bash
npm install
```

3. Démarrez le serveur de développement :
```bash
npm start
```

4. Scannez le QR code avec l'application Expo Go sur votre mobile

## 🏗️ Structure du Projet

```
src/
├── context/           # Context API pour la gestion d'état
│   ├── AuthContext.js     # Authentification et gestion utilisateur
│   └── TicketContext.js   # Gestion des tickets et services
├── navigation/        # Configuration de la navigation
│   └── AppNavigator.js    # Navigation principale
├── screens/           # Écrans de l'application
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── PatientDashboard.js
│   ├── MedecinDashboard.js
│   ├── AdminDashboard.js
│   ├── NouveauTicketScreen.js
│   ├── ProfileScreen.js
│   └── SettingsScreen.js
└── assets/            # Ressources statiques
```

## 🎯 Fonctionnalités Principales

### Système d'Authentification
- Inscription avec sélection de rôle (Patient/Médecin/Admin)
- Connexion sécurisée avec stockage des tokens
- Gestion des sessions persistantes

### Gestion des Tickets
- Création de tickets pour différents services médicaux
- Suivi en temps réel de la position dans la file
- Mise à jour du statut (en attente, en consultation, terminé)

### Tableaux de Bord Spécifiques
- **Patient** : Vue personnelle avec tickets actifs et historique
- **Médecin** : Gestion des consultations et files d'attente
- **Admin** : Administration complète avec statistiques

### Services Médicaux
- Configuration des services (Consultation générale, Pédiatrie, Cardiologie, etc.)
- Temps estimés par service
- Gestion des files par service

## 🔧 Configuration

### Variables d'Environnement
Créez un fichier `.env` à la racine du projet :

```env
EXPO_PUBLIC_API_URL=https://your-api-url.com
EXPO_PUBLIC_NOTIFICATION_KEY=your-notification-key
```

### Personnalisation
- Modifiez les couleurs dans les composants via les constantes de couleur
- Adaptez les services médicaux dans `TicketContext.js`
- Personnalisez les notifications dans `app.json`

## 📱 Déploiement

### Build pour iOS
```bash
expo build:ios
```

### Build pour Android
```bash
expo build:android
```

### Publication sur l'App Store et Google Play
Suivez la documentation Expo pour la publication sur les stores respectifs.

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add amazing feature'`)
4. Pushez vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 📝 License

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Email : support@jammline.com
- Documentation : https://jammline.com/help
- Issues GitHub : Créez une issue sur le repository

## 🔄 Mises à Jour

### Version 1.0.0
- Version initiale avec toutes les fonctionnalités de base
- Système complet de gestion de files d'attente
- Tableaux de bord pour tous les rôles
- Authentification sécurisée
- Notifications en temps réel

---

**JammLine** - Simplifiez votre expérience médicale 🏥✨
