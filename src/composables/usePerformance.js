import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Composable pour optimiser les performances
 */
export function usePerformance() {
  const isVisible = ref(true)
  const observer = ref(null)

  // Lazy loading avec Intersection Observer
  const useLazyLoading = (callback, options = {}) => {
    const { threshold = 0.1, rootMargin = '50px' } = options
    
    onMounted(() => {
      observer.value = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              callback()
              observer.value?.unobserve(entry.target)
            }
          })
        },
        { threshold, rootMargin }
      )
    })

    onUnmounted(() => {
      observer.value?.disconnect()
    })

    return {
      observe: (element) => observer.value?.observe(element)
    }
  }

  // Debounce pour les recherches
  const useDebounce = (fn, delay = 300) => {
    let timeoutId = null
    
    return (...args) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => fn.apply(null, args), delay)
    }
  }

  // Throttle pour les événements fréquents
  const useThrottle = (fn, limit = 100) => {
    let inThrottle = false
    
    return (...args) => {
      if (!inThrottle) {
        fn.apply(null, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }

  // Cache avec expiration
  const useCache = (key, ttl = 5 * 60 * 1000) => {
    const get = () => {
      const item = localStorage.getItem(key)
      if (!item) return null
      
      const { data, timestamp } = JSON.parse(item)
      if (Date.now() - timestamp > ttl) {
        localStorage.removeItem(key)
        return null
      }
      
      return data
    }

    const set = (data) => {
      const item = {
        data,
        timestamp: Date.now()
      }
      localStorage.setItem(key, JSON.stringify(item))
    }

    const clear = () => {
      localStorage.removeItem(key)
    }

    return { get, set, clear }
  }

  // Préchargement des données
  const usePreload = () => {
    const preloadedData = ref(new Map())
    
    const preload = async (key, loadFn) => {
      if (!preloadedData.value.has(key)) {
        try {
          const data = await loadFn()
          preloadedData.value.set(key, data)
        } catch (error) {
          console.error(`Erreur préchargement ${key}:`, error)
        }
      }
    }

    const get = (key) => preloadedData.value.get(key)
    
    const clear = (key) => {
      if (key) {
        preloadedData.value.delete(key)
      } else {
        preloadedData.value.clear()
      }
    }

    return { preload, get, clear }
  }

  return {
    isVisible,
    useLazyLoading,
    useDebounce,
    useThrottle,
    useCache,
    usePreload
  }
}