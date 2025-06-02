<template>
  <teleport to="body">
    <transition name="modal">
      <div v-if="visible" class="modal-overlay" @click.self="handleCancel">
        <div class="modal-content max-w-md">
          <div class="flex items-start mb-4">
            <div class="flex-shrink-0">
              <ExclamationTriangleIcon 
                v-if="type === 'warning'" 
                class="w-8 h-8 text-yellow-400" 
              />
              <XCircleIcon 
                v-else-if="type === 'danger'" 
                class="w-8 h-8 text-red-400" 
              />
              <InformationCircleIcon 
                v-else 
                class="w-8 h-8 text-blue-400" 
              />
            </div>
            <div class="ml-4 flex-1">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                {{ title }}
              </h3>
              <p class="text-gray-600">
                {{ message }}
              </p>
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button 
              @click="handleCancel"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              :disabled="loading"
            >
              {{ cancelText }}
            </button>
            <button 
              @click="handleConfirm"
              :class="confirmButtonClass"
              class="px-4 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="loading"
            >
              <span v-if="loading" class="spinner mr-2"></span>
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  ExclamationTriangleIcon, 
  XCircleIcon, 
  InformationCircleIcon 
} from '@heroicons/vue/24/outline'

const props = defineProps({
  title: {
    type: String,
    default: 'Confirmation'
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'warning', 'danger'].includes(value)
  },
  confirmText: {
    type: String,
    default: 'Confirmer'
  },
  cancelText: {
    type: String,
    default: 'Annuler'
  },
  onConfirm: {
    type: Function,
    required: true
  },
  onCancel: {
    type: Function,
    default: null
  }
})

const emit = defineEmits(['close'])

const visible = ref(true)
const loading = ref(false)

const confirmButtonClass = computed(() => {
  switch (props.type) {
    case 'danger':
      return 'bg-red-600 hover:bg-red-700'
    case 'warning':
      return 'bg-yellow-600 hover:bg-yellow-700'
    default:
      return 'bg-primary-600 hover:bg-primary-700'
  }
})

const handleConfirm = async () => {
  loading.value = true
  try {
    await props.onConfirm()
    visible.value = false
    setTimeout(() => emit('close'), 300)
  } catch (error) {
    console.error('Confirm action failed:', error)
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  if (props.onCancel) {
    props.onCancel()
  }
  visible.value = false
  setTimeout(() => emit('close'), 300)
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95) translateY(-20px);
}
</style> 