import { supabase, supabaseAdmin, executeQuery, executeBatch } from '../supabase/client.js'

/**
 * Service API de base pour toutes les opérations CRUD
 */
export class BaseApiService {
  constructor(tableName, useAdmin = false) {
    this.tableName = tableName
    this.client = useAdmin ? supabaseAdmin : supabase
    
    if (useAdmin && !supabaseAdmin) {
      throw new Error('Admin client not configured. Check VITE_SUPABASE_SERVICE_ROLE_KEY')
    }
  }
  
  /**
   * Récupérer tous les enregistrements
   */
  async getAll(options = {}) {
    const { select = '*', orderBy, limit, offset } = options
    
    return executeQuery(async () => {
      let query = this.client.from(this.tableName).select(select)
      
      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true })
      }
      
      if (limit) {
        query = query.limit(limit)
      }
      
      if (offset) {
        query = query.range(offset, offset + (limit || 1000) - 1)
      }
      
      return query
    })
  }
  
  /**
   * Récupérer un enregistrement par ID
   */
  async getById(id, select = '*') {
    return executeQuery(async () => {
      return this.client
        .from(this.tableName)
        .select(select)
        .eq('id', id)
        .single()
    })
  }
  
  /**
   * Créer un nouvel enregistrement
   */
  async create(data) {
    return executeQuery(async () => {
      return this.client
        .from(this.tableName)
        .insert(data)
        .select()
        .single()
    })
  }
  
  /**
   * Mettre à jour un enregistrement
   */
  async update(id, data) {
    return executeQuery(async () => {
      return this.client
        .from(this.tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single()
    })
  }
  
  /**
   * Supprimer un enregistrement
   */
  async delete(id) {
    return executeQuery(async () => {
      return this.client
        .from(this.tableName)
        .delete()
        .eq('id', id)
    })
  }
  
  /**
   * Recherche avec filtres
   */
  async search(filters = {}, options = {}) {
    const { select = '*', orderBy, limit } = options
    
    return executeQuery(async () => {
      let query = this.client.from(this.tableName).select(select)
      
      // Appliquer les filtres
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          if (typeof value === 'string' && key.includes('search')) {
            query = query.ilike(key.replace('_search', ''), `%${value}%`)
          } else {
            query = query.eq(key, value)
          }
        }
      })
      
      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true })
      }
      
      if (limit) {
        query = query.limit(limit)
      }
      
      return query
    })
  }
  
  /**
   * Opérations en lot
   */
  async createMany(dataArray) {
    return executeQuery(async () => {
      return this.client
        .from(this.tableName)
        .insert(dataArray)
        .select()
    })
  }
  
  async updateMany(updates) {
    const operations = updates.map(({ id, data }) => 
      () => this.update(id, data)
    )
    
    return executeBatch(operations)
  }
  
  async deleteMany(ids) {
    return executeQuery(async () => {
      return this.client
        .from(this.tableName)
        .delete()
        .in('id', ids)
    })
  }
}

/**
 * Factory pour créer des services API spécialisés
 */
export const createApiService = (tableName, useAdmin = false) => {
  return new BaseApiService(tableName, useAdmin)
}

// Services pré-configurés pour les tables principales
export const profilesService = createApiService('profiles', true)  // ✅ Nom plus explicite
export const sessionsService = createApiService('sessions', true)
export const resourcesService = createApiService('resources', true)
export const categoriesService = createApiService('categories', true)
export const courseTypesService = createApiService('course_types', true)
export const templatesService = createApiService('templates', true)
export const evaluationsService = createApiService('evaluations', true)