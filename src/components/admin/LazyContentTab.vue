<template>
  <div class="space-y-6">
    <!-- Chargement progressif des sections -->
    <div v-if="!sectionsLoaded" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
    
    <template v-else>
      <!-- Sections chargées dynamiquement -->
      <Suspense>
        <template #default>
          <component 
            v-for="section in activeSections" 
            :key="section.name"
            :is="section.component"
            v-bind="section.props"
            @update="handleSectionUpdate"
          />
        </template>
        <template #fallback>
          <div class="animate-pulse bg-gray-200 h-32 rounded"></div>
        </template>
      </Suspense>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { usePerformance } from '../../composables/usePerformance.js'

// Composants chargés de manière asynchrone
const CourseTypesSection = defineAsyncComponent(() => 
  import('./content/CourseTypesSection.vue')
)
const CategoriesSection = defineAsyncComponent(() => 
  import('./content/CategoriesSection.vue')
)
const TemplatesSection = defineAsyncComponent(() => 
  import('./content/TemplatesSection.vue')
)

const sectionsLoaded = ref(false)
const activeSections = ref([])

const { useLazyLoading, usePreload } = usePerformance()
const { preload } = usePreload()

// Configuration des sections
const sections = [
  {
    name: 'course-types',
    component: CourseTypesSection,
    props: {},
    priority: 1
  },
  {
    name: 'categories',
    component: CategoriesSection,
    props: {},
    priority: 2
  },
  {
    name: 'templates',
    component: TemplatesSection,
    props: {},
    priority: 3
  }
]

// Chargement progressif
const loadSections = async () => {
  try {
    // Charger les sections par ordre de priorité
    const sortedSections = sections.sort((a, b) => a.priority - b.priority)
    
    for (const section of sortedSections) {
      activeSections.value.push(section)
      // Petit délai pour éviter de bloquer l'UI
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    
    sectionsLoaded.value = true
  } catch (error) {
    console.error('Erreur chargement sections:', error)
  }
}

// Préchargement des données
const preloadData = async () => {
  await Promise.all([
    preload('course-types', () => import('../../stores/admin/course-types.js')),
    preload('categories', () => import('../../stores/admin/categories.js')),
    preload('templates', () => import('../../stores/admin/templates.js'))
  ])
}

const handleSectionUpdate = (data) => {
  console.log('Section mise à jour:', data)
}

onMounted(async () => {
  // Précharger les données en arrière-plan
  preloadData()
  
  // Charger les sections
  await loadSections()
})
</script>