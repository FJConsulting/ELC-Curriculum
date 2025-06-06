import { BaseApiService } from './base.js'
import { withCache, cacheService } from '../cache.js'
import { usePerformance } from '../../composables/usePerformance.js'

/**
 * Service API optimisé avec cache et performance
 */
export class OptimizedApiService extends BaseApiService {
  constructor(tableName, useAdmin = false) {
    super(tableName, useAdmin)
    this.cachePrefix = `api_${tableName}_`
    const { useDebounce } = usePerformance()
    this.debouncedSearch = useDebounce(this.search.bind(this), 300)
  }

  /**
   * Récupérer tous avec cache
   */
  async getAll(options = {}, useCache = true) {
    const cacheKey = `${this.cachePrefix}all_${JSON.stringify(options)}`
    
    if (useCache) {
      return withCache(cacheKey, () => super.getAll(options))
    }
    
    return super.getAll(options)
  }

  /**
   * Récupérer par ID avec cache
   */
  async getById(id, select = '*', useCache = true) {
    const cacheKey = `${this.cachePrefix}${id}_${select}`
    
    if (useCache) {
      return withCache(cacheKey, () => super.getById(id, select))
    }
    
    return super.getById(id, select)
  }

  /**
   * Créer avec invalidation de cache
   */
  async create(data) {
    const result = await super.create(data)
    
    if (result && !result.error) {
      // Invalider les caches liés
      this.invalidateCache(['all', 'search'])
    }
    
    return result
  }

  /**
   * Mettre à jour avec invalidation de cache
   */
  async update(id, data) {
    const result = await super.update(id, data)
    
    if (result && !result.error) {
      // Invalider les caches liés
      this.invalidateCache(['all', 'search', id])
    }
    
    return result
  }

  /**
   * Supprimer avec invalidation de cache
   */
  async delete(id) {
    const result = await super.delete(id)
    
    if (result && !result.error) {
      // Invalider les caches liés
      this.invalidateCache(['all', 'search', id])
    }
    
    return result
  }

  /**
   * Recherche avec debounce et cache
   */
  async searchWithDebounce(filters = {}, options = {}) {
    return this.debouncedSearch(filters, options)
  }

  /**
   * Recherche avec cache
   */
  async search(filters = {}, options = {}, useCache = true) {
    const cacheKey = `${this.cachePrefix}search_${JSON.stringify({ filters, options })}`
    
    if (useCache) {
      return withCache(cacheKey, () => super.search(filters, options), 2 * 60 * 1000) // Cache plus court pour les recherches
    }
    
    return super.search(filters, options)
  }

  /**
   * Invalider les caches
   */
  invalidateCache(patterns = []) {
    const stats = cacheService.getStats()
    console.log(`🗑️ Invalidation cache ${this.tableName}:`, patterns)
    
    patterns.forEach(pattern => {
      const keys = this.getCacheKeys(pattern)
      keys.forEach(key => cacheService.delete(key))
    })
    
    console.log(`📊 Cache stats après invalidation:`, cacheService.getStats())
  }

  /**
   * Obtenir les clés de cache correspondant à un pattern
   */
  getCacheKeys(pattern) {
    const keys = []
    const prefix = this.cachePrefix
    
    // Simulation - dans un vrai cas, il faudrait itérer sur les clés du cache
    if (pattern === 'all') {
      keys.push(`${prefix}all_*`)
    } else if (pattern === 'search') {
      keys.push(`${prefix}search_*`)
    } else {
      keys.push(`${prefix}${pattern}_*`)
    }
    
    return keys
  }

  /**
   * Précharger les données fréquemment utilisées
   */
  async preloadCommonData() {
    try {
      console.log(`🔄 Préchargement ${this.tableName}...`)
      
      // Précharger les données les plus courantes
      await Promise.all([
        this.getAll({ limit: 50 }),
        this.search({}, { limit: 20 })
      ])
      
      console.log(`✅ Préchargement ${this.tableName} terminé`)
    } catch (error) {
      console.error(`❌ Erreur préchargement ${this.tableName}:`, error)
    }
  }
}

// Services optimisés
export const optimizedUsersService = new OptimizedApiService('users', true)
export const optimizedSessionsService = new OptimizedApiService('sessions', true)
export const optimizedResourcesService = new OptimizedApiService('resources', true)
export const optimizedCategoriesService = new OptimizedApiService('categories', true)
export const optimizedCourseTypesService = new OptimizedApiService('course_types', true)
export const optimizedTemplatesService = new OptimizedApiService('templates', true)