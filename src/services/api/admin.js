import { BaseApiService } from './base.js'
import { executeQuery } from '../supabase/client.js'

/**
 * Service API spécialisé pour les opérations d'administration
 */
export class AdminApiService extends BaseApiService {
  constructor(tableName) {
    super(tableName, true) // Utilise toujours le client admin
  }
  
  /**
   * Statistiques globales
   */
  async getStats() {
    return executeQuery(async () => {
      const [students, teachers, sessions] = await Promise.all([
        this.client.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'student'),  // ✅ Changé
        this.client.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'teacher'),  // ✅ Changé
        this.client.from('sessions').select('id', { count: 'exact', head: true })
      ])
      
      return {
        students: students.count || 0,
        teachers: teachers.count || 0,
        sessions: sessions.count || 0
      }
    })
  }
  
  /**
   * Sessions à venir
   */
  async getUpcomingSessions(limit = 10) {
    return executeQuery(async () => {
      return this.client
        .from('sessions')
        .select(`
          *,
          course_types(name),
          categories(name)
        `)
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true })
        .limit(limit)
    })
  }
  
  /**
   * Recherche d'utilisateurs avec filtres avancés
   */
  // Remplacer toutes les références à 'users' par 'profiles'
  async searchUsers(filters = {}) {
    const { search, level, status, limit = 50 } = filters
    
    return executeQuery(async () => {
      let query = this.client
        .from('profiles')  // ✅ Changé de 'users' à 'profiles'
        .select('*')
        .order('created_at', { ascending: false })
      
      if (search) {
        query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`)
      }
      
      if (level) {
        query = query.eq('level', level)
      }
      
      if (status) {
        query = query.eq('status', status)
      }
      
      return query.limit(limit)
    })
  }
  
  /**
   * Récupérer les sessions d'un professeur avec résumé
   */
  async getTeacherSessions(teacherId) {
    return executeQuery(async () => {
      const { data: sessions, error } = await this.client
        .from('sessions')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('date_time', { ascending: true })
      
      if (error) throw error
      
      const now = new Date()
      const futureSessions = sessions.filter(session => new Date(session.date_time) > now)
      const pastSessions = sessions.filter(session => new Date(session.date_time) <= now)
      
      return {
        sessions: sessions || [],
        summary: {
          total_sessions: sessions ? sessions.length : 0,
          future_sessions: futureSessions.length,
          past_sessions: pastSessions.length
        }
      }
    })
  }
  
  /**
   * Réassigner une session à un autre professeur
   */
  async reassignSession(sessionId, newTeacherId) {
    return executeQuery(async () => {
      return this.client
        .from('sessions')
        .update({ teacher_id: newTeacherId })
        .eq('id', sessionId)
    })
  }

  /**
   * Supprimer un professeur de manière sécurisée
   * Réassigne ses sessions futures si un nouveau professeur est spécifié
   */
  async deleteTeacherSafely(teacherId, reassignToTeacherId = null) {
    return executeQuery(async () => {
      console.log('🔍 Début suppression professeur:', teacherId)
      
      // Si réassignation demandée, réassigner toutes les sessions futures
      if (reassignToTeacherId) {
        console.log('📝 Réassignation des sessions vers:', reassignToTeacherId)
        const { error: reassignError } = await this.client
          .from('sessions')
          .update({ teacher_id: reassignToTeacherId })
          .eq('teacher_id', teacherId)
          .gte('date_time', new Date().toISOString())
        
        if (reassignError) {
          console.error('❌ Erreur réassignation:', reassignError)
          throw new Error(`Erreur lors de la réassignation: ${reassignError.message}`)
        }
        console.log('✅ Réassignation terminée')
      }
      
      // Supprimer le professeur de la table profiles
      console.log('🗑️ Suppression du professeur de la table profiles')
      const result = await this.client
        .from('profiles')  // ✅ Changé de 'users' à 'profiles'
        .delete()
        .eq('id', teacherId)
      
      console.log('📊 Résultat suppression:', result)
      
      if (result.error) {
        console.error('❌ Erreur suppression:', result.error)
        throw new Error(`Erreur suppression: ${result.error.message}`)
      }
      
      console.log('✅ Suppression terminée avec succès')
      return result
    })
  }

  /**
   * Obtenir les professeurs disponibles pour réassignation
   */
  async getAvailableTeachers() {
    return executeQuery(async () => {
      return this.client
        .from('profiles')  // ✅ Changé de 'users' à 'profiles'
        .select('id, first_name, last_name, email')
        .eq('role', 'teacher')
        .eq('is_active', true)
        .order('last_name', { ascending: true })
    })
  }

  /**
   * Export de données
   */
  async exportData(table, format = 'json') {
    return executeQuery(async () => {
      const { data } = await this.client.from(table).select('*')
      
      if (format === 'csv') {
        return {
          data: this.convertToCSV(data),
          type: 'text/csv'
        }
      }
      
      return {
        data: JSON.stringify(data, null, 2),
        type: 'application/json'
      }
    })
  }
  
  /**
   * Convertir en CSV
   */
  convertToCSV(data) {
    if (!data || data.length === 0) return ''
    
    const headers = Object.keys(data[0])
    const csvHeaders = headers.join(',')
    
    const csvRows = data.map(row => 
      headers.map(header => {
        const value = row[header]
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
      }).join(',')
    )
    
    return [csvHeaders, ...csvRows].join('\n')
  }
}

export const adminService = new AdminApiService('profiles')