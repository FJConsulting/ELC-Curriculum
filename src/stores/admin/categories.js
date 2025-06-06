import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../../config/supabase.js'

export const useCategoriesStore = defineStore('admin-categories', () => {
  // État
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Actions
  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')  // Changé de 'course_categories' à 'categories'
        .select('*')
        .order('name')
      
      if (error) throw error
      categories.value = data || []
      console.log('✅ Catégories chargées:', data?.length || 0)
    } catch (err) {
      console.error('❌ Erreur chargement catégories:', err)
      throw err
    }
  }

  const createCategory = async (categoryData) => {
    try {
      loading.value = true
      error.value = null
      
      // Vérifier l'authentification
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Utilisateur non authentifié')
      }
      
      const { data, error: supabaseError } = await supabase
        .from('categories')
        .insert([categoryData])
        .select()
        .single()
      
      if (supabaseError) throw supabaseError
      
      // Recharger les catégories pour mettre à jour la liste
      await loadCategories()
      
      console.log('✅ Catégorie créée:', data)
      return data
    } catch (err) {
      console.error('❌ Erreur création catégorie:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteCategory = async (categoryId) => {
    try {
      const { error } = await supabase
        .from('categories')  // Changé de 'course_categories' à 'categories'
        .delete()
        .eq('id', categoryId)
      
      if (error) throw error
      
      await loadCategories()
    } catch (err) {
      console.error('❌ Erreur suppression catégorie:', err)
      throw err
    }
  }

  const getCategoryById = (id) => {
    return categories.value.find(cat => cat.id === id)
  }

  return {
    // État
    categories,
    loading,
    error,
    
    // Actions
    loadCategories,
    createCategory,  // Ajouter cette ligne
    deleteCategory,
    getCategoryById
  }
})