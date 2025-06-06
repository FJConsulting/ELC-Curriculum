<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-semibold">Gestion des évaluations</h2>
        <p class="text-gray-600 mt-1">Créez et modifiez les évaluations de niveau</p>
      </div>
      <button 
        @click="showEvaluationModal()"
        class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
      >
        <PlusIcon class="w-5 h-5 inline mr-1" />
        Nouvelle évaluation
      </button>
    </div>

    <!-- Liste des évaluations -->
    <div class="bg-white rounded-lg shadow">
      <div class="p-4 border-b">
        <h3 class="font-medium">Évaluations existantes</h3>
      </div>
      <div class="divide-y">
        <div 
          v-for="evaluation in evaluations" 
          :key="evaluation.id"
          class="p-4 hover:bg-gray-50"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <h4 class="font-medium">{{ evaluation.name }}</h4>
              <p class="text-sm text-gray-600 mt-1">{{ evaluation.description }}</p>
              <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span class="flex items-center">
                  <ClockIcon class="w-4 h-4 mr-1" />
                  {{ evaluation.duration }} min
                </span>
                <span class="flex items-center">
                  <ListBulletIcon class="w-4 h-4 mr-1" />
                  {{ evaluation.questions.length }} questions
                </span>
                <span class="flex items-center">
                  <ChartBarIcon class="w-4 h-4 mr-1" />
                  Score requis: {{ evaluation.passingScore }}%
                </span>
                <span v-if="evaluation.targetLevel" class="flex items-center">
                  <AcademicCapIcon class="w-4 h-4 mr-1" />
                  Déblocage: {{ evaluation.targetLevel }}
                </span>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button 
                @click="showEvaluationModal(evaluation)"
                class="p-2 text-blue-600 hover:bg-blue-50 rounded"
              >
                <PencilIcon class="w-5 h-5" />
              </button>
              <button 
                @click="showQuestionsModal(evaluation)"
                class="p-2 text-green-600 hover:bg-green-50 rounded"
              >
                <DocumentTextIcon class="w-5 h-5" />
              </button>
              <button 
                @click="deleteEvaluation(evaluation)"
                class="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <TrashIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'édition d'évaluation -->
    <div v-if="evaluationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold">
            {{ editingEvaluation ? 'Modifier l\'évaluation' : 'Nouvelle évaluation' }}
          </h3>
          <button 
            @click="closeEvaluationModal"
            class="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Type d'évaluation</label>
            <select 
              v-model="evaluationForm.type"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="initial">Évaluation initiale</option>
              <option value="level">Évaluation de niveau</option>
              <option value="final">Évaluation finale</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input 
              v-model="evaluationForm.name"
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Certification A2"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              v-model="evaluationForm.description"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Description de l'évaluation..."
            ></textarea>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Durée (minutes)</label>
              <input 
                v-model.number="evaluationForm.duration"
                type="number" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                min="10"
                max="180"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Score requis (%)</label>
              <input 
                v-model.number="evaluationForm.passingScore"
                type="number" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                min="0"
                max="100"
              >
            </div>
          </div>
          
          <div v-if="evaluationForm.type === 'level'" class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Niveau requis</label>
              <select 
                v-model="evaluationForm.requiredLevel"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Aucun</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Niveau à débloquer</label>
              <select 
                v-model="evaluationForm.targetLevel"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Aucun</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="mt-6 flex justify-end space-x-3">
          <button 
            @click="closeEvaluationModal"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          <button 
            @click="saveEvaluation"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            {{ editingEvaluation ? 'Mettre à jour' : 'Créer' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal des questions -->
    <div v-if="questionsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold">
            Questions de l'évaluation : {{ currentEvaluation?.name }}
          </h3>
          <button 
            @click="questionsModal = false"
            class="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        
        <div class="space-y-4">
          <!-- Liste des questions -->
          <div 
            v-for="(question, index) in currentEvaluation?.questions" 
            :key="question.id"
            class="border rounded-lg p-4"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <p class="font-medium">Question {{ index + 1 }}</p>
                <p class="mt-1">{{ question.text }}</p>
                <div class="mt-2 space-y-1">
                  <div 
                    v-for="(option, optIndex) in question.options" 
                    :key="optIndex"
                    class="flex items-center"
                  >
                    <span 
                      class="w-6 h-6 rounded-full mr-2 flex items-center justify-center text-xs"
                      :class="option === question.correctAnswer ? 'bg-green-100 text-green-600' : 'bg-gray-100'"
                    >
                      {{ String.fromCharCode(65 + optIndex) }}
                    </span>
                    <span :class="option === question.correctAnswer ? 'font-medium text-green-600' : ''">
                      {{ option }}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                @click="editQuestion(question, index)"
                class="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded"
              >
                <PencilIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <button 
            @click="addNewQuestion"
            class="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 text-gray-600"
          >
            <PlusIcon class="w-6 h-6 mx-auto mb-1" />
            Ajouter une question
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { 
  Plus as PlusIcon,
  Pencil as PencilIcon,
  Trash as TrashIcon,
  Clock as ClockIcon,
  List as ListBulletIcon,
  ChartBar as ChartBarIcon,
  GraduationCap as AcademicCapIcon,
  X as XMarkIcon,
  FileText as DocumentTextIcon
} from 'lucide-vue-next'

const adminStore = useAdminStore()

// État local
const evaluationModal = ref(false)
const questionsModal = ref(false)
const editingEvaluation = ref(null)
const currentEvaluation = ref(null)

const evaluationForm = ref({
  type: 'level',
  name: '',
  description: '',
  duration: 45,
  passingScore: 80,
  requiredLevel: '',
  targetLevel: '',
  questions: []
})

// Computed
const evaluations = computed(() => {
  // Pour l'instant, utiliser des données mockées
  return [
    {
      id: 1,
      type: 'initial',
      name: 'Évaluation de niveau initiale',
      description: 'Déterminez votre niveau d\'anglais actuel',
      duration: 30,
      questions: generateSampleQuestions(10),
      passingScore: 0,
      targetLevel: null
    },
    {
      id: 2,
      type: 'level',
      name: 'Certification A2',
      description: 'Évaluation pour accéder au niveau A2',
      duration: 45,
      questions: generateSampleQuestions(20),
      passingScore: 80,
      targetLevel: 'A2',
      requiredLevel: 'A1'
    }
  ]
})

// Methods
const showEvaluationModal = (evaluation = null) => {
  if (evaluation) {
    editingEvaluation.value = evaluation
    evaluationForm.value = {
      type: evaluation.type,
      name: evaluation.name,
      description: evaluation.description,
      duration: evaluation.duration,
      passingScore: evaluation.passingScore,
      requiredLevel: evaluation.requiredLevel || '',
      targetLevel: evaluation.targetLevel || '',
      questions: [...evaluation.questions]
    }
  } else {
    editingEvaluation.value = null
    evaluationForm.value = {
      type: 'level',
      name: '',
      description: '',
      duration: 45,
      passingScore: 80,
      requiredLevel: '',
      targetLevel: '',
      questions: []
    }
  }
  evaluationModal.value = true
}

const closeEvaluationModal = () => {
  evaluationModal.value = false
  editingEvaluation.value = null
}

const saveEvaluation = () => {
  // Logique pour sauvegarder l'évaluation
  console.log('Saving evaluation:', evaluationForm.value)
  closeEvaluationModal()
}

const deleteEvaluation = (evaluation) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer l'évaluation "${evaluation.name}" ?`)) {
    console.log('Deleting evaluation:', evaluation)
  }
}

const showQuestionsModal = (evaluation) => {
  currentEvaluation.value = evaluation
  questionsModal.value = true
}

const editQuestion = (question, index) => {
  console.log('Editing question:', question, index)
}

const addNewQuestion = () => {
  console.log('Adding new question')
}

// Helpers
function generateSampleQuestions(count) {
  const questions = []
  for (let i = 1; i <= count; i++) {
    questions.push({
      id: i,
      type: 'multiple-choice',
      text: `Question ${i}: Exemple de question`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 'Option A',
      level: 'A2'
    })
  }
  return questions
}
</script>