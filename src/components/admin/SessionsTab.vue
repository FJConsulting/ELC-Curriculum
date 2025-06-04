<template>
  <div class="space-y-6">
    <!-- Filter and Actions -->
    <div class="bg-white rounded-xl shadow-sm p-4">
      <div class="flex flex-col md:flex-row justify-between gap-4">
        <div class="flex flex-col sm:flex-row gap-4">
          <select 
            v-model="sessionFilter.category"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Toutes les catégories</option>
            <option v-for="cat in adminStore.categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
          <select 
            v-model="sessionFilter.status"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Tous les statuts</option>
            <option value="scheduled">Planifiées</option>
            <option value="completed">Terminées</option>
            <option value="cancelled">Annulées</option>
            <option value="draft">Brouillons</option>
          </select>
          <input 
            v-model="sessionFilter.search"
            type="text"
            placeholder="Rechercher une session..."
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
        </div>
        <button 
          @click="showSessionModal()"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
        >
          <span class="text-white text-lg font-bold">+</span> Nouvelle session
        </button>
      </div>
    </div>

    <!-- Sessions List Enhanced -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                Session
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                Catégorie
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                Professeur
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">
                Date & Heure
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                Inscrits
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                Ressources
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                Statut
              </th>
              <th class="relative px-6 py-3 min-w-[160px]">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="session in filteredSessions" :key="session.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap min-w-[200px]">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ session.name }}</div>
                  <div class="text-sm text-gray-500">Niveau {{ session.level }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap min-w-[150px]">
                <div class="flex items-center">
                  <span class="mr-2">{{ getCategoryById(session.categoryId)?.icon }}</span>
                  <span class="text-sm text-gray-900">{{ getCategoryById(session.categoryId)?.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 min-w-[120px]">
                {{ session.teacher }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 min-w-[140px]">
                {{ formatDate(session.date_time || session.dateTime) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap min-w-[100px]">
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
              <td class="px-6 py-4 whitespace-nowrap min-w-[120px]">
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
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium min-w-[160px]">
                <div class="flex justify-end space-x-2">
                  <button 
                    @click="showSessionDetailModal(session)"
                    class="text-gray-600 hover:text-gray-900"
                    title="Détails"
                  >
                    👁️
                  </button>
                  <button 
                    @click="showSessionModal(session)"
                    class="text-primary-600 hover:text-primary-900"
                    title="Modifier"
                  >
                    ✏️
                  </button>
                  <button 
                    @click="deleteSession(session)"
                    class="text-red-600 hover:text-red-900"
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Enhanced Session Modal -->
    <div v-if="sessionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h3 class="text-xl font-semibold mb-4">
          {{ editingSession ? 'Modifier la session' : 'Nouvelle session' }}
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Basic Info -->
          <div class="space-y-4">
            <h4 class="font-medium text-gray-700">Informations de base</h4>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom de la session</label>
              <input 
                v-model="sessionForm.name"
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Ex: Session de grammaire avancée"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select 
                v-model="sessionForm.categoryId"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option v-for="cat in adminStore.categories" :key="cat.id" :value="cat.id">
                  {{ cat.icon }} {{ cat.name }}
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select 
                v-model="sessionForm.type"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="course">Cours collectif</option>
                <option value="grammar">Atelier grammaire</option>
                <option value="conversation">Club conversation</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Professeur</label>
              <select 
                v-model="sessionForm.teacherId"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option v-for="teacher in adminStore.teachers" :key="teacher.id" :value="teacher.id">
                  {{ teacher.name }}
                </option>
              </select>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                  v-model="sessionForm.date"
                  type="date" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Heure</label>
                <input 
                  v-model="sessionForm.time"
                  type="time" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                <select 
                  v-model="sessionForm.level"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                  <option value="C1">C1</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Durée (min)</label>
                <input 
                  v-model.number="sessionForm.duration"
                  type="number" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="60"
                >
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre max d'étudiants</label>
              <input 
                v-model.number="sessionForm.maxStudents"
                type="number" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="5"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Lien de visioconférence</label>
              <input 
                v-model="sessionForm.meetingLink"
                type="url" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="https://meet.elc-academy.com/..."
              >
              <p class="text-xs text-gray-500 mt-1">
                Sera visible par les étudiants 15 minutes avant la session
              </p>
            </div>

            <!-- Apply Template -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Appliquer un template</label>
              <select 
                @change="applyTemplate($event.target.value)"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">-- Choisir un template --</option>
                <option v-for="template in adminStore.templates" :key="template.id" :value="template.id">
                  {{ template.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Content Details -->
          <div class="space-y-4">
            <h4 class="font-medium text-gray-700">Contenu de la session</h4>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                v-model="sessionForm.content.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Description détaillée de la session..."
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Objectifs d'apprentissage</label>
              <div class="space-y-2">
                <div 
                  v-for="(obj, index) in sessionForm.content.objectives" 
                  :key="index"
                  class="flex items-center space-x-2"
                >
                  <input 
                    v-model="sessionForm.content.objectives[index]"
                    type="text" 
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Objectif d'apprentissage"
                  >
                  <button 
                    @click="removeObjective(index)"
                    class="text-red-600 hover:text-red-800"
                  >
                    ❌
                  </button>
                </div>
                <button 
                  @click="addObjective"
                  class="text-primary-600 hover:text-primary-800 text-sm"
                >
                  ➕ Ajouter un objectif
                </button>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Prérequis</label>
              <div class="space-y-2">
                <div 
                  v-for="(prereq, index) in sessionForm.content.prerequisites" 
                  :key="index"
                  class="flex items-center space-x-2"
                >
                  <input 
                    v-model="sessionForm.content.prerequisites[index]"
                    type="text" 
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Prérequis nécessaire"
                  >
                  <button 
                    @click="removePrerequisite(index)"
                    class="text-red-600 hover:text-red-800"
                  >
                    ❌
                  </button>
                </div>
                <button 
                  @click="addPrerequisite"
                  class="text-primary-600 hover:text-primary-800 text-sm"
                >
                  ➕ Ajouter un prérequis
                </button>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Plan de la session</label>
              <div class="space-y-2">
                <div 
                  v-for="(item, index) in sessionForm.content.outline" 
                  :key="index"
                  class="flex items-center space-x-2"
                >
                  <input 
                    v-model="sessionForm.content.outline[index]"
                    type="text" 
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Étape du plan"
                  >
                  <button 
                    @click="removeOutlineItem(index)"
                    class="text-red-600 hover:text-red-800"
                  >
                    ❌
                  </button>
                </div>
                <button 
                  @click="addOutlineItem"
                  class="text-primary-600 hover:text-primary-800 text-sm"
                >
                  ➕ Ajouter une étape
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Resources Section -->
        <div v-if="editingSession" class="mt-6 pt-6 border-t border-gray-200">
          <h4 class="font-medium text-gray-700 mb-4">Ressources associées</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="border border-gray-200 rounded-lg p-4">
              <h5 class="font-medium mb-2">Ressources disponibles</h5>
              <div class="space-y-2 max-h-48 overflow-y-auto">
                <div 
                  v-for="resource in availableResources" 
                  :key="resource.id"
                  class="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                >
                  <div class="flex items-center">
                    <span class="mr-2">{{ getResourceIcon(resource.type) }}</span>
                    <span class="text-sm">{{ resource.name }}</span>
                  </div>
                  <button 
                    @click="addResourceToSession(resource.id)"
                    class="text-primary-600 hover:text-primary-800"
                  >
                    ➕
                  </button>
                </div>
              </div>
            </div>
            
            <div class="border border-gray-200 rounded-lg p-4">
              <h5 class="font-medium mb-2">Ressources de la session</h5>
              <div class="space-y-2 max-h-48 overflow-y-auto">
                <div 
                  v-for="resource in sessionResources" 
                  :key="resource.id"
                  class="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                >
                  <div class="flex items-center">
                    <span class="mr-2">{{ getResourceIcon(resource.type) }}</span>
                    <span class="text-sm">{{ resource.name }}</span>
                  </div>
                  <button 
                    @click="removeResourceFromSession(resource.id)"
                    class="text-red-600 hover:text-red-800"
                  >
                    ❌
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-6 flex justify-between">
          <div>
            <button 
              v-if="editingSession && editingSession.status === 'scheduled'"
              @click="sendSessionNotification"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              📧 Notifier les étudiants
            </button>
          </div>
          <div class="flex space-x-3">
            <button 
              @click="closeSessionModal"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button 
              @click="saveSession"
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              {{ editingSession ? 'Mettre à jour' : 'Créer' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Session Detail Modal -->
    <div v-if="detailModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold">Détails de la session</h3>
          <button 
            @click="detailModal = false"
            class="text-gray-500 hover:text-gray-700"
          >
            ✖️
          </button>
        </div>
        
        <div v-if="detailSession" class="space-y-6">
          <!-- Session Info -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-medium mb-3">{{ detailSession.name }}</h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-600">Catégorie:</span>
                <span class="ml-2 font-medium">{{ getCategoryById(detailSession.categoryId)?.name }}</span>
              </div>
              <div>
                <span class="text-gray-600">Niveau:</span>
                <span class="ml-2 font-medium">{{ detailSession.level }}</span>
              </div>
              <div>
                <span class="text-gray-600">Professeur:</span>
                <span class="ml-2 font-medium">{{ detailSession.teacher }}</span>
              </div>
              <div>
                <span class="text-gray-600">Date:</span>
                <span class="ml-2 font-medium">{{ formatDate(detailSession.date_time) }}</span>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div>
            <h4 class="font-medium mb-3">Contenu de la session</h4>
            <div class="space-y-3">
              <div>
                <p class="text-sm font-medium text-gray-700">Description:</p>
                <p class="text-sm text-gray-600">{{ detailSession.content?.description || 'Aucune description' }}</p>
              </div>
              
              <div>
                <p class="text-sm font-medium text-gray-700">Objectifs:</p>
                <ul class="list-disc list-inside text-sm text-gray-600">
                  <li v-for="(obj, idx) in detailSession.content?.objectives" :key="idx">{{ obj }}</li>
                </ul>
              </div>
              
              <div>
                <p class="text-sm font-medium text-gray-700">Plan:</p>
                <ol class="list-decimal list-inside text-sm text-gray-600">
                  <li v-for="(item, idx) in detailSession.content?.outline" :key="idx">{{ item }}</li>
                </ol>
              </div>
            </div>
          </div>

          <!-- Students -->
          <div>
            <h4 class="font-medium mb-3">Étudiants inscrits ({{ detailSession.enrolled.length }}/{{ detailSession.maxStudents }})</h4>
            <div class="grid grid-cols-2 gap-2">
              <div 
                v-for="studentId in detailSession.enrolled" 
                :key="studentId"
                class="bg-gray-50 rounded p-2 text-sm"
              >
                Étudiant #{{ studentId }}
              </div>
            </div>
          </div>

          <!-- Resources -->
          <div>
            <h4 class="font-medium mb-3">Ressources ({{ getSessionResources(detailSession.id).length }})</h4>
            <div class="space-y-2">
              <div 
                v-for="resource in getSessionResources(detailSession.id)" 
                :key="resource.id"
                class="flex items-center bg-gray-50 rounded p-2"
              >
                <span class="mr-2">{{ getResourceIcon(resource.type) }}</span>
                <span class="text-sm">{{ resource.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Modale de confirmation de suppression -->
<div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
    <div class="flex items-center mb-4">
      <div class="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
      </div>
      <div class="ml-4">
        <h3 class="text-lg font-medium text-gray-900">Confirmer la suppression</h3>
        <p class="text-sm text-gray-500">Cette action est irréversible.</p>
      </div>
    </div>
    
    <p class="text-gray-700 mb-6">
      Êtes-vous sûr de vouloir supprimer la session <strong>"{{ sessionToDelete?.name }}"</strong> ?
    </p>
    
    <div class="flex justify-end space-x-3">
      <button 
        @click="cancelDelete"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        Annuler
      </button>
      <button 
        @click="confirmDelete"
        class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Supprimer
      </button>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useAdminStore } from '@/stores/admin-supabase'

// Props
const props = defineProps({
  openCreateModal: {
    type: Boolean,
    default: false
  }
})

const adminStore = useAdminStore()

// État local
const sessionModal = ref(false)
const detailModal = ref(false)
const editingSession = ref(null)
const detailSession = ref(null)
const sessionFilter = ref({ category: '', status: '', search: '' })

// Forms
const sessionForm = ref({
  name: '',
  categoryId: 1,
  type: 'course',
  teacherId: 1,
  date: '',
  time: '',
  level: 'B1',
  duration: 60,
  maxStudents: 5,
  meetingLink: '',
  content: {
    description: '',
    objectives: [''],
    prerequisites: [''],
    outline: ['']
  }
})

// Computed
const filteredSessions = computed(() => {
  let sessions = adminStore.sessions
  
  if (sessionFilter.value.category) {
    sessions = sessions.filter(s => s.categoryId === parseInt(sessionFilter.value.category))
  }
  
  if (sessionFilter.value.status) {
    sessions = sessions.filter(s => s.status === sessionFilter.value.status)
  }
  
  if (sessionFilter.value.search) {
    const search = sessionFilter.value.search.toLowerCase()
    sessions = sessions.filter(s => 
      s.name.toLowerCase().includes(search) || 
      s.teacher.toLowerCase().includes(search)
    )
  }
  
  return sessions.sort((a, b) => new Date(b.date_time) - new Date(a.date_time))
})

const availableResources = computed(() => {
  if (!editingSession.value) return []
  return adminStore.resources.filter(r => !r.sessionId || r.sessionId === editingSession.value.id)
})

const sessionResources = computed(() => {
  if (!editingSession.value) return []
  return adminStore.resources.filter(r => r.sessionId === editingSession.value.id)
})

// Watcher pour ouvrir la modale automatiquement avec système de renforcement
watch(() => props.openCreateModal, async (newValue) => {
  if (newValue) {
    await nextTick()
    // Premier essai
    showSessionModal()
    
    // Système de renforcement - vérifier si la modale s'est bien ouverte
    setTimeout(() => {
      if (!sessionModal.value) {
        console.log('Renforcement: tentative d\'ouverture de la modale session')
        showSessionModal()
      }
    }, 200)
  }
})

// Methods
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
  return adminStore.categories.find(c => c.id === id)
}

const getResourceIcon = (type) => {
  const icons = {
    'pdf': '📄',
    'video': '🎥',
    'audio': '🎵',
    'image': '🖼️',
    'document': '📃',
    'presentation': '📊'
  }
  return icons[type] || '📎'
}

const getSessionResources = (sessionId) => {
  return adminStore.resources.filter(r => r.sessionId === sessionId)
}

// Session management
const showSessionModal = (session = null) => {
  if (session) {
    editingSession.value = session
    const date = new Date(session.date_time)
    sessionForm.value = {
      name: session.name,
      categoryId: session.categoryId,
      type: session.type,
      teacherId: session.teacherId,
      date: date.toISOString().split('T')[0],
      time: date.toTimeString().slice(0, 5),
      level: session.level,
      duration: session.duration,
      maxStudents: session.maxStudents,
      meetingLink: session.meetingLink || '',
      content: {
        description: session.content?.description || '',
        objectives: session.content?.objectives?.length ? [...session.content.objectives] : [''],
        prerequisites: session.content?.prerequisites?.length ? [...session.content.prerequisites] : [''],
        outline: session.content?.outline?.length ? [...session.content.outline] : ['']
      }
    }
  } else {
    editingSession.value = null
    sessionForm.value = {
      name: '',
      categoryId: 1,
      type: 'course',
      teacherId: 1,
      date: '',
      time: '',
      level: 'B1',
      duration: 60,
      maxStudents: 5,
      meetingLink: '',
      content: {
        description: '',
        objectives: [''],
        prerequisites: [''],
        outline: ['']
      }
    }
  }
  sessionModal.value = true
}

const closeSessionModal = () => {
  sessionModal.value = false
  editingSession.value = null
}

const saveSession = async () => {
  const dateTime = new Date(`${sessionForm.value.date}T${sessionForm.value.time}`)
  
  // Mapper correctement les champs selon la structure de la table sessions
  const sessionData = {
    name: sessionForm.value.name,
    description: sessionForm.value.description,
    category_id: sessionForm.value.categoryId,
    teacher_id: sessionForm.value.teacherId,
    type: sessionForm.value.type,
    level: sessionForm.value.level,
    date_time: dateTime.toISOString(),
    duration: sessionForm.value.duration,
    max_students: sessionForm.value.maxStudents,
    meeting_link: sessionForm.value.meetingLink,
    status: sessionForm.value.status || 'scheduled'
  }
  
  try {
    if (editingSession.value) {
      // Mettre à jour seulement la session principale
      await adminStore.updateSession(editingSession.value.id, sessionData)
    } else {
      // Pour la création, utiliser createSession simple
      await adminStore.createSession(sessionData)
    }
    
    closeSessionModal()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    // Optionnel: afficher un message d'erreur à l'utilisateur
  }
}

// Ajouter ces variables réactives
const showDeleteModal = ref(false)
const sessionToDelete = ref(null)

// Remplacer la fonction deleteSession existante
const deleteSession = (session) => {
  sessionToDelete.value = session
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    await adminStore.deleteSession(sessionToDelete.value.id)
    showDeleteModal.value = false
    sessionToDelete.value = null
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    // Optionnel: afficher un message d'erreur à l'utilisateur
  }
}

const cancelDelete = () => {
  showDeleteModal.value = false
  sessionToDelete.value = null
}

const duplicateSession = (session) => {
  const duplicate = adminStore.duplicateSession(session.id)
  if (duplicate) {
    showSessionModal(duplicate)
  }
}

const showSessionDetailModal = (session) => {
  detailSession.value = session
  detailModal.value = true
}

const sendSessionNotification = () => {
  if (editingSession.value) {
    adminStore.sendNotification({
      type: 'session_reminder',
      sessionId: editingSession.value.id,
      title: 'Rappel de session',
      message: `N'oubliez pas votre session "${editingSession.value.name}" le ${formatDate(editingSession.value.dateTime)}`,
      recipients: 'session'
    })
    alert('Notification envoyée aux étudiants inscrits!')
  }
}

// Resource management
const addResourceToSession = (resourceId) => {
  if (editingSession.value) {
    adminStore.addResourceToSession(editingSession.value.id, resourceId)
  }
}

const removeResourceFromSession = (resourceId) => {
  if (editingSession.value) {
    adminStore.removeResourceFromSession(editingSession.value.id, resourceId)
  }
}

// Session content helpers
const addObjective = () => {
  sessionForm.value.content.objectives.push('')
}

const removeObjective = (index) => {
  if (sessionForm.value.content.objectives.length > 1) {
    sessionForm.value.content.objectives.splice(index, 1)
  }
}

const addPrerequisite = () => {
  sessionForm.value.content.prerequisites.push('')
}

const removePrerequisite = (index) => {
  if (sessionForm.value.content.prerequisites.length > 1) {
    sessionForm.value.content.prerequisites.splice(index, 1)
  }
}

const addOutlineItem = () => {
  sessionForm.value.content.outline.push('')
}

const removeOutlineItem = (index) => {
  if (sessionForm.value.content.outline.length > 1) {
    sessionForm.value.content.outline.splice(index, 1)
  }
}

const applyTemplate = (templateId) => {
  if (!templateId) return
  
  const template = adminStore.templates.find(t => t.id === parseInt(templateId))
  if (template) {
    sessionForm.value.duration = template.duration
    sessionForm.value.maxStudents = template.maxStudents
    sessionForm.value.content = { ...template.content }
  }
}
</script>
