/**
 * Service de cache avancé avec gestion de l'expiration et de la mémoire
 */
class CacheService {
  constructor() {
    this.cache = new Map()
    this.timers = new Map()
    this.maxSize = 100 // Limite de taille du cache
  }

  /**
   * Définir une valeur dans le cache
   */
  set(key, value, ttl = 5 * 60 * 1000) {
    // Nettoyer le cache si trop plein
    if (this.cache.size >= this.maxSize) {
      this.cleanup()
    }

    // Supprimer l'ancien timer s'il existe
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key))
    }

    // Stocker la valeur
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    })

    // Programmer l'expiration
    const timer = setTimeout(() => {
      this.delete(key)
    }, ttl)
    
    this.timers.set(key, timer)
  }

  /**
   * Récupérer une valeur du cache
   */
  get(key) {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }

    // Vérifier l'expiration
    if (Date.now() - item.timestamp > item.ttl) {
      this.delete(key)
      return null
    }

    return item.value
  }

  /**
   * Supprimer une valeur du cache
   */
  delete(key) {
    this.cache.delete(key)
    
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key))
      this.timers.delete(key)
    }
  }

  /**
   * Vérifier si une clé existe
   */
  has(key) {
    return this.cache.has(key) && this.get(key) !== null
  }

  /**
   * Nettoyer les entrées expirées
   */
  cleanup() {
    const now = Date.now()
    const toDelete = []

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        toDelete.push(key)
      }
    }

    toDelete.forEach(key => this.delete(key))

    // Si encore trop plein, supprimer les plus anciens
    if (this.cache.size >= this.maxSize) {
      const entries = Array.from(this.cache.entries())
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp)
      
      const toRemove = entries.slice(0, Math.floor(this.maxSize * 0.3))
      toRemove.forEach(([key]) => this.delete(key))
    }
  }

  /**
   * Vider tout le cache
   */
  clear() {
    this.cache.clear()
    this.timers.forEach(timer => clearTimeout(timer))
    this.timers.clear()
  }

  /**
   * Obtenir les statistiques du cache
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      usage: Math.round((this.cache.size / this.maxSize) * 100)
    }
  }
}

// Instance globale
export const cacheService = new CacheService()

// Helper pour les requêtes avec cache
export const withCache = async (key, fetchFn, ttl = 5 * 60 * 1000) => {
  // Vérifier le cache d'abord
  const cached = cacheService.get(key)
  if (cached) {
    console.log(`📦 Cache hit: ${key}`)
    return cached
  }

  // Exécuter la requête
  console.log(`🔄 Cache miss: ${key}`)
  const result = await fetchFn()
  
  // Mettre en cache si succès
  if (result && !result.error) {
    cacheService.set(key, result, ttl)
  }

  return result
}