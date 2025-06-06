import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../../config/supabase.js'

export const useResourcesStore = defineStore('admin-resources', () => {
  // État
  const resources = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Actions
  const loadResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      resources.value = data || []
      console.log('✅ Ressources chargées:', data?.length || 0)
    } catch (err) {
      console.error('❌ Erreur chargement ressources:', err)
      throw err
    }
  }

  return {
    // État
    resources,
    loading,
    error,
    
    // Actions
    loadResources
  }
})