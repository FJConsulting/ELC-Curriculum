import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './style.css'

// Test de connexion Supabase en développement
if (import.meta.env.DEV) {
  import('./scripts/test-supabase.js')
  // Suppression de la ligne suivante
  // import('./scripts/setup-hybrid-mode.js')
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')