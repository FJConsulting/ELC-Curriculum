/**
 * Composable pour la gestion des modals
 */

import { ref, computed } from 'vue'

export function useModal(initialState = false) {
  const isOpen = ref(initialState)
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Actions
  const open = (modalData = null) => {
    data.value = modalData
    error.value = null
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
    data.value = null
    error.value = null
    loading.value = false
  }

  const setLoading = (state) => {
    loading.value = state
  }

  const setError = (errorMessage) => {
    error.value = errorMessage
    loading.value = false
  }

  const setData = (newData) => {
    data.value = newData
  }

  // Getters
  const hasData = computed(() => data.value !== null)
  const hasError = computed(() => error.value !== null)

  return {
    // État
    isOpen,
    data,
    loading,
    error,
    
    // Actions
    open,
    close,
    setLoading,
    setError,
    setData,
    
    // Getters
    hasData,
    hasError
  }
}

// Composable spécialisé pour les modals de confirmation
export function useConfirmModal() {
  const modal = useModal()
  const confirmCallback = ref(null)
  const cancelCallback = ref(null)

  const confirm = (options = {}) => {
    const {
      title = 'Confirmation',
      message = 'Êtes-vous sûr de vouloir continuer ?',
      confirmText = 'Confirmer',
      cancelText = 'Annuler',
      onConfirm = () => {},
      onCancel = () => {}
    } = options

    modal.setData({
      title,
      message,
      confirmText,
      cancelText
    })

    confirmCallback.value = onConfirm
    cancelCallback.value = onCancel
    modal.open()
  }

  const handleConfirm = async () => {
    if (confirmCallback.value) {
      modal.setLoading(true)
      try {
        await confirmCallback.value()
        modal.close()
      } catch (error) {
        modal.setError(error.message || 'Une erreur est survenue')
      }
    } else {
      modal.close()
    }
  }

  const handleCancel = () => {
    if (cancelCallback.value) {
      cancelCallback.value()
    }
    modal.close()
  }

  return {
    ...modal,
    confirm,
    handleConfirm,
    handleCancel
  }
}