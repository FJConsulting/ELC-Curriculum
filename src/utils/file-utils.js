/**
 * Utilitaires pour la gestion des fichiers
 */

import { RESOURCE_TYPES, ACCEPTED_FILE_EXTENSIONS } from './constants.js'

// Obtenir le type de fichier à partir de l'extension
export const getFileType = (filename) => {
  if (!filename) return null
  
  const extension = filename.split('.').pop().toLowerCase()
  
  for (const [type, extensions] of Object.entries(ACCEPTED_FILE_EXTENSIONS)) {
    if (extensions.includes(extension)) {
      return type
    }
  }
  
  return 'document' // Type par défaut
}

// Obtenir l'icône d'un fichier
export const getFileIcon = (filename) => {
  const type = getFileType(filename)
  const icons = {
    [RESOURCE_TYPES.PDF]: '📄',
    [RESOURCE_TYPES.VIDEO]: '🎥',
    [RESOURCE_TYPES.AUDIO]: '🎵',
    [RESOURCE_TYPES.IMAGE]: '🖼️',
    [RESOURCE_TYPES.DOCUMENT]: '📃',
    [RESOURCE_TYPES.PRESENTATION]: '📊'
  }
  
  return icons[type] || '📄'
}

// Convertir un fichier en base64
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

// Télécharger un fichier
export const downloadFile = (url, filename) => {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Créer un nom de fichier unique
export const generateUniqueFilename = (originalName) => {
  const timestamp = Date.now()
  const extension = originalName.split('.').pop()
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '')
  
  return `${nameWithoutExt}_${timestamp}.${extension}`
}

// Valider les dimensions d'une image
export const validateImageDimensions = (file, maxWidth = 1920, maxHeight = 1080) => {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve({ valid: true }) // Pas une image, pas de validation
      return
    }
    
    const img = new Image()
    img.onload = () => {
      const valid = img.width <= maxWidth && img.height <= maxHeight
      resolve({
        valid,
        width: img.width,
        height: img.height,
        error: valid ? null : `Image trop grande (max ${maxWidth}x${maxHeight}px)`
      })
    }
    
    img.onerror = () => {
      resolve({ valid: false, error: 'Impossible de lire l\'image' })
    }
    
    img.src = URL.createObjectURL(file)
  })
}