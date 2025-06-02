# ELC Academy - Plateforme d'Apprentissage d'Anglais en Ligne

Une application Vue.js moderne pour l'apprentissage de l'anglais avec cours collectifs, ateliers de grammaire et clubs de conversation.

## 🚀 Fonctionnalités

### 📚 Types de Cours
- **Cours collectifs** (≤5 personnes) - Apprentissage structuré par niveau
- **Ateliers de grammaire** - Renforcement des bases (A1 → B2+)  
- **Club de conversation** - Débats sur l'actualité pour pratiquer l'oral

### 💰 Modèle Économique
- **Système de tokens** : 1 token = 1 séance (~35€/heure)
- **Abonnements** : 4 mois (120€/mois) ou 6 mois (100€/mois) avec prix réduit
- **3 tokens gratuits** à l'inscription
- **Test de niveau gratuit** avant achat

### 🎯 Système de Progression
- **Cycles de 20 leçons** par niveau (A1, A2, B1, B2, C1)
- **Tests obligatoires** pour débloquer les niveaux supérieurs
- **Évaluations finales** pour valider les acquis (80% completion requise)
- **Options de rattrapage** disponibles

### ⚡ Fonctionnalités Techniques
- Interface moderne avec Tailwind CSS
- Gestion d'état avec Pinia
- Routing avec Vue Router
- Système d'authentification complet
- Tableaux de bord personnalisés
- Notifications en temps réel

## 🛠️ Technologies Utilisées

- **Vue.js 3** - Framework frontend
- **Vite** - Build tool et dev server
- **Pinia** - Gestion d'état
- **Vue Router** - Routage
- **Tailwind CSS** - Styling
- **Chart.js** - Graphiques et statistiques
- **Axios** - Requêtes HTTP

## 📦 Installation et Développement

### Prérequis
- Node.js ≥ 18.0.0
- npm ou yarn

### Installation locale
```bash
# Cloner le projet
git clone <repository-url>
cd elc-academy

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# L'application sera disponible sur http://localhost:3001
```

### Build pour production
```bash
# Créer le build de production
npm run build

# Prévisualiser le build
npm run preview
```

## 🌐 Déploiement Netlify

### Configuration automatique
Le projet est configuré pour un déploiement automatique sur Netlify avec :
- **fichier `netlify.toml`** pour la configuration de build
- **Redirections SPA** pour le routing Vue.js
- **Headers de sécurité** et optimisations de cache

### Variables de build Netlify
- **Build Command** : `npm run build`
- **Publish Directory** : `dist`
- **Node Version** : 18

### Déploiement via GitHub
1. Pusher le code sur GitHub
2. Connecter le repository à Netlify
3. Le déploiement se fait automatiquement à chaque push

## 🧪 Comptes de Test

Pour tester l'application :

### Étudiant
- **Email** : student@test.com
- **Mot de passe** : password
- **Tokens** : 3 (gratuits)
- **Niveau** : A2

### Administrateur  
- **Email** : admin@elc.com
- **Mot de passe** : password
- **Accès** : Interface admin complète

## 📁 Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── layout/         # Layout (Navbar, Footer)
│   └── ui/             # Composants UI (Modal, Toast)
├── views/              # Pages de l'application
│   ├── auth/           # Authentification
│   ├── courses/        # Pages de cours
│   └── *.vue           # Pages principales
├── stores/             # Stores Pinia
│   ├── auth.js         # Authentification
│   └── courses.js      # Gestion des cours
├── router/             # Configuration du routeur
└── styles/             # Styles globaux
```

## 🎨 Design System

### Couleurs principales
- **Primary** : Bleu (#3B82F6)
- **Secondary** : Violet (#8B5CF6) 
- **Accent** : Vert (#10B981)

### Composants
- Interface moderne avec gradients
- Animations fluides
- Design responsive
- Accessibilité optimisée

## 🔧 Configuration Développement

### Scripts disponibles
```bash
npm run dev        # Serveur de développement
npm run build      # Build de production  
npm run preview    # Preview du build
npm run lint       # Linting du code
```

### Extensions recommandées (VS Code)
- Vue Language Features (Volar)
- TypeScript Vue Plugin (Volar)
- Tailwind CSS IntelliSense
- Auto Rename Tag
- Bracket Pair Colorizer

## 🚀 Roadmap

### Phase 1 ✅
- [x] Architecture Vue.js moderne
- [x] Système d'authentification
- [x] Gestion des cours et tokens
- [x] Interface utilisateur complète
- [x] Système d'évaluations

### Phase 2 🔄
- [ ] Intégration paiements Stripe
- [ ] Système de vidéoconférence
- [ ] API backend complète
- [ ] Tests automatisés

### Phase 3 📅
- [ ] Application mobile
- [ ] IA pour recommendations
- [ ] Analytiques avancées
- [ ] Internationalisation

## 🤝 Contribution

Les contributions sont les bienvenues ! Merci de :
1. Fork le projet
2. Créer une branche pour votre feature
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou support :
- Email : support@elc-academy.com
- Documentation : [docs.elc-academy.com](https://docs.elc-academy.com)

---

*Développé avec ❤️ par l'équipe ELC Academy* 