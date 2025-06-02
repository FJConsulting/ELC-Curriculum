<template>
  <transition name="toast">
    <div 
      v-if="visible" 
      class="fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <CheckCircleIcon v-if="type === 'success'" class="w-6 h-6 text-green-400" />
            <ExclamationTriangleIcon v-else-if="type === 'warning'" class="w-6 h-6 text-yellow-400" />
            <XCircleIcon v-else-if="type === 'error'" class="w-6 h-6 text-red-400" />
            <InformationCircleIcon v-else class="w-6 h-6 text-blue-400" />
          </div>
          <div class="ml-3 w-0 flex-1">
            <p class="text-sm font-medium text-gray-900">{{ title }}</p>
            <p v-if="message" class="mt-1 text-sm text-gray-500">{{ message }}</p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button 
              @click="close"
              class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <span class="sr-only">Close</span>
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <!-- Progress bar -->
      <div v-if="autoClose" class="h-1 bg-gray-100">
        <div 
          :class="progressBarClass"
          class="h-full transition-all duration-100 ease-linear"
          :style="{ width: progressWidth + '%' }"
        ></div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  XCircleIcon, 
  InformationCircleIcon,
  XMarkIcon 
} from '@heroicons/vue/24/outline'

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  autoClose: {
    type: Boolean,
    default: true
  },
  duration: {
    type: Number,
    default: 5000
  }
})

const emit = defineEmits(['close'])

const visible = ref(true)
const progressWidth = ref(100)
let progressTimer = null
let closeTimer = null

const progressBarClass = computed(() => {
  switch (props.type) {
    case 'success': return 'bg-green-400'
    case 'error': return 'bg-red-400'
    case 'warning': return 'bg-yellow-400'
    default: return 'bg-blue-400'
  }
})

const close = () => {
  visible.value = false
  if (progressTimer) clearInterval(progressTimer)
  if (closeTimer) clearTimeout(closeTimer)
  setTimeout(() => emit('close'), 300) // Wait for transition
}

onMounted(() => {
  if (props.autoClose) {
    // Progress bar animation
    progressTimer = setInterval(() => {
      progressWidth.value -= (100 / (props.duration / 100))
      if (progressWidth.value <= 0) {
        clearInterval(progressTimer)
      }
    }, 100)

    // Auto close
    closeTimer = setTimeout(() => {
      close()
    }, props.duration)
  }
})

onUnmounted(() => {
  if (progressTimer) clearInterval(progressTimer)
  if (closeTimer) clearTimeout(closeTimer)
})
</script>

<style scoped>
.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style> 