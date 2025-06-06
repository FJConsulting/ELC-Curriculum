<template>
  <div class="bg-white rounded-xl shadow-sm p-4">
    <div class="flex flex-col gap-4">
      <!-- Conteneur des filtres -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <!-- Filtre pour les types de cours -->
        <select 
          :value="filters.courseType"
          @input="$emit('update:courseType', $event.target.value)"
          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Tous les types de cours</option>
          <option v-for="courseType in courseTypes" :key="courseType.id" :value="courseType.name">
            {{ courseType.icon }} {{ courseType.name }}
          </option>
        </select>
        
        <select 
          :value="filters.category"
          @input="$emit('update:category', $event.target.value)"
          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Toutes les catégories</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
        
        <select 
          :value="filters.status"
          @input="$emit('update:status', $event.target.value)"
          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Tous les statuts</option>
          <option value="scheduled">Planifiées</option>
          <option value="completed">Terminées</option>
          <option value="cancelled">Annulées</option>
          <option value="draft">Brouillons</option>
        </select>
        
        <input 
          :value="filters.search"
          @input="$emit('update:search', $event.target.value)"
          type="text"
          placeholder="Rechercher..."
          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
      </div>
      
      <!-- Bouton de création -->
      <div class="flex justify-center sm:justify-end">
        <button 
          @click="$emit('create-session')"
          class="w-full sm:w-auto px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
        >
          <span class="text-white text-lg font-bold">+</span> 
          <span class="hidden xs:inline">Nouvelle session</span>
          <span class="xs:hidden">Nouveau</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  filters: {
    type: Object,
    required: true
  },
  courseTypes: {
    type: Array,
    default: () => []
  },
  categories: {
    type: Array,
    default: () => []
  }
})

defineEmits([
  'update:courseType',
  'update:category', 
  'update:status',
  'update:search',
  'create-session'
])
</script>