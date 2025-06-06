<template>
  <div class="bg-white rounded-xl shadow-sm p-6">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Catégories de cours</h3>
      <button 
        @click="$emit('create-category')"
        class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 min-w-[180px] justify-center"
      >
        <span class="text-white text-lg font-bold">+</span> Nouvelle catégorie
      </button>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="category in categories" 
        :key="category.id"
        class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-center">
            <span class="text-2xl mr-3">{{ category.icon }}</span>
            <div>
              <h4 class="font-medium">{{ category.name }}</h4>
              <p class="text-sm text-gray-600">{{ category.description }}</p>
            </div>
          </div>
          <div class="flex space-x-2">
            <button 
              @click="$emit('edit-category', category)"
              class="text-primary-600 hover:text-primary-800"
            >
              ✏️
            </button>
            <button 
              @click="$emit('delete-category', category)"
              class="text-red-600 hover:text-red-800"
            >
              🗑️
            </button>
          </div>
        </div>
        <div class="mt-3 text-sm text-gray-500">
          {{ getSessionsCount(category.id) }} sessions
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  sessions: {
    type: Array,
    default: () => []
  }
})

defineEmits(['create-category', 'edit-category', 'delete-category'])

const getSessionsCount = (categoryId) => {
  // Ligne 65
  return props.sessions.filter(session => session.categoryId === categoryId).length // ✅ Correction
}
</script>