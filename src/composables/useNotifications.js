/**
 * Composable pour la gestion des notifications
 */

import { ref, computed } from 'vue'
import { NOTIFICATION_TYPES, NOTIFICATION_DURATION } from '@/utils/constants.js'

const notifications = ref([])
let notificationId = 0

export function useNotifications() {
  // Ajouter une notification
  const addNotification = (options) => {
    const {
      type = NOTIFICATION_TYPES.INFO,
      title = '',
      message = '',
      duration = NOTIFICATION_DURATION.MEDIUM,
      persistent = false,
      actions = []
    } = options

    const notification = {
      id: ++notificationId,
      type,
      title,
      message,
      duration,
      persistent,
      actions,
      timestamp: new Date(),
      visible: true
    }

    notifications.value.push(notification)

    // Auto-suppression si pas persistante
    if (!persistent && duration > 0) {
      setTimeout(() => {
        removeNotification(notification.id)
      }, duration)
    }

    return notification.id
  }

  // Supprimer une notification
  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  // Supprimer toutes les notifications
  const clearNotifications = () => {
    notifications.value = []
  }

  // Méthodes de convenance pour chaque type
  const success = (message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.SUCCESS,
      message,
      duration: NOTIFICATION_DURATION.SHORT,
      ...options
    })
  }

  const error = (message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.ERROR,
      message,
      duration: NOTIFICATION_DURATION.LONG,
      ...options
    })
  }

  const warning = (message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.WARNING,
      message,
      duration: NOTIFICATION_DURATION.MEDIUM,
      ...options
    })
  }

  const info = (message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.INFO,
      message,
      duration: NOTIFICATION_DURATION.MEDIUM,
      ...options
    })
  }

  // Notification de confirmation d'action
  const confirmAction = (message, onConfirm, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.WARNING,
      message,
      persistent: true,
      actions: [
        {
          label: 'Confirmer',
          action: () => {
            onConfirm()
            removeNotification(id)
          },
          primary: true
        },
        {
          label: 'Annuler',
          action: () => removeNotification(id)
        }
      ],
      ...options
    })
  }

  // Getters
  const visibleNotifications = computed(() => {
    return notifications.value.filter(n => n.visible)
  })

  const hasNotifications = computed(() => {
    return visibleNotifications.value.length > 0
  })

  const notificationsByType = computed(() => {
    const grouped = {}
    Object.values(NOTIFICATION_TYPES).forEach(type => {
      grouped[type] = visibleNotifications.value.filter(n => n.type === type)
    })
    return grouped
  })

  return {
    // État
    notifications: visibleNotifications,
    
    // Actions
    addNotification,
    removeNotification,
    clearNotifications,
    
    // Méthodes de convenance
    success,
    error,
    warning,
    info,
    confirmAction,
    
    // Getters
    hasNotifications,
    notificationsByType
  }
}

// Composable pour les notifications de chargement
export function useLoadingNotification() {
  const { addNotification, removeNotification } = useNotifications()
  const loadingNotifications = ref(new Map())

  const showLoading = (message = 'Chargement...', key = 'default') => {
    // Supprimer l'ancienne notification de chargement si elle existe
    if (loadingNotifications.value.has(key)) {
      removeNotification(loadingNotifications.value.get(key))
    }

    const id = addNotification({
      type: NOTIFICATION_TYPES.INFO,
      message,
      persistent: true,
      duration: 0
    })

    loadingNotifications.value.set(key, id)
    return id
  }

  const hideLoading = (key = 'default') => {
    if (loadingNotifications.value.has(key)) {
      const id = loadingNotifications.value.get(key)
      removeNotification(id)
      loadingNotifications.value.delete(key)
    }
  }

  const updateLoading = (message, key = 'default') => {
    hideLoading(key)
    return showLoading(message, key)
  }

  return {
    showLoading,
    hideLoading,
    updateLoading
  }
}