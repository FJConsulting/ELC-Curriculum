<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- En-tête -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Évaluations</h1>
        <p class="text-gray-600">Testez vos connaissances et progressez vers le niveau supérieur</p>
      </div>

      <!-- Progression -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">Votre progression</h2>
        <div class="space-y-4">
          <div v-for="(progress, level) in userProgress" :key="level" class="border rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <div>
                <h3 class="font-medium">Niveau {{ level }}</h3>
                <p class="text-sm text-gray-600">
                  {{ progress.completedGrammar }}/{{ progress.totalGrammar }} sessions de grammaire complétées
                </p>
              </div>
              <div class="text-right">
                <span class="text-2xl font-bold" :class="progress.percentage >= 80 ? 'text-green-600' : 'text-gray-600'">
                  {{ progress.percentage }}%
                </span>
                <p v-if="progress.canUnlockNext" class="text-sm text-green-600">
                  ✓ Éligible pour l'évaluation suivante
                </p>
              </div>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div 
                class="h-3 rounded-full transition-all duration-300"
                :class="progress.percentage >= 80 ? 'bg-green-500' : 'bg-primary-500'"
                :style="{ width: progress.percentage + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Évaluations disponibles -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div 
          v-for="evaluation in availableEvaluations" 
          :key="evaluation.id"
          class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-lg font-semibold">{{ evaluation.name }}</h3>
              <p class="text-sm text-gray-600 mt-1">{{ evaluation.description }}</p>
            </div>
            <div class="flex-shrink-0">
              <ClipboardCheckIcon class="w-8 h-8 text-primary-500" />
            </div>
          </div>
          
          <div class="space-y-2 mb-4">
            <div class="flex items-center text-sm text-gray-600">
              <ClockIcon class="w-4 h-4 mr-2" />
              Durée : {{ evaluation.duration }} minutes
            </div>
            <div class="flex items-center text-sm text-gray-600">
              <ChartBarIcon class="w-4 h-4 mr-2" />
              Score requis : {{ evaluation.passingScore }}%
            </div>
            <div v-if="evaluation.targetLevel" class="flex items-center text-sm text-gray-600">
              <AcademicCapIcon class="w-4 h-4 mr-2" />
              Déblocage : Niveau {{ evaluation.targetLevel }}
            </div>
          </div>
          
          <button 
            @click="startEvaluation(evaluation.id)"
            class="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Commencer l'évaluation
          </button>
        </div>
        
        <!-- Message si aucune évaluation disponible -->
        <div v-if="availableEvaluations.length === 0" class="col-span-full text-center py-12">
          <ClipboardXIcon class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-600">
            Aucune évaluation disponible pour le moment.
            <br>Complétez plus de sessions de grammaire pour débloquer la prochaine évaluation.
          </p>
        </div>
      </div>

      <!-- Historique des évaluations -->
      <div v-if="userEvaluations.length > 0" class="bg-white rounded-xl shadow-sm p-6">
        <h2 class="text-xl font-semibold mb-4">Historique des évaluations</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Évaluation
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Certificat
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="result in userEvaluations" :key="result.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ getEvaluationName(result.evaluationId) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(result.completedAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ result.score }}%
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="result.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  >
                    {{ result.passed ? 'Réussi' : 'Échoué' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button 
                    v-if="result.certificateId"
                    @click="downloadCertificate(result.certificateId)"
                    class="text-primary-600 hover:text-primary-800"
                  >
                    <DownloadIcon class="w-5 h-5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal d'évaluation -->
    <EvaluationModal v-if="evaluationInProgress" />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEvaluationsStore } from '@/stores/evaluations'
import { useAuthStore } from '@/stores/auth'
import EvaluationModal from '@/components/evaluations/EvaluationModal.vue'
import { 
  ClipboardCheck as ClipboardCheckIcon,
  ClipboardX as ClipboardXIcon,
  Clock as ClockIcon,
  ChartBar as ChartBarIcon,
  GraduationCap as AcademicCapIcon,
  Download as DownloadIcon
} from 'lucide-vue-next'

const router = useRouter()
const evaluationsStore = useEvaluationsStore()
const authStore = useAuthStore()

// Computed
const availableEvaluations = computed(() => evaluationsStore.availableEvaluations)
const userProgress = computed(() => evaluationsStore.userProgress)
const userEvaluations = computed(() => evaluationsStore.userEvaluations)
const evaluationInProgress = computed(() => evaluationsStore.evaluationInProgress)

// Methods
const startEvaluation = (evaluationId) => {
  if (!authStore.isAuthenticated) {
    router.push('/auth')
    return
  }
  
  evaluationsStore.startEvaluation(evaluationId)
}

const getEvaluationName = (evaluationId) => {
  const evaluation = evaluationsStore.evaluations.find(e => e.id === evaluationId)
  return evaluation?.name || 'Évaluation inconnue'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const downloadCertificate = (certificateId) => {
  const certificate = evaluationsStore.getCertificate(certificateId)
  if (!certificate) return
  
  // Générer un certificat PDF (simplifié pour l'exemple)
  const content = `
    CERTIFICAT DE RÉUSSITE
    
    Nous certifions que ${certificate.userName}
    a réussi avec succès l'évaluation : ${certificate.evaluationName}
    
    Score obtenu : ${certificate.score}%
    Date : ${new Date(certificate.completedAt).toLocaleDateString('fr-FR')}
    Niveau : ${certificate.level}
    
    Certificat ID : ${certificate.id}
    
    ELC Academy
  `
  
  const blob = new Blob([content], { type: 'text/plain' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `certificat-${certificateId}.txt`
  a.click()
  window.URL.revokeObjectURL(url)
}

// Lifecycle
onMounted(() => {
  evaluationsStore.loadEvaluations()
})
</script> 