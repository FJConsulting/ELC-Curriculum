import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../../config/supabase.js'

export const useEvaluationsStore = defineStore('admin-evaluations', () => {
  // État
  const evaluations = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Actions
  const loadEvaluations = async () => {
    try {
      const { data, error } = await supabase
        .from('evaluations')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      evaluations.value = data || []
      console.log('✅ Évaluations chargées:', data?.length || 0)
    } catch (err) {
      console.error('❌ Erreur chargement évaluations:', err)
      throw err
    }
  }

  return {
    // État
    evaluations,
    loading,
    error,
    
    // Actions
    loadEvaluations
  }
})