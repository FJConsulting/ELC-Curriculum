<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
    <div class="bg-white rounded-lg shadow-sm p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600">Total des ressources</p>
          <p class="text-2xl font-bold">{{ totalResources }}</p>
        </div>
        <span class="text-3xl">📚</span>
      </div>
    </div>
    
    <div class="bg-white rounded-lg shadow-sm p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600">Espace utilisé</p>
          <p class="text-2xl font-bold">{{ totalSize }}</p>
        </div>
        <span class="text-3xl">💾</span>
      </div>
    </div>
    
    <div class="bg-white rounded-lg shadow-sm p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600">Téléchargements</p>
          <p class="text-2xl font-bold">{{ totalDownloads }}</p>
        </div>
        <span class="text-3xl">⬇️</span>
      </div>
    </div>
    
    <div class="bg-white rounded-lg shadow-sm p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600">Récentes (7j)</p>
          <p class="text-2xl font-bold">{{ recentCount }}</p>
        </div>
        <span class="text-3xl">🆕</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  totalResources: {
    type: Number,
    required: true
  },
  totalSize: {
    type: String,
    required: true
  },
  totalDownloads: {
    type: Number,
    required: true
  },
  recentCount: {
    type: Number,
    required: true
  }
})
</script>