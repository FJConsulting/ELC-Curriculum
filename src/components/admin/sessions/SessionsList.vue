<template>
  <div class="bg-white rounded-xl shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
      <table ref="resizableTable" class="min-w-full divide-y divide-gray-200 resizable-table">
        <thead class="bg-gray-50">
          <tr>
            <th class="resizable-th relative px-6 py-3" style="width: 160px; min-width: 140px;">
              <span class="sr-only">Actions</span>
              <div class="resize-handle" @mousedown="startResize($event, 0)"></div>
            </th>
            <th class="resizable-th px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 200px; min-width: 150px;">
              Session
              <div class="resize-handle" @mousedown="startResize($event, 1)"></div>
            </th>
            <th class="resizable-th px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 150px; min-width: 120px;">
              Catégorie
              <div class="resize-handle" @mousedown="startResize($event, 2)"></div>
            </th>
            <th class="resizable-th px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 120px; min-width: 100px;">
              Professeur
              <div class="resize-handle" @mousedown="startResize($event, 3)"></div>
            </th>
            <th class="resizable-th px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 140px; min-width: 120px;">
              Date & Heure
              <div class="resize-handle" @mousedown="startResize($event, 4)"></div>
            </th>
            <th class="resizable-th px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 100px; min-width: 80px;">
              Inscrits
              <div class="resize-handle" @mousedown="startResize($event, 5)"></div>
            </th>
            <th class="resizable-th px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 120px; min-width: 100px;">
              Ressources
              <div class="resize-handle" @mousedown="startResize($event, 6)"></div>
            </th>
            <th class="resizable-th px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 100px; min-width: 80px;">
              Statut
              <div class="resize-handle" @mousedown="startResize($event, 7)"></div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="session in sessions" :key="session.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
              <div class="flex justify-start space-x-2">
                <button 
                  @click="$emit('view-session', session)"
                  class="text-gray-600 hover:text-gray-900"
                  title="Détails"
                >
                  👁️
                </button>
                <button 
                  @click="$emit('edit-session', session)"
                  class="text-primary-600 hover:text-primary-900"
                  title="Modifier"
                >
                  ✏️
                </button>
                <button 
                  @click="$emit('delete-session', session)"
                  class="text-red-600 hover:text-red-900"
                  title="Supprimer"
                >
                  🗑️
                </button>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div>
                <div class="text-sm font-medium text-gray-900">{{ session.name }}</div>
                <div class="text-sm text-gray-500">Niveau {{ session.level }}</div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <span class="mr-2">{{ getCategoryById(session.categoryId)?.icon }}</span>
                <span class="text-sm text-gray-900">{{ getCategoryById(session.categoryId)?.name }}</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ session.teacher }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <!-- Ligne 58 -->
              {{ formatDate(session.dateTime) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <span class="text-sm font-medium">{{ session.enrolled.length }}/{{ session.maxStudents }}</span>
                <div class="ml-2 w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-primary-500 h-2 rounded-full"
                    :style="{ width: (session.enrolled.length / session.maxStudents * 100) + '%' }"
                  ></div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center space-x-1">
                <span 
                  v-if="getSessionResources(session.id).some(r => r.type === 'video')"
                  class="text-sm" 
                  title="Vidéos"
                >🎥</span>
                <span 
                  v-if="getSessionResources(session.id).some(r => r.type === 'pdf')"
                  class="text-sm" 
                  title="Documents PDF"
                >📄</span>
                <span 
                  v-if="getSessionResources(session.id).some(r => r.type === 'audio')"
                  class="text-sm" 
                  title="Audio"
                >🎵</span>
                <span class="text-xs text-gray-500">
                  ({{ getSessionResources(session.id).length }})
                </span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                :class="[
                  session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                  session.status === 'completed' ? 'bg-green-100 text-green-800' :
                  session.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800',
                  'px-2 py-1 text-xs rounded-full font-medium'
                ]"
              >
                {{ getStatusLabel(session.status) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Assigner defineProps à une constante props
const props = defineProps({
  sessions: {
    type: Array,
    default: () => []
  },
  categories: {
    type: Array,
    default: () => []
  },
  resources: {
    type: Array,
    default: () => []
  }
})

defineEmits([
  'view-session',
  'edit-session',
  'delete-session'
])

// Logique de redimensionnement des colonnes
const resizableTable = ref(null)
const isResizing = ref(false)
const currentColumn = ref(null)
const startX = ref(0)
const startWidth = ref(0)
const columnIndex = ref(0)

// Méthodes utilitaires
const formatDate = (dateString) => {
  if (!dateString) return 'Date non définie'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'Date invalide'
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusLabel = (status) => {
  const labels = {
    'scheduled': 'Planifiée',
    'completed': 'Terminée',
    'cancelled': 'Annulée',
    'draft': 'Brouillon'
  }
  return labels[status] || status
}

const getCategoryById = (id) => {
  return props.categories.find(c => c.id === id)
}

const getSessionResources = (sessionId) => {
  return props.resources.filter(r => r.sessionId === sessionId)
}

// Méthodes de redimensionnement
const startResize = (e, colIndex) => {
  e.preventDefault()
  e.stopPropagation()
  
  isResizing.value = true
  columnIndex.value = colIndex
  startX.value = e.clientX
  
  const table = resizableTable.value
  if (!table) return
  
  const th = table.querySelectorAll('thead th')[colIndex]
  if (!th) return
  
  const computedStyle = window.getComputedStyle(th)
  startWidth.value = parseInt(computedStyle.width, 10)
  currentColumn.value = th
  
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
  
  document.addEventListener('mousemove', doResize, { passive: false })
  document.addEventListener('mouseup', stopResize, { passive: false })
}

const doResize = (e) => {
  if (!isResizing.value || !currentColumn.value) return
  
  e.preventDefault()
  
  const deltaX = e.clientX - startX.value
  const newWidth = startWidth.value + deltaX
  
  const minWidth = 80
  const maxWidth = 500
  
  if (newWidth >= minWidth && newWidth <= maxWidth) {
    currentColumn.value.style.width = newWidth + 'px'
    currentColumn.value.style.minWidth = newWidth + 'px'
    
    const table = resizableTable.value
    if (table) {
      const rows = table.querySelectorAll('tbody tr')
      rows.forEach(row => {
        const cell = row.children[columnIndex.value]
        if (cell) {
          cell.style.width = newWidth + 'px'
          cell.style.minWidth = newWidth + 'px'
          cell.style.maxWidth = newWidth + 'px'
        }
      })
    }
  }
}

const stopResize = () => {
  isResizing.value = false
  currentColumn.value = null
  document.body.style.cursor = 'default'
  document.body.style.userSelect = 'auto'
  
  document.removeEventListener('mousemove', doResize)
  document.removeEventListener('mouseup', stopResize)
}
</script>

<style scoped>
.resizable-table {
  width: 100%;
  table-layout: auto;
}

.resizable-th {
  position: relative;
  border-right: 1px solid #e5e7eb;
  box-sizing: border-box;
  white-space: nowrap;
}

.resize-handle {
  position: absolute;
  top: 0;
  right: -4px;
  width: 8px;
  height: 100%;
  cursor: col-resize;
  background: transparent;
  z-index: 20;
  user-select: none;
  border-right: 2px solid transparent;
  transition: all 0.2s ease;
}

.resize-handle:hover {
  background: rgba(59, 130, 246, 0.1);
  border-right: 2px solid rgba(59, 130, 246, 0.5);
}

.resize-handle:active {
  background: rgba(59, 130, 246, 0.2);
  border-right: 2px solid rgba(59, 130, 246, 0.8);
}

.resizable-th:hover .resize-handle {
  background: rgba(59, 130, 246, 0.05);
}

.resizable-th:hover .resize-handle::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 2px;
  height: 16px;
  background: rgba(59, 130, 246, 0.7);
  border-radius: 1px;
}

@media (max-width: 768px) {
  .resize-handle {
    display: none;
  }
  
  .resizable-table {
    table-layout: auto;
  }
}

.resizable-table tbody td {
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>