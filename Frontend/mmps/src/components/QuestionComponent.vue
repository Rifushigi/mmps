<template>
  <div
    class="question-container mx-auto rounded-md shadow-md bg-white p-6 mb-4 w-full min-w-md sm:max-w-lg h-full"
  >
    <h1 class="question text-2xl font-semibold text-gray-800 mb-4">
      {{ question.text }}
    </h1>
    <div>
      <button
        v-for="option in question.options"
        :key="option.id"
        class="flex items-center py-3 px-4 w-full text-left bg-gray-100 hover:bg-gray-200 rounded mb-2"
        :class="{
          selected: selectedOption === option.id
        }"
        @click="selectOption(option.id, option.isCorrect)"
      >
        <span
          class="mr-4 px-4 py-2 text-lg font-medium text-gray-700 ring-slate-500 ring-2 rounded"
        >
          {{ option.label }}
        </span>
        <span class="option-value text-gray-900">{{ option.text }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['selectOption'])
defineProps({
  question: Object,
  selectedOption: Number
})

const selectOption = (id, isCorrect) => {
  emit('selectOption', { optionId: id, isCorrect })
}
</script>

<style scoped>
.bg-white {
  background-color: #ffffff;
}

.text-gray-800 {
  color: #2d3748;
}

.text-gray-700 {
  color: #4a5568;
}

.text-gray-900 {
  color: #1a202c;
}

.bg-gray-100 {
  background-color: #f7fafc;
}

.bg-gray-200 {
  background-color: #edf2f7;
}

.selected {
  background-color: #90cdf4; 
  border-color: #4299e1; 
  color: #2b6cb0; 
}

.shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.min-w-md {
  min-width: 28rem;
}
</style>
