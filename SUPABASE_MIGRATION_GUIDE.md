# Guide complet de migration vers Supabase - ELC Academy

## 📋 Étapes de migration

### 1. Configuration Supabase

#### A. Créer un projet Supabase
1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un compte gratuit
3. Créez un nouveau projet avec :
   - Nom : `elc-academy`
   - Région : Choisissez la plus proche
   - Mot de passe base de données : Notez-le bien !

#### B. Récupérer les clés API
1. Dans votre projet Supabase, allez dans **Settings > API**
2. Copiez :
   - **Project URL** (ex: `https://xyzxyz.supabase.co`)
   - **Anon/Public Key** (clé publique pour le frontend)

#### C. Créer le fichier .env
Créez un fichier `.env` à la racine du projet :
```
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anon-ici
```

### 2. Initialisation de la base de données

#### A. Exécuter le script SQL d'initialisation
1. Dans Supabase, allez dans **SQL Editor**
2. Créez une nouvelle requête
3. Copiez-collez le contenu de `supabase_init.sql`
4. Exécutez la requête

#### B. Vérifier les tables créées
Allez dans **Table Editor** et vérifiez que vous avez :
- profiles
- course_categories  
- sessions
- bookings
- resources
- subscriptions
- evaluations
- evaluation_questions
- user_evaluations

### 3. Création des utilisateurs de test

#### Option 1 : Via l'interface Supabase (Recommandé)

1. **Créer un admin** :
   - Allez dans **Authentication > Users**
   - Cliquez sur "Invite user"
   - Email : `admin@elc.com`
   - Créez un mot de passe sécurisé
   - Après création, allez dans **SQL Editor** et exécutez :
   ```sql
   UPDATE profiles 
   SET role = 'admin' 
   WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@elc.com');
   ```

2. **Créer des professeurs** :
   - Répétez pour : `emma@elc.com`, `john@elc.com`, `sarah@elc.com`
   - Après création, exécutez :
   ```sql
   UPDATE profiles 
   SET role = 'teacher' 
   WHERE id IN (
     SELECT id FROM auth.users 
     WHERE email IN ('emma@elc.com', 'john@elc.com', 'sarah@elc.com')
   );
   ```

3. **Créer des étudiants** :
   - Répétez pour : `alice@example.com`, `bob@example.com`, `claire@example.com`
   - Les profils restent avec `role = 'student'` par défaut

#### Option 2 : Via script (Nécessite service_role key)

Si vous avez accès à la clé `service_role` :
1. Remplacez temporairement `VITE_SUPABASE_ANON_KEY` par la `service_role key`
2. Exécutez le script de migration dans la console du navigateur
3. **IMPORTANT** : Remettez la `anon_key` après !

### 4. Insertion des données de test

1. Dans **SQL Editor**, exécutez le contenu de `MIGRATION_DATA.sql`
2. Mettez à jour les `teacher_id` dans les sessions :
```sql
UPDATE sessions 
SET teacher_id = (SELECT id FROM profiles WHERE role = 'teacher' LIMIT 1)
WHERE teacher_id IS NULL;
```

### 5. Activer l'authentification dans l'application

#### A. Basculer vers le store Supabase
1. Renommez l'ancien store :
```bash
mv src/stores/auth.js src/stores/auth-mock.js
```

2. Activez le nouveau store :
```bash
mv src/stores/auth-supabase.js src/stores/auth.js
```

#### B. Tester la connexion
1. Redémarrez le serveur : `npm run dev`
2. Testez la connexion avec `admin@elc.com`
3. Vérifiez que les données s'affichent correctement

### 6. Migration des autres stores

Répétez le processus pour :
- `sessions.js` → `sessions-supabase.js`
- `admin.js` → `admin-supabase.js`
- `courses.js` → `courses-supabase.js`

### 7. Configuration du Storage (pour les ressources)

1. Dans Supabase, allez dans **Storage**
2. Créez un nouveau bucket : `resources`
3. Définissez-le comme public
4. Ajoutez les politiques pour l'upload

### 8. Tests de validation

#### ✅ Checklist de validation
- [ ] Connexion/Déconnexion fonctionnelle
- [ ] Création de compte avec profil automatique
- [ ] Affichage des sessions depuis la BDD
- [ ] Réservation de session avec déduction de tokens
- [ ] Upload de ressources dans Storage
- [ ] Système d'évaluations fonctionnel
- [ ] Interface admin avec données réelles

### 9. Sécurité et optimisations

#### A. Vérifier les RLS policies
Testez que :
- Les étudiants ne peuvent voir que leurs données
- Les admins ont accès à tout
- Les professeurs ont les bons droits

#### B. Activer les backups
Dans **Settings > Backups**, activez les sauvegardes automatiques

#### C. Monitorer l'usage
Surveillez dans **Reports** :
- Nombre de requêtes
- Stockage utilisé
- Performances

## 🚨 Troubleshooting

### Erreur "Variables Supabase non configurées"
→ Vérifiez que le fichier `.env` existe et contient les bonnes clés

### Erreur "Permission denied"
→ Vérifiez les RLS policies dans la base de données

### Les données ne s'affichent pas
→ Vérifiez que les tables contiennent des données
→ Regardez la console pour les erreurs

### Erreur de connexion
→ Vérifiez que l'utilisateur existe dans Authentication
→ Vérifiez que le profil existe dans la table profiles

## 📝 Notes importantes

1. **Ne jamais** commiter le fichier `.env`
2. **Toujours** utiliser `anon_key` en production, jamais `service_role`
3. Faire des backups réguliers
4. Tester en local avant de déployer

## 🎉 Prochaines étapes

Une fois la migration terminée :
1. Déployer sur Netlify avec les variables d'environnement
2. Configurer un domaine personnalisé
3. Activer l'authentification par email
4. Intégrer les paiements Stripe
5. Mettre en place les notifications temps réel

---

Besoin d'aide ? Consultez la [documentation Supabase](https://supabase.com/docs) ou contactez le support. 