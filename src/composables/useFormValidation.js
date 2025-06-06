/**
 * Composable pour la validation de formulaires
 */

import { ref, computed, watch } from 'vue'
import { validateForm } from '@/utils/validators.js'

export function useFormValidation(initialData = {}, validationRules = {}) {
  const formData = ref({ ...initialData })
  const errors = ref({})
  const touched = ref({})
  const isSubmitting = ref(false)

  // Valider un champ spécifique
  const validateField = (fieldName) => {
    const fieldRules = validationRules[fieldName]
    if (!fieldRules) return true

    const fieldValue = formData.value[fieldName]
    
    for (const rule of fieldRules) {
      if (rule.required && (!fieldValue || fieldValue.toString().trim() === '')) {
        errors.value[fieldName] = rule.message || `${fieldName} est requis`
        return false
      }
      
      if (fieldValue && rule.validator && !rule.validator(fieldValue)) {
        errors.value[fieldName] = rule.message || `${fieldName} n'est pas valide`
        return false
      }
    }
    
    // Supprimer l'erreur si la validation passe
    delete errors.value[fieldName]
    return true
  }

  // Valider tout le formulaire
  const validateAll = () => {
    const result = validateForm(formData.value, validationRules)
    errors.value = result.errors
    return result.isValid
  }

  // Marquer un champ comme touché
  const touchField = (fieldName) => {
    touched.value[fieldName] = true
  }

  // Réinitialiser le formulaire
  const resetForm = () => {
    formData.value = { ...initialData }
    errors.value = {}
    touched.value = {}
    isSubmitting.value = false
  }

  // Mettre à jour les données du formulaire
  const updateField = (fieldName, value) => {
    formData.value[fieldName] = value
    
    // Valider le champ si il a été touché
    if (touched.value[fieldName]) {
      validateField(fieldName)
    }
  }

  // Soumettre le formulaire
  const submitForm = async (submitHandler) => {
    isSubmitting.value = true
    
    // Marquer tous les champs comme touchés
    Object.keys(validationRules).forEach(field => {
      touched.value[field] = true
    })
    
    // Valider tout le formulaire
    const isValid = validateAll()
    
    if (!isValid) {
      isSubmitting.value = false
      return { success: false, errors: errors.value }
    }
    
    try {
      const result = await submitHandler(formData.value)
      isSubmitting.value = false
      return { success: true, data: result }
    } catch (error) {
      isSubmitting.value = false
      return { success: false, error: error.message }
    }
  }

  // Getters
  const isValid = computed(() => Object.keys(errors.value).length === 0)
  const hasErrors = computed(() => Object.keys(errors.value).length > 0)
  const isDirty = computed(() => {
    return JSON.stringify(formData.value) !== JSON.stringify(initialData)
  })

  // Watcher pour la validation en temps réel
  watch(
    () => formData.value,
    () => {
      // Valider seulement les champs touchés
      Object.keys(touched.value).forEach(field => {
        if (touched.value[field]) {
          validateField(field)
        }
      })
    },
    { deep: true }
  )

  return {
    // État
    formData,
    errors,
    touched,
    isSubmitting,
    
    // Actions
    validateField,
    validateAll,
    touchField,
    resetForm,
    updateField,
    submitForm,
    
    // Getters
    isValid,
    hasErrors,
    isDirty
  }
}