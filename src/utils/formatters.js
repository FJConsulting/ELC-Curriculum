/**
 * Utilitaires de formatage pour l'application ELC Academy
 */

// Formatage des dates
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return ''
  
  const defaultOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options
  }
  
  return new Date(dateString).toLocaleDateString('fr-FR', defaultOptions)
}

export const formatDateTime = (dateString) => {
  if (!dateString) return ''
  
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatTime = (dateString) => {
  if (!dateString) return ''
  
  return new Date(dateString).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Formatage des tailles de fichiers
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// Formatage des nombres
export const formatNumber = (number, locale = 'fr-FR') => {
  if (number === null || number === undefined) return '0'
  return new Intl.NumberFormat(locale).format(number)
}

// Formatage des pourcentages
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%'
  return `${Number(value).toFixed(decimals)}%`
}

// Formatage des prix
export const formatPrice = (price, currency = 'EUR', locale = 'fr-FR') => {
  if (price === null || price === undefined) return '0 €'
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(price)
}

// Formatage des noms (première lettre en majuscule)
export const formatName = (name) => {
  if (!name) return ''
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
}

// Formatage des initiales
export const getInitials = (name) => {
  if (!name) return 'U'
  
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}