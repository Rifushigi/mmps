<template>
  <div class="relative">
    <label :for="id" class="block text-sm font-medium text-gray-700">{{ label }}</label>
    <div class="relative">
      <input
        :id="id"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :type="passwordVisible ? 'text' : 'password'"
        :autocomplete="autocomplete"
        required
        :class="[
          'mt-1 p-2 w-full focus:outline-none border-2 focus:border-blue-500 rounded-md shadow-sm sm:text-sm text-gray-900',
          passwordMatchClass
        ]"
      />
      <button
        @click="togglePasswordVisibility"
        type="button"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-400"
      >
        {{ passwordVisible ? 'Hide' : 'Show' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

let props = defineProps({
  id: String,
  modelValue: String,
  label: String,
  passwordMatch: Boolean,
  autocomplete: {
    type: String,
    default: 'on'
  }
})

const passwordVisible = ref(false)
const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}

const passwordMatchClass = computed(() => {
  return {
    'border-gray-300': props.modelValue === '',
    'border-green-500': props.passwordMatch && props.modelValue !== '',
    'border-red-500': !props.passwordMatch && props.modelValue !== ''
  }
})
</script>

<style scoped>
.text-gray-700 {
  color: #4a5568;
}

.text-gray-900 {
  color: #1a202c;
}

.border-gray-300 {
  border-color: #d1d5db;
}

.border-blue-500 {
  border-color: #3182ce;
}

.border-green-500 {
  border-color: #48bb78;
}

.border-red-500 {
  border-color: #f56565;
}

.focus\:border-blue-500:focus {
  border-color: #3182ce;
}

.shadow-sm {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
</style>
