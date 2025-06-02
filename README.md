# ELC Academy - Application d'apprentissage de l'anglais

Application web moderne pour l'apprentissage de l'anglais en ligne avec système de tokens, évaluations et interface d'administration complète.

## 🚀 Fonctionnalités principales

### Pour les étudiants
- **Système de tokens** : 1 token = 1 session (~35€/heure)
- **Sessions en ligne** : Cours collectifs (max 5 personnes), ateliers grammaire, clubs de conversation
- **Évaluations de niveau** : Test initial et certifications par niveau (A1 à C1)
- **Progression gamifiée** : Déblocage progressif des niveaux
- **Ressources pédagogiques** : Documents PDF, vidéos, exercices
- **Intégration Google Meet** : Liens de visioconférence intégrés
- **Certificats** : Téléchargeables après réussite des évaluations

### Pour les administrateurs
- **Tableau de bord complet** : Statistiques, revenus, activité
- **Gestion des contenus** : Création et modification des cours
- **Gestion des sessions** : Planning, attribution des professeurs
- **Gestion des évaluations** : Création de tests et questions
- **Gestion des ressources** : Upload et organisation des documents
- **Gestion des utilisateurs** : Étudiants et professeurs
- **Suivi financier** : Revenus, abonnements, tokens

## 🛠 Technologies utilisées

- **Frontend** : Vue 3, Vite, Vue Router, Pinia
- **Styles** : Tailwind CSS
- **Icônes** : Lucide Vue Next
- **Base de données** : Supabase (PostgreSQL)
- **Authentification** : Supabase Auth
- **Hébergement** : Netlify

## 📦 Installation

### Prérequis
- Node.js 16+
- npm ou yarn

### Installation locale

```bash
# Cloner le repository
git clone [url-du-repo]

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

### Configuration Supabase (optionnel)

1. Créer un projet sur [Supabase](https://supabase.com)
2. Créer un fichier `.env` :
```env
VITE_SUPABASE_URL=votre-url-supabase
VITE_SUPABASE_ANON_KEY=votre-anon-key
```
3. Exécuter le script SQL : `supabase_init.sql`
4. Suivre le guide : `SUPABASE_SETUP.md`

## 🔐 Accès

### Mode développement (données mockées)
- **Étudiant** : N'importe quel email + n'importe quel mot de passe
- **Admin** : `admin@elc.com` + n'importe quel mot de passe

### Mode production (avec Supabase)
- Créer un compte admin en suivant `CREATE_ADMIN_STEP_BY_STEP.md`

## 📁 Structure du projet

```
src/
├── components/       # Composants réutilisables
│   ├── admin/       # Composants d'administration
│   ├── common/      # Composants communs
│   ├── evaluations/ # Composants d'évaluation
│   └── layout/      # Navbar, Footer
├── stores/          # Stores Pinia
├── views/           # Pages principales
├── router/          # Configuration des routes
└── style.css        # Styles globaux
```

## 🚧 État du projet

### ✅ Fonctionnalités implémentées
- Authentification et gestion des utilisateurs
- Interface d'administration complète
- Système d'évaluations avec progression
- Gestion des sessions et réservations
- Intégration Google Meet
- Gestion des ressources pédagogiques
- Tableau de bord avec graphiques
- Système de tokens et abonnements

### 🔄 En cours / À venir
- Intégration complète avec Supabase
- Système de paiement
- Notifications en temps réel
- Application mobile
- Système de messagerie intégré

## 📚 Documentation

- `ADMIN_GUIDE.md` : Guide d'utilisation de l'interface admin
- `SUPABASE_SETUP.md` : Configuration de Supabase
- `CREATE_ADMIN_STEP_BY_STEP.md` : Créer un compte administrateur
- `MIGRATION_GUIDE.md` : Migrer de mock vers Supabase

## 🤝 Contribution

Les contributions sont les bienvenues ! Merci de suivre ces étapes :
1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence privée - voir le propriétaire pour plus d'informations.

## 👥 Contact

ELC Academy - [Site web](https://elc-academy.com)

---
Développé avec ❤️ par FJ Consulting 