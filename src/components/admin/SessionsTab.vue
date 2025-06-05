<template>
  <div class="space-y-6">
    <!-- Filter and Actions -->
    <div class="bg-white rounded-xl shadow-sm p-4">
      <div class="flex flex-col md:flex-row justify-between gap-4">
        <div class="flex flex-col sm:flex-row gap-4">
          <!-- Nouveau filtre pour les types de cours -->
          <select 
            v-model="sessionFilter.courseType"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Tous les types de cours</option>
            <option v-for="courseType in adminStore.courseTypes" :key="courseType.id" :value="courseType.name">
              {{ courseType.icon }} {{ courseType.name }}
            </option>
          </select>
          
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

    <!-- Sessions List Enhanced with Resizable Columns -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table ref="resizableTable" class="min-w-full divide-y divide-gray-200 resizable-table">
          <thead class="bg-gray-50">
            <tr>
              <th class="resizable-th px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 200px; min-width: 150px;">
                Session
                <div class="resize-handle" @mousedown="startResize($event, 0)"></div>
              </th>
              <th class="resizable-th px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 150px; min-width: 120px;">
                Catégorie
                <div class="resize-handle" @mousedown="startResize($event, 1)"></div>
              </th>
              <th class="resizable-th px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 120px; min-width: 100px;">
                Professeur
                <div class="resize-handle" @mousedown="startResize($event, 2)"></div>
              </th>
              <th class="resizable-th px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 140px; min-width: 120px;">
                Date & Heure
                <div class="resize-handle" @mousedown="startResize($event, 3)"></div>
              </th>
              <th class="resizable-th px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 100px; min-width: 80px;">
                Inscrits
                <div class="resize-handle" @mousedown="startResize($event, 4)"></div>
              </th>
              <th class="resizable-th px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 120px; min-width: 100px;">
                Ressources
                <div class="resize-handle" @mousedown="startResize($event, 5)"></div>
              </th>
              <th class="resizable-th px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 100px; min-width: 80px;">
                Statut
                <div class="resize-handle" @mousedown="startResize($event, 6)"></div>
              </th>
              <th class="relative px-6 py-3" style="width: 160px; min-width: 140px;">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="session in filteredSessions" :key="session.id" class="hover:bg-gray-50">
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
                {{ formatDate(session.date_time || session.dateTime) }}
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
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
const sessionFilter = ref({ courseType: '', category: '', status: '', search: '' })

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
  
  // Filtre par type de cours - mapping correct selon la base de données
  if (sessionFilter.value.courseType) {
    sessions = sessions.filter(s => {
      // Mapping basé sur les données réelles de la base
      const typeMapping = {
        'Cours collectifs': 'course',           // slug: course
        'Ateliers grammaire': 'grammar',        // sessions ont type: grammar (pas grammar-workshops)
        'Club conversation': 'conversation',     // sessions ont type: conversation (pas conversation-club)
        'Prononciation': 'pronunciation'        // slug: pronunciation
      }
      
      const expectedType = typeMapping[sessionFilter.value.courseType]
      return s.type === expectedType
    })
  }
  
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
// Variables pour le redimensionnement des colonnes
const resizableTable = ref(null)
const isResizing = ref(false)
const currentColumn = ref(null)
const startX = ref(0)
const startWidth = ref(0)
const columnIndex = ref(0)

// Méthodes pour le redimensionnement - VERSION FINALE CORRIGÉE
const startResize = (e, colIndex) => {
  e.preventDefault()
  e.stopPropagation()
  
  console.log('Début du redimensionnement pour la colonne:', colIndex) // Debug
  
  isResizing.value = true
  columnIndex.value = colIndex
  startX.value = e.clientX
  
  const table = resizableTable.value
  if (!table) {
    console.log('Table non trouvée') // Debug
    return
  }
  
  const th = table.querySelectorAll('thead th')[colIndex]
  if (!th) {
    console.log('En-tête non trouvé') // Debug
    return
  }
  
  // Obtenir la largeur actuelle
  const computedStyle = window.getComputedStyle(th)
  startWidth.value = parseInt(computedStyle.width, 10)
  currentColumn.value = th
  
  console.log('Largeur de départ:', startWidth.value) // Debug
  
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
  
  // Ajouter les événements
  document.addEventListener('mousemove', doResize, { passive: false })
  document.addEventListener('mouseup', stopResize, { passive: false })
}

const doResize = (e) => {
  if (!isResizing.value || !currentColumn.value) return
  
  e.preventDefault()
  
  const deltaX = e.clientX - startX.value
  const newWidth = startWidth.value + deltaX
  
  // Largeur minimale et maximale
  const minWidth = 80
  const maxWidth = 500
  
  if (newWidth >= minWidth && newWidth <= maxWidth) {
    // Appliquer la largeur à l'en-tête
    currentColumn.value.style.width = newWidth + 'px'
    currentColumn.value.style.minWidth = newWidth + 'px'
    
    // Appliquer la même largeur aux cellules correspondantes dans le tbody
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
    
    console.log('Nouvelle largeur appliquée:', newWidth) // Debug
  }
}

const stopResize = () => {
  console.log('Fin du redimensionnement') // Debug
  
  isResizing.value = false
  currentColumn.value = null
  document.body.style.cursor = 'default'
  document.body.style.userSelect = 'auto'
  
  // Retirer les événements
  document.removeEventListener('mousemove', doResize)
  document.removeEventListener('mouseup', stopResize)
}
</script>

<style scoped>
.resizable-table {
  width: 100%;
  table-layout: auto; /* Permettre le redimensionnement dynamique */
}

.resizable-th {
  position: relative;
  border-right: 1px solid #e5e7eb;
  box-sizing: border-box;
  white-space: nowrap; /* Éviter le retour à la ligne */
}

.resize-handle {
  position: absolute;
  top: 0;
  right: -4px; /* Position ajustée */
  width: 8px;
  height: 100%;
  cursor: col-resize;
  background: transparent;
  z-index: 20; /* Z-index plus élevé */
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

/* Indicateur visuel amélioré */
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

/* Responsive design */
@media (max-width: 768px) {
  .resize-handle {
    display: none;
  }
  
  .resizable-table {
    table-layout: auto;
  }
}

/* Assurer que les cellules du tbody suivent la largeur */
.resizable-table tbody td {
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
