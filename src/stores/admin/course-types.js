import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../../config/supabase.js'

export const useCourseTypesStore = defineStore('admin-course-types', () => {
  // État
  const courseTypes = ref([
    {
      id: 1,
      name: 'Cours collectifs',
      description: 'Groupes de 5 personnes max',
      route: '/courses',
      slug: 'course',
      icon: '📚',
      order: 1,
      features: {}
    },
    {
      id: 2,
      name: 'Ateliers grammaire',
      description: 'Par niveau (A1→B2+)',
      route: '/grammar-workshops',
      slug: 'grammar-workshops',
      icon: '✏️',
      order: 2,
      features: {}
    },
    {
      id: 3,
      name: 'Club conversation',
      description: 'Actualité & culture',
      route: '/conversation-club',
      slug: 'conversation-club',
      icon: '💬',
      order: 3,
      features: {}
    },
    {
      id: 4,
      name: 'Prononciation',
      description: 'Perfectionnez votre accent',
      route: '/pronunciation',
      slug: 'pronunciation',
      icon: '🔊',
      order: 4,
      features: {}
    }
  ])
  const loading = ref(false)
  const error = ref(null)

  // Actions
  const loadCourseTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('course_types')
        .select('*')
        .order('order', { ascending: true })

      if (error) throw error
      
      const processedData = (data || []).map(type => {
        if (!type.slug && type.route) {
          type.slug = type.route.substring(1).replace(/\//g, '-')
        }
        
        if (!type.features) {
          type.features = {}
        }
        
        return type
      })
      
      courseTypes.value = processedData
      console.log('✅ Types de cours chargés:', processedData.length)
      
      if (typeof window !== 'undefined') {
        try {
          import('@/router').then(router => {
            if (router.updateRoutes) {
              router.updateRoutes()
            } else {
              console.warn('La fonction updateRoutes n\'est pas disponible dans le router')
            }
          }).catch(err => {
            console.error('Erreur lors de l\'importation du router:', err)
          })
        } catch (err) {
          console.error('Erreur lors de la mise à jour des routes:', err)
        }
      }
    } catch (err) {
      console.error('❌ Erreur chargement types de cours:', err)
    }
  }

  const createCourseType = async (courseTypeData) => {
    try {
      if (!courseTypeData.slug && courseTypeData.name) {
        courseTypeData.slug = courseTypeData.name
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
      }
      
      if (!courseTypeData.route && courseTypeData.slug) {
        courseTypeData.route = `/${courseTypeData.slug}`
      }
      
      if (!courseTypeData.features) {
        courseTypeData.features = {}
      }
      
      const { data, error } = await supabase
        .from('course_types')
        .insert([{
          ...courseTypeData,
          order: courseTypes.value.length + 1
        }])
        .select()

      if (error) throw error

      if (data && data[0]) {
        courseTypes.value.push(data[0])
        
        try {
          import('@/router').then(router => {
            if (router.updateRoutes) {
              router.updateRoutes()
            }
          })
        } catch (err) {
          console.error('Erreur lors de la mise à jour des routes:', err)
        }
      }

      console.log('✅ Type de cours créé')
      return data && data[0]
    } catch (err) {
      console.error('❌ Erreur création type de cours:', err)
      throw err
    }
  }

  const updateCourseType = async (id, courseTypeData) => {
    try {
      if (!courseTypeData.slug && courseTypeData.name) {
        courseTypeData.slug = courseTypeData.name
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
      }
      
      if (!courseTypeData.features) {
        courseTypeData.features = {}
      }
      
      const { data, error } = await supabase
        .from('course_types')
        .update(courseTypeData)
        .eq('id', id)
        .select()

      if (error) throw error

      if (data && data[0]) {
        const index = courseTypes.value.findIndex(ct => ct.id === id)
        if (index !== -1) {
          courseTypes.value[index] = data[0]
        }
        
        try {
          import('@/router').then(router => {
            if (router.updateRoutes) {
              router.updateRoutes()
            }
          })
        } catch (err) {
          console.error('Erreur lors de la mise à jour des routes:', err)
        }
      }

      console.log('✅ Type de cours mis à jour')
      return data && data[0]
    } catch (err) {
      console.error('❌ Erreur mise à jour type de cours:', err)
      throw err
    }
  }

  const deleteCourseType = async (id) => {
    try {
      const { error } = await supabase
        .from('course_types')
        .delete()
        .eq('id', id)

      if (error) throw error

      courseTypes.value = courseTypes.value.filter(ct => ct.id !== id)
      console.log('✅ Type de cours supprimé')
      
      try {
        import('@/router').then(router => {
          if (router.updateRoutes) {
            router.updateRoutes()
          }
        })
      } catch (err) {
        console.error('Erreur lors de la mise à jour des routes:', err)
      }
      
      return true
    } catch (err) {
      console.error('❌ Erreur suppression type de cours:', err)
      throw err
    }
  }

  const getCourseTypeBySlug = (slug) => {
    return courseTypes.value.find(
      ct => ct.slug === slug || ct.route === `/${slug}`
    )
  }

  return {
    // État
    courseTypes,
    loading,
    error,
    
    // Actions
    loadCourseTypes,
    createCourseType,
    updateCourseType,
    deleteCourseType,
    getCourseTypeBySlug
  }
})