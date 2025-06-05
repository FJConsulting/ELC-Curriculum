<template>
  <transition
    enter-active-class="ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          @click="$emit('close')"
        ></div>

        <transition
          enter-active-class="ease-out duration-300"
          enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
          leave-active-class="ease-in duration-200"
          leave-from-class="opacity-100 translate-y-0 sm:scale-100"
          leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            v-if="show"
            class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
          >
            <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div
                  :class="[
                    'mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10',
                    typeStyles[type].bg
                  ]"
                >
                  <component :is="icon" :class="['h-6 w-6', typeStyles[type].icon]" />
                </div>
                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 class="text-base font-semibold leading-6 text-gray-900">
                    {{ title }}
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      {{ message }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                @click="$emit('confirm')"
                :class="[
                  'inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto',
                  typeStyles[type].button
                ]"
              >
                {{ confirmText }}
              </button>
              <button
                type="button"
                @click="$emit('close')"
                class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                {{ cancelText }}
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'
import {
  AlertTriangle as ExclamationTriangleIcon,
  CheckCircle2 as CheckCircleIcon,
  XCircle as XCircleIcon,
  Info as InformationCircleIcon
} from 'lucide-vue-next'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirmer l\'action'
  },
  message: {
    type: String,
    default: 'Êtes-vous sûr de vouloir continuer ?'
  },
  confirmText: {
    type: String,
    default: 'Confirmer'
  },
  cancelText: {
    type: String,
    default: 'Annuler'
  },
  type: {
    type: String,
    default: 'warning',
    validator: (value) => ['warning', 'danger', 'success', 'info'].includes(value)
  }
})

defineEmits(['confirm', 'close'])

const typeStyles = {
  warning: {
    bg: 'bg-yellow-100',
    icon: 'text-yellow-600',
    button: 'bg-yellow-600 hover:bg-yellow-500 focus-visible:outline-yellow-600'
  },
  danger: {
    bg: 'bg-red-100',
    icon: 'text-red-600',
    button: 'bg-red-600 hover:bg-red-500 focus-visible:outline-red-600'
  },
  success: {
    bg: 'bg-green-100',
    icon: 'text-green-600',
    button: 'bg-green-600 hover:bg-green-500 focus-visible:outline-green-600'
  },
  info: {
    bg: 'bg-blue-100',
    icon: 'text-blue-600',
    button: 'bg-blue-600 hover:bg-blue-500 focus-visible:outline-blue-600'
  }
}

const icon = computed(() => {
  const icons = {
    warning: ExclamationTriangleIcon,
    danger: XCircleIcon,
    success: CheckCircleIcon,
    info: InformationCircleIcon
  }
  return icons[props.type]
})
</script> 