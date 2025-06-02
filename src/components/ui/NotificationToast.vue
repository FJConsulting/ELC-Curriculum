<template>
  <transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="show" class="fixed bottom-0 right-0 m-6 z-50">
      <div :class="[
        'max-w-sm w-full shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden',
        typeClasses[type].bg
      ]">
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <component :is="icon" :class="['h-6 w-6', typeClasses[type].icon]" />
            </div>
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p :class="['text-sm font-medium', typeClasses[type].title]">
                {{ title }}
              </p>
              <p v-if="message" :class="['mt-1 text-sm', typeClasses[type].text]">
                {{ message }}
              </p>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
              <button
                @click="$emit('close')"
                :class="[
                  'inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2',
                  typeClasses[type].button
                ]"
              >
                <span class="sr-only">Fermer</span>
                <XMarkIcon class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'
import { 
  CheckCircle as CheckCircleIcon, 
  XCircle as XCircleIcon,
  AlertCircle as ExclamationCircleIcon,
  Info as InformationCircleIcon,
  X as XMarkIcon
} from 'lucide-vue-next'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  }
})

defineEmits(['close'])

const typeClasses = {
  success: {
    bg: 'bg-green-50',
    icon: 'text-green-400',
    title: 'text-green-800',
    text: 'text-green-700',
    button: 'text-green-500 hover:text-green-600 focus:ring-green-500'
  },
  error: {
    bg: 'bg-red-50',
    icon: 'text-red-400',
    title: 'text-red-800',
    text: 'text-red-700',
    button: 'text-red-500 hover:text-red-600 focus:ring-red-500'
  },
  warning: {
    bg: 'bg-yellow-50',
    icon: 'text-yellow-400',
    title: 'text-yellow-800',
    text: 'text-yellow-700',
    button: 'text-yellow-500 hover:text-yellow-600 focus:ring-yellow-500'
  },
  info: {
    bg: 'bg-blue-50',
    icon: 'text-blue-400',
    title: 'text-blue-800',
    text: 'text-blue-700',
    button: 'text-blue-500 hover:text-blue-600 focus:ring-blue-500'
  }
}

const icon = computed(() => {
  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationCircleIcon,
    info: InformationCircleIcon
  }
  return icons[props.type]
})
</script> 