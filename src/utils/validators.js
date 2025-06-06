/**
 * Fonctions de validation pour l'application ELC Academy
 */

import { REGEX_PATTERNS, MAX_FILE_SIZE, ACCEPTED_FILE_EXTENSIONS } from './constants.js'

// Validation email
export const isValidEmail = (email) => {
  if (!email) return false
  return REGEX_PATTERNS.EMAIL.test(email)
}

// Validation téléphone
export const isValidPhone = (phone) => {
  if (!phone) return false
  return REGEX_PATTERNS.PHONE.test(phone)
}

// Validation mot de passe
export const isValidPassword = (password) => {
  if (!password) return false
  return REGEX_PATTERNS.PASSWORD.test(password)
}

// Validation nom/prénom
export const isValidName = (name) => {
  if (!name) return false
  return name.trim().length >= 2 && name.trim().length <= 50
}

// Validation date
export const isValidDate = (date) => {
  if (!date) return false
  const dateObj = new Date(date)
  return dateObj instanceof Date && !isNaN(dateObj)
}

// Validation date future
export const isFutureDate = (date) => {
  if (!isValidDate(date)) return false
  return new Date(date) > new Date()
}

// Validation fichier
export const isValidFile = (file) => {
  if (!file) return { valid: false, error: 'Aucun fichier sélectionné' }
  
  // Vérifier la taille
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Le fichier est trop volumineux (max ${MAX_FILE_SIZE / 1024 / 1024}MB)`
    }
  }
  
  // Vérifier l'extension
  const extension = file.name.split('.').pop().toLowerCase()
  const allExtensions = Object.values(ACCEPTED_FILE_EXTENSIONS).flat()
  
  if (!allExtensions.includes(extension)) {
    return {
      valid: false,
      error: `Type de fichier non supporté (.${extension})`
    }
  }
  
  return { valid: true }
}

// Validation URL
export const isValidUrl = (url) => {
  if (!url) return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Validation nombre
export const isValidNumber = (value, min = null, max = null) => {
  const num = Number(value)
  if (isNaN(num)) return false
  if (min !== null && num < min) return false
  if (max !== null && num > max) return false
  return true
}

// Validation texte requis
export const isRequired = (value) => {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  return true
}

// Validation longueur de texte
export const isValidLength = (text, min = 0, max = Infinity) => {
  if (!text) return min === 0
  const length = text.trim().length
  return length >= min && length <= max
}

// Validation formulaire générique
export const validateForm = (data, rules) => {
  const errors = {}
  
  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field]
    
    for (const rule of fieldRules) {
      if (rule.required && !isRequired(value)) {
        errors[field] = rule.message || `${field} est requis`
        break
      }
      
      if (value && rule.validator && !rule.validator(value)) {
        errors[field] = rule.message || `${field} n'est pas valide`
        break
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}