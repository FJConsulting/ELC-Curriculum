<template>
  <div class="bg-white rounded-xl shadow-sm p-6">
    <h3 class="text-lg font-semibold mb-4">Ajouter des ressources</h3>
    <div 
      @drop="handleDrop"
      @dragover.prevent
      @dragenter.prevent
      class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors"
    >
      <div class="text-gray-400">
        <span class="text-5xl">📁</span>
        <p class="mt-2">Glissez-déposez vos fichiers ici ou</p>
        <button 
          @click="$emit('show-upload-modal')"
          class="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Parcourir
        </button>
        <p class="text-sm text-gray-500 mt-2">
          Formats acceptés : PDF, MP4, MP3, PPT, DOC, JPG, PNG (Max 50MB)
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['show-upload-modal', 'file-dropped'])

const handleDrop = (e) => {
  e.preventDefault()
  const files = e.dataTransfer.files
  if (files.length > 0) {
    $emit('file-dropped', files[0])
  }
}
</script>

<style scoped>
.border-dashed:hover {
  background-color: rgba(59, 130, 246, 0.05);
}
</style>