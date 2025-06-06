/**
 * Constantes globales pour l'application ELC Academy
 */

// Statuts des sessions
export const SESSION_STATUS = {
  DRAFT: 'draft',
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

// Types de ressources
export const RESOURCE_TYPES = {
  PDF: 'pdf',
  VIDEO: 'video',
  AUDIO: 'audio',
  IMAGE: 'image',
  DOCUMENT: 'document',
  PRESENTATION: 'presentation'
}

// Icônes pour les types de ressources
export const RESOURCE_ICONS = {
  [RESOURCE_TYPES.PDF]: '📄',
  [RESOURCE_TYPES.VIDEO]: '🎥',
  [RESOURCE_TYPES.AUDIO]: '🎵',
  [RESOURCE_TYPES.IMAGE]: '🖼️',
  [RESOURCE_TYPES.DOCUMENT]: '📃',
  [RESOURCE_TYPES.PRESENTATION]: '📊'
}

// Extensions de fichiers acceptées
export const ACCEPTED_FILE_EXTENSIONS = {
  [RESOURCE_TYPES.PDF]: ['pdf'],
  [RESOURCE_TYPES.VIDEO]: ['mp4', 'avi', 'mov', 'wmv'],
  [RESOURCE_TYPES.AUDIO]: ['mp3', 'wav', 'ogg', 'm4a'],
  [RESOURCE_TYPES.IMAGE]: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  [RESOURCE_TYPES.DOCUMENT]: ['doc', 'docx', 'txt', 'rtf'],
  [RESOURCE_TYPES.PRESENTATION]: ['ppt', 'pptx', 'odp']
}

// Taille maximale des fichiers (en bytes)
export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

// Niveaux d'anglais
export const ENGLISH_LEVELS = [
  { value: 'A1', label: 'A1 - Débutant' },
  { value: 'A2', label: 'A2 - Élémentaire' },
  { value: 'B1', label: 'B1 - Intermédiaire' },
  { value: 'B2', label: 'B2 - Intermédiaire supérieur' },
  { value: 'C1', label: 'C1 - Avancé' },
  { value: 'C2', label: 'C2 - Maîtrise' }
]

// Rôles utilisateur
export const USER_ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin'
}

// Types de notifications
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
}

// Durées des notifications (en ms)
export const NOTIFICATION_DURATION = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 8000
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50]
}

// Couleurs du thème
export const THEME_COLORS = {
  PRIMARY: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8'
  },
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#06b6d4'
}

// Regex patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
}