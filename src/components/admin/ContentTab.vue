<template>
  <div class="space-y-6">
    <!-- Course Types Section -->
    <CourseTypesSection 
      :course-types="adminStore.courseTypes"
      @create-course-type="showCourseTypeModal()"
      @edit-course-type="showCourseTypeModal"
      @delete-course-type="deleteCourseType"
    />

    <!-- Categories Section -->
    <CategoriesSection 
      :categories="adminStore.categories"
      :sessions="adminStore.sessions"
      @create-category="showCategoryModal()"
      @edit-category="showCategoryModal"
      @delete-category="deleteCategory"
    />

    <!-- Templates Section -->
    <TemplatesSection 
      :templates="filteredTemplates"
      :categories="adminStore.categories"
      @create-template="showTemplateModal()"
      @edit-template="showTemplateModal"
      @delete-template="deleteTemplate"
      @update:filters="updateTemplateFilters"
    />

    <!-- Modals -->
    <CourseTypeModal 
      :show="courseTypeModal"
      :editing-course-type="editingCourseType"
      @close="courseTypeModal = false"
      @save="saveCourseType"
    />

    <CategoryModal 
      :show="categoryModal"
      :editing-category="editingCategory"
      @close="categoryModal = false"
      @save="saveCategory"
    />

    <TemplateModal 
      :show="templateModal"
      :editing-template="editingTemplate"
      @close="templateModal = false"
      @save="saveTemplate"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAdminStore } from '@/stores/admin'
import CourseTypesSection from './content/CourseTypesSection.vue'
import CategoriesSection from './content/CategoriesSection.vue'
import TemplatesSection from './content/TemplatesSection.vue'
import CourseTypeModal from './content/CourseTypeModal.vue'
import CategoryModal from './content/CategoryModal.vue'
import TemplateModal from './content/TemplateModal.vue'

const adminStore = useAdminStore()

// État des modales
const courseTypeModal = ref(false)
const categoryModal = ref(false)
const templateModal = ref(false)
const editingCourseType = ref(null)
const editingCategory = ref(null)
const editingTemplate = ref(null)

// Filtres pour les templates
const templateFilters = ref({
  category: '',
  level: '',
  search: ''
})

// Templates filtrés
const filteredTemplates = computed(() => {
  let templates = adminStore.templates || []
  
  if (templateFilters.value.category) {
    templates = templates.filter(template => template.categoryId === templateFilters.value.category)
  }
  
  if (templateFilters.value.level) {
    templates = templates.filter(template => template.level === templateFilters.value.level)
  }
  
  if (templateFilters.value.search) {
    const search = templateFilters.value.search.toLowerCase()
    templates = templates.filter(template => 
      template.name.toLowerCase().includes(search) ||
      template.content.description.toLowerCase().includes(search)
    )
  }
  
  return templates
})

// Gestion des types de cours
const showCourseTypeModal = (courseType = null) => {
  editingCourseType.value = courseType
  courseTypeModal.value = true
}

const saveCourseType = async (formData) => {
  try {
    if (editingCourseType.value) {
      await adminStore.updateCourseType(editingCourseType.value.id, formData)
    } else {
      await adminStore.createCourseType(formData)
    }
    courseTypeModal.value = false
    editingCourseType.value = null
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du type de cours:', error)
  }
}

const deleteCourseType = async (courseType) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le type "${courseType.name}" ?`)) {
    try {
      await adminStore.deleteCourseType(courseType.id)
    } catch (error) {
      console.error('Erreur lors de la suppression du type de cours:', error)
    }
  }
}

// Gestion des catégories
const showCategoryModal = (category = null) => {
  editingCategory.value = category
  categoryModal.value = true
}

const saveCategory = async (formData) => {  // Ajouter le paramètre formData
  try {
    if (editingCategory.value) {
      await adminStore.categoriesStore.updateCategory(editingCategory.value.id, formData)
    } else {
      await adminStore.categoriesStore.createCategory(formData)
    }
    categoryModal.value = false
    editingCategory.value = null
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la catégorie:', error)
  }
}

const deleteCategory = (category) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}" ?`)) {
    adminStore.deleteCategory(category.id)
  }
}

// Gestion des templates
const showTemplateModal = (template = null) => {
  editingTemplate.value = template
  templateModal.value = true
}

const saveTemplate = (formData) => {
  if (editingTemplate.value) {
    const index = adminStore.templates.findIndex(t => t.id === editingTemplate.value.id)
    if (index !== -1) {
      adminStore.templates[index] = { ...adminStore.templates[index], ...formData }
    }
  } else {
    adminStore.createTemplate(formData)
  }
  templateModal.value = false
  editingTemplate.value = null
}

const deleteTemplate = (template) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le template "${template.name}" ?`)) {
    const index = adminStore.templates.findIndex(t => t.id === template.id)
    if (index !== -1) {
      adminStore.templates.splice(index, 1)
    }
  }
}

const updateTemplateFilters = (filters) => {
  templateFilters.value = filters
}
</script>