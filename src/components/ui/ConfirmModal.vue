<template>
  <transition name="modal">
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <!-- Overlay -->
        <div class="fixed inset-0 transition-opacity" @click="handleCancel">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <!-- Modal -->
        <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10" :class="iconBgClass">
              <span class="text-xl">{{ iconEmoji }}</span>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                {{ title }}
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  {{ message }}
                </p>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button 
              @click="handleConfirm"
              type="button" 
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
              :class="confirmButtonClass"
            >
              {{ confirmText }}
            </button>
            <button 
              @click="handleCancel"
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              {{ cancelText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'warning',
    validator: (value) => ['danger', 'warning', 'info'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Confirmer'
  },
  cancelText: {
    type: String,
    default: 'Annuler'
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const iconBgClass = computed(() => {
  switch (props.type) {
    case 'danger':
      return 'bg-red-100'
    case 'warning':
      return 'bg-yellow-100'
    case 'info':
      return 'bg-blue-100'
    default:
      return 'bg-yellow-100'
  }
})

const iconEmoji = computed(() => {
  switch (props.type) {
    case 'danger':
      return '⚠️'
    case 'warning':
      return '❓'
    case 'info':
      return 'ℹ️'
    default:
      return '❓'
  }
})

const confirmButtonClass = computed(() => {
  switch (props.type) {
    case 'danger':
      return 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
    case 'warning':
      return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
    case 'info':
      return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
    default:
      return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
  }
})

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style> 