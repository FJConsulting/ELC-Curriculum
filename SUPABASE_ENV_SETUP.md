# Configuration des variables d'environnement Supabase

## 1. Créer le fichier .env

Créez un fichier `.env` à la racine du projet avec le contenu suivant :

```
# Configuration Supabase
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anon-ici
```

## 2. Récupérer vos clés Supabase

1. Connectez-vous à [Supabase](https://supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Settings > API**
4. Copiez :
   - **Project URL** → remplacez `https://votre-projet.supabase.co`
   - **anon/public key** → remplacez `votre-cle-anon-ici`

## 3. Important

- Ne commitez jamais le fichier `.env` dans Git
- Le fichier `.gitignore` contient déjà `.env`
- Gardez vos clés secrètes en sécurité

## 4. Vérifier la configuration

Après avoir créé le fichier `.env`, redémarrez le serveur de développement :

```bash
npm run dev
``` 