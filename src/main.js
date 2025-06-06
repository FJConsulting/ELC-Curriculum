import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router, { updateRoutes } from './router'
import App from './App.vue'
import './style.css'
import { useAdminStore } from '@/stores/admin/index'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Attendre que l'application soit montée avant de charger les données
app.mount('#app')

// Charger les types de cours et mettre à jour les routes après le montage
const adminStore = useAdminStore()
if (adminStore.loadCourseTypes) {
  adminStore.loadCourseTypes().then(() => {
    // Mettre à jour les routes une fois les types de cours chargés
    updateRoutes()
    console.log('✅ Routes dynamiques initialisées')
  }).catch(error => {
    console.error('❌ Erreur lors du chargement des types de cours:', error)
    // Mettre à jour les routes même en cas d'erreur pour avoir les routes par défaut
    updateRoutes()
  })
} else {
  // Si loadCourseTypes n'est pas disponible, utiliser les routes par défaut
  updateRoutes()
}