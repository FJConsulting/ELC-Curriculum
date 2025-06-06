/**
 * Composable pour la gestion des filtres
 */

import { ref, computed, watch } from 'vue'

export function useFilters(initialFilters = {}) {
  const filters = ref({ ...initialFilters })
  const searchQuery = ref('')
  const sortBy = ref('')
  const sortOrder = ref('asc') // 'asc' ou 'desc'

  // Réinitialiser les filtres
  const resetFilters = () => {
    filters.value = { ...initialFilters }
    searchQuery.value = ''
    sortBy.value = ''
    sortOrder.value = 'asc'
  }

  // Mettre à jour un filtre spécifique
  const updateFilter = (key, value) => {
    filters.value[key] = value
  }

  // Mettre à jour plusieurs filtres
  const updateFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  // Basculer l'ordre de tri
  const toggleSortOrder = () => {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  }

  // Vérifier si des filtres sont actifs
  const hasActiveFilters = computed(() => {
    const hasFilters = Object.values(filters.value).some(value => 
      value !== '' && value !== null && value !== undefined
    )
    const hasSearch = searchQuery.value.trim() !== ''
    return hasFilters || hasSearch
  })

  // Obtenir les filtres actifs
  const activeFilters = computed(() => {
    const active = {}
    
    // Ajouter les filtres non vides
    Object.entries(filters.value).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        active[key] = value
      }
    })
    
    // Ajouter la recherche si présente
    if (searchQuery.value.trim() !== '') {
      active.search = searchQuery.value.trim()
    }
    
    return active
  })

  // Fonction de filtrage générique
  const filterItems = (items, customFilters = {}) => {
    if (!items || !Array.isArray(items)) return []

    let filtered = [...items]

    // Appliquer les filtres personnalisés
    Object.entries({ ...activeFilters.value, ...customFilters }).forEach(([key, value]) => {
      if (key === 'search') {
        // Recherche textuelle
        filtered = filtered.filter(item => {
          const searchableText = Object.values(item)
            .filter(val => typeof val === 'string')
            .join(' ')
            .toLowerCase()
          return searchableText.includes(value.toLowerCase())
        })
      } else {
        // Filtres spécifiques
        filtered = filtered.filter(item => {
          const itemValue = item[key]
          if (Array.isArray(itemValue)) {
            return itemValue.includes(value)
          }
          return itemValue === value
        })
      }
    })

    // Appliquer le tri
    if (sortBy.value) {
      filtered.sort((a, b) => {
        const aValue = a[sortBy.value]
        const bValue = b[sortBy.value]
        
        let comparison = 0
        if (aValue < bValue) comparison = -1
        if (aValue > bValue) comparison = 1
        
        return sortOrder.value === 'desc' ? -comparison : comparison
      })
    }

    return filtered
  }

  return {
    // État
    filters,
    searchQuery,
    sortBy,
    sortOrder,
    
    // Actions
    resetFilters,
    updateFilter,
    updateFilters,
    toggleSortOrder,
    filterItems,
    
    // Getters
    hasActiveFilters,
    activeFilters
  }
}

// Composable spécialisé pour la pagination
export function usePagination(itemsPerPage = 10) {
  const currentPage = ref(1)
  const pageSize = ref(itemsPerPage)

  const paginateItems = (items) => {
    if (!items || !Array.isArray(items)) return []
    
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    
    return items.slice(start, end)
  }

  const totalPages = computed(() => {
    return (items) => Math.ceil((items?.length || 0) / pageSize.value)
  })

  const goToPage = (page) => {
    currentPage.value = Math.max(1, page)
  }

  const nextPage = (items) => {
    const maxPage = totalPages.value(items)
    if (currentPage.value < maxPage) {
      currentPage.value++
    }
  }

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  const resetPagination = () => {
    currentPage.value = 1
  }

  return {
    // État
    currentPage,
    pageSize,
    
    // Actions
    paginateItems,
    goToPage,
    nextPage,
    prevPage,
    resetPagination,
    
    // Getters
    totalPages
  }
}