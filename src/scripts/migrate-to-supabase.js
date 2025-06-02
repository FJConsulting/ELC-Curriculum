import { supabase } from '../lib/supabase.js'

// Données mockées à migrer
const mockCourseCategories = [
  { id: 1, name: 'Business English', description: 'Anglais professionnel pour le monde des affaires', icon: '💼', color: 'blue' },
  { id: 2, name: 'Travel English', description: 'Anglais pratique pour voyager', icon: '✈️', color: 'green' },
  { id: 3, name: 'Daily Conversation', description: 'Conversation quotidienne et pratique', icon: '💬', color: 'purple' },
  { id: 4, name: 'Grammar Focus', description: 'Focus sur la grammaire et la structure', icon: '📚', color: 'orange' }
]

const mockTeachers = [
  { id: 'teacher-1', name: 'Emma Thompson', email: 'emma@elc.com', role: 'teacher' },
  { id: 'teacher-2', name: 'John Smith', email: 'john@elc.com', role: 'teacher' },
  { id: 'teacher-3', name: 'Sarah Williams', email: 'sarah@elc.com', role: 'teacher' }
]

const mockStudents = [
  { id: 'student-1', name: 'Alice Martin', email: 'alice@example.com', role: 'student', level: 'B1', tokens: 5 },
  { id: 'student-2', name: 'Bob Johnson', email: 'bob@example.com', role: 'student', level: 'A2', tokens: 8 },
  { id: 'student-3', name: 'Claire Dupont', email: 'claire@example.com', role: 'student', level: 'B2', tokens: 3 }
]

// Fonction pour créer les utilisateurs dans Supabase Auth
async function createAuthUsers(users) {
  console.log('🔐 Création des utilisateurs...')
  const results = []
  
  for (const user of users) {
    try {
      // Créer l'utilisateur dans Auth
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: 'password123', // Mot de passe par défaut
        email_confirm: true,
        user_metadata: {
          name: user.name
        }
      })
      
      if (authError) throw authError
      
      // Créer le profil
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authUser.user.id,
          name: user.name,
          role: user.role,
          level: user.level || 'A1',
          tokens: user.tokens || 3
        })
      
      if (profileError) throw profileError
      
      results.push({ ...user, newId: authUser.user.id })
      console.log(`✅ Utilisateur créé : ${user.name}`)
    } catch (error) {
      console.error(`❌ Erreur pour ${user.name}:`, error.message)
    }
  }
  
  return results
}

// Fonction pour insérer les catégories
async function insertCategories() {
  console.log('📚 Insertion des catégories...')
  
  const { error } = await supabase
    .from('course_categories')
    .insert(mockCourseCategories)
  
  if (error) {
    console.error('❌ Erreur catégories:', error)
  } else {
    console.log('✅ Catégories insérées')
  }
}

// Fonction pour insérer les sessions mockées
async function insertSessions(teachers) {
  console.log('📅 Insertion des sessions...')
  
  const sessions = [
    {
      name: 'Business Meeting Basics',
      description: 'Apprenez le vocabulaire essentiel pour les réunions professionnelles',
      category_id: 1,
      teacher_id: teachers[0]?.newId,
      type: 'course',
      level: 'B1',
      date_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      meeting_link: 'https://meet.google.com/abc-defg-hij',
      max_students: 5,
      price_tokens: 1
    },
    {
      name: 'Present Perfect Workshop',
      description: 'Atelier intensif sur le present perfect',
      category_id: 4,
      teacher_id: teachers[1]?.newId,
      type: 'grammar',
      level: 'B1',
      date_time: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
      meeting_link: 'https://meet.google.com/xyz-uvw-rst',
      max_students: 8,
      price_tokens: 1
    },
    {
      name: 'Travel Conversations',
      description: 'Pratiquez l\'anglais pour vos voyages',
      category_id: 2,
      teacher_id: teachers[2]?.newId,
      type: 'conversation',
      level: 'A2',
      date_time: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
      meeting_link: 'https://meet.google.com/klm-nop-qrs',
      max_students: 4,
      price_tokens: 1
    }
  ]
  
  const { error } = await supabase
    .from('sessions')
    .insert(sessions)
  
  if (error) {
    console.error('❌ Erreur sessions:', error)
  } else {
    console.log('✅ Sessions insérées')
  }
}

// Fonction principale de migration
export async function migrateToSupabase() {
  console.log('🚀 Début de la migration vers Supabase...')
  
  try {
    // 1. Insérer les catégories
    await insertCategories()
    
    // 2. Créer les utilisateurs (teachers et students)
    console.log('\n👥 Création des utilisateurs...')
    const allUsers = [...mockTeachers, ...mockStudents]
    const createdUsers = await createAuthUsers(allUsers)
    
    const teachers = createdUsers.filter(u => u.role === 'teacher')
    
    // 3. Insérer les sessions
    await insertSessions(teachers)
    
    console.log('\n✨ Migration terminée !')
    console.log('\n📝 Résumé :')
    console.log(`- ${mockCourseCategories.length} catégories`)
    console.log(`- ${createdUsers.length} utilisateurs`)
    console.log(`- 3 sessions de test`)
    
    console.log('\n🔑 Comptes de test créés :')
    console.log('- Professeurs : emma@elc.com, john@elc.com, sarah@elc.com')
    console.log('- Étudiants : alice@example.com, bob@example.com, claire@example.com')
    console.log('- Mot de passe par défaut : password123')
    
  } catch (error) {
    console.error('❌ Erreur globale:', error)
  }
}

// Note : Cette fonction nécessite les droits admin sur Supabase
// Pour l'exécuter, vous devrez utiliser la clé service_role au lieu de anon_key
console.log(`
⚠️  IMPORTANT : 
Pour exécuter cette migration, vous devez :
1. Utiliser la clé service_role de Supabase (pas anon_key)
2. Ou créer les utilisateurs manuellement dans le dashboard Supabase
3. Puis insérer les données avec les IDs des utilisateurs créés
`) 