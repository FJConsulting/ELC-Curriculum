# ELC Academy - Académie en ligne d'anglais

Une académie en ligne complète pour apprendre l'anglais avec des cours collectifs (≤ 5 personnes), des ateliers de grammaire structurés par niveau et un club de conversation sur l'actualité.

## 🚀 Fonctionnalités

### 🎯 Système d'apprentissage
- **Test de niveau gratuit** avant inscription
- **Cours collectifs** limités à 5 personnes maximum
- **Ateliers de grammaire** structurés par niveau (A1 → B2+)
- **Club de conversation** sur l'actualité
- **Cycle de 20 leçons** par niveau avec progression structurée

### 💰 Modèle économique
- **Système de tokens** : 1 token = 1 séance
- **Abonnements** 4-6 mois avec prix réduit
- **3 tokens gratuits** à l'inscription
- **Packs tokens** à l'unité (≈ 35 €/h)

### 📚 Contenus pédagogiques
- **Vidéos d'accueil** par niveau
- **Fiches grammaire** et exercices téléchargeables
- **Supports audio** pour la prononciation
- **Système de rattrapage** pour nouveaux inscrits

### 🛠 Fonctionnalités techniques
- **Interface moderne** avec Vue.js 3 et Tailwind CSS
- **Réservation intelligente** (max 3 créneaux actifs)
- **Gestion des conflits** d'horaires
- **Tableau de bord** personnalisé
- **Interface d'administration** complète

## 📋 Prérequis

- Node.js 16+ 
- npm ou yarn

## 🔧 Installation

1. **Cloner le repository**
   ```bash
   git clone https://github.com/votre-username/elc-academy.git
   cd elc-academy
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

4. **Ouvrir l'application**
   ```
   http://localhost:3000
   ```

## 🏗️ Structure du projet

```
src/
├── components/           # Composants réutilisables
│   ├── layout/          # Navigation, Footer
│   ├── ui/              # Éléments d'interface
│   └── forms/           # Formulaires
├── views/               # Pages principales
│   ├── auth/            # Authentification
│   ├── courses/         # Gestion des cours
│   └── admin/           # Interface admin
├── stores/              # State management (Pinia)
│   ├── auth.js          # Authentification
│   ├── courses.js       # Cours et formations
│   └── admin.js         # Administration
├── router/              # Configuration des routes
├── utils/               # Utilitaires
└── style.css           # Styles globaux
```

## 🎨 Design System

### Couleurs principales
- **Primary**: #667eea (Bleu-violet)
- **Secondary**: #f093fb (Rose-violet)
- **Success**: #10b981 (Vert)
- **Warning**: #f59e0b (Orange)
- **Error**: #ef4444 (Rouge)

### Composants réutilisables
- Boutons avec gradients
- Cards interactives
- Modales responsives
- Système de notifications
- Barres de progression

## 👤 Comptes de test

### Étudiant
- **Email**: `student@test.com`
- **Mot de passe**: `password`

### Administrateur
- **Email**: `admin@elc.com`
- **Mot de passe**: `password`

## 🔄 Workflow utilisateur

### Nouveaux utilisateurs
1. **Landing page** avec présentation
2. **Test de niveau gratuit** (5 questions)
3. **Inscription** avec 3 tokens offerts
4. **Accès au tableau de bord**

### Utilisateurs connectés
1. **Dashboard** avec statistiques
2. **Réservation de cours** par tokens
3. **Suivi de progression** par niveau
4. **Achat de tokens** ou abonnement

### Système de déblocage
- Tests obligatoires pour débloquer chaque niveau
- Progression de 50% minimum pour passer au niveau suivant
- Option de rattrapage via club de conversation

## 📱 Pages principales

### Public
- **/** - Landing page avec test gratuit
- **/test-niveau** - Test de niveau interactif
- **/login** - Connexion
- **/register** - Inscription

### Espace étudiant
- **/dashboard** - Tableau de bord
- **/cours** - Cours collectifs disponibles
- **/ateliers-grammaire** - Ateliers par niveau
- **/club-conversation** - Sessions de conversation
- **/profil** - Gestion du profil
- **/abonnement** - Tokens et abonnements

### Administration
- **/admin** - Interface d'administration
- Gestion des utilisateurs
- Planification des cours
- Statistiques et analytics

## 🎯 Fonctionnalités clés

### Système de tokens
- Achat par packs ou abonnement
- 1 token = 1 séance (cours ou test)
- Remboursement en cas d'annulation
- Limite de 3 réservations actives

### Cours adaptatifs
- Filtrage par niveau utilisateur
- Recommandations personnalisées
- Système de prérequis
- Solution "catch-up" pour rattrapage

### Gestion des planning
- Détection automatique des conflits
- Notification des créneaux disponibles
- Système de liste d'attente
- Rappels automatiques

## 🔐 Sécurité

- Authentification par tokens JWT (simulation)
- Validation côté client et serveur
- Protection des routes privées
- Gestion des rôles utilisateur

## 📊 Analytics & Métriques

- Taux de conversion landing → inscription
- Progression par niveau
- Utilisation des tokens
- Taux de participation aux cours

## 🚀 Déploiement

### Build de production
```bash
npm run build
```

### Aperçu du build
```bash
npm run preview
```

### Variables d'environnement
```env
VITE_APP_NAME=ELC Academy
VITE_API_URL=https://api.elc-academy.com
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

## 🔮 Roadmap

### Phase 1 - MVP ✅
- [x] Authentification et profils
- [x] Système de tokens
- [x] Réservation de cours
- [x] Test de niveau
- [x] Interface moderne

### Phase 2 - Contenu 🚧
- [ ] Intégration vidéos pédagogiques
- [ ] Système de notes et feedback
- [ ] Exercices interactifs
- [ ] Certificats de réussite

### Phase 3 - Social 📋
- [ ] Forum étudiant
- [ ] Système de parrainage
- [ ] Leaderboards
- [ ] Événements communautaires

### Phase 4 - Mobile 📱
- [ ] Application mobile React Native
- [ ] Notifications push
- [ ] Mode hors ligne
- [ ] Synchronisation cloud

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Support

- **Email**: support@elc-academy.com
- **Discord**: [ELC Academy Community](https://discord.gg/elc-academy)
- **Documentation**: [docs.elc-academy.com](https://docs.elc-academy.com)

---

**Développé avec ❤️ par l'équipe ELC Academy** 