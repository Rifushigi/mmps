<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-gray-700">{{ label }}</label>
    <input
      :id="id"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :type="type"
      :autocomplete="autocomplete"
      required
      class="mt-1 p-2 w-full rounded-md shadow-sm focus:outline-none border-2 focus:border-blue-500 sm:text-sm text-gray-900"
    />
  </div>
</template>

<script setup>
defineProps({
  id: String,
  modelValue: String,
  label: String,
  type: {
    type: String,
    default: 'text'
  },
  autocomplete: {
    type: String,
    default: 'on'
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

.border-2 {
  border-width: 2px;
}

.focus\:border-blue-500:focus {
  border-color: #3182ce;
}

.shadow-sm {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
</style>
