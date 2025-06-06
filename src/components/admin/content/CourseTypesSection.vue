<template>
  <div class="bg-white rounded-xl shadow-sm p-6">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Types de cours</h3>
      <button 
        @click="$emit('create-course-type')"
        class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 min-w-[180px] justify-center"
      >
        <span class="text-white text-lg font-bold">+</span> Nouveau type
      </button>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="courseType in courseTypes" 
        :key="courseType.id"
        class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-center">
            <span class="text-2xl mr-3">{{ courseType.icon }}</span>
            <div>
              <h4 class="font-medium">{{ courseType.name }}</h4>
              <p class="text-sm text-gray-600">{{ courseType.description }}</p>
              <p class="text-xs text-gray-500 mt-1">Route: {{ courseType.route }}</p>
            </div>
          </div>
          <div class="flex space-x-2">
            <button 
              @click="$emit('edit-course-type', courseType)"
              class="text-primary-600 hover:text-primary-800"
            >
              ✏️
            </button>
            <button 
              @click="$emit('delete-course-type', courseType)"
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
defineProps({
  courseTypes: {
    type: Array,
    default: () => []
  }
})

defineEmits(['create-course-type', 'edit-course-type', 'delete-course-type'])
</script>