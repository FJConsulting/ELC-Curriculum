<template>
  <div class="bg-white rounded-xl shadow-sm p-4">
    <div class="flex flex-col md:flex-row gap-4">
      <select 
        :value="filters.type"
        @input="$emit('update:type', $event.target.value)"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
      >
        <option value="">Tous les types</option>
        <option value="pdf">Documents PDF</option>
        <option value="video">Vidéos</option>
        <option value="audio">Audio</option>
        <option value="presentation">Présentations</option>
        <option value="document">Documents</option>
        <option value="image">Images</option>
      </select>
      
      <select 
        :value="filters.session"
        @input="$emit('update:session', $event.target.value)"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
      >
        <option value="">Toutes les sessions</option>
        <option value="unassigned">Non assignées</option>
        <option v-for="session in sessions" :key="session.id" :value="session.id">
          {{ session.name }}
        </option>
      </select>
      
      <input 
        :value="filters.search"
        @input="$emit('update:search', $event.target.value)"
        type="text"
        placeholder="Rechercher une ressource..."
        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
      >
      
      <button 
        @click="$emit('export-data')"
        class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
      >
        📥 Exporter
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  filters: {
    type: Object,
    required: true
  },
  sessions: {
    type: Array,
    required: true
  }
})

defineEmits(['update:type', 'update:session', 'update:search', 'export-data'])
</script>