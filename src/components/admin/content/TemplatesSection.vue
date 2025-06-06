<template>
  <div class="bg-white rounded-xl shadow-sm p-6">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Templates de sessions</h3>
      <button 
        @click="$emit('create-template')"
        class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 min-w-[180px] justify-center"
      >
        <span class="text-white text-lg font-bold">+</span> Nouveau template
      </button>
    </div>
    
    <!-- Filtres -->
    <div class="bg-gray-50 rounded-lg p-4 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <select 
          v-model="filters.category"
          @change="$emit('update:filters', filters)"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Toutes les catégories</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
        <select 
          v-model="filters.level"
          @change="$emit('update:filters', filters)"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Tous les niveaux</option>
          <option value="A1">A1</option>
          <option value="A2">A2</option>
          <option value="B1">B1</option>
          <option value="B2">B2</option>
          <option value="C1">C1</option>
          <option value="C2">C2</option>
        </select>
        <input 
          v-model="filters.search"
          @input="$emit('update:filters', filters)"
          type="text"
          placeholder="Rechercher un template..."
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 flex-1"
        >
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="template in templates" 
        :key="template.id"
        class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-start">
          <div>
            <h4 class="font-medium">{{ template.name }}</h4>
            <p class="text-sm text-gray-600 mt-1">
              Niveau {{ template.level }} • {{ template.duration }} min • Max {{ template.maxStudents }} étudiants
            </p>
            <div class="mt-2">
              <p class="text-sm font-medium text-gray-700">Objectifs :</p>
              <ul class="text-sm text-gray-600 list-disc list-inside mt-1">
                <li v-for="(obj, idx) in template.content.objectives.slice(0, 2)" :key="idx">
                  {{ obj }}
                </li>
                <li v-if="template.content.objectives.length > 2" class="text-gray-400">
                  +{{ template.content.objectives.length - 2 }} autres...
                </li>
              </ul>
            </div>
          </div>
          <div class="flex space-x-2">
            <button 
              @click="$emit('edit-template', template)"
              class="text-primary-600 hover:text-primary-800"
            >
              ✏️
            </button>
            <button 
              @click="$emit('delete-template', template)"
              class="text-red-600 hover:text-red-800"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  templates: {
    type: Array,
    default: () => []
  },
  categories: {
    type: Array,
    default: () => []
  }
})

defineEmits(['create-template', 'edit-template', 'delete-template', 'update:filters'])

const filters = ref({
  category: '',
  level: '',
  search: ''
})
</script>