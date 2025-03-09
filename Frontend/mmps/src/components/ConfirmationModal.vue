<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg p-6 w-80">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Confirm Submission</h2>
      <p class="mb-6 text-gray-700">Are you sure you want to submit the quiz?</p>
      <div class="flex justify-end">
        <button
          @click="$emit('cancel')"
          class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 mr-2"
        >
          Cancel
        </button>
        <button
          @click="$emit('confirm')"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean
})
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

.bg-gray-300 {
  background-color: #e2e8f0;
}

.bg-gray-400 {
  background-color: #cbd5e0;
}

.text-gray-700 {
  color: #4a5568;
}

.bg-blue-500 {
  background-color: #3182ce;
}

.bg-blue-600 {
  background-color: #2b6cb0;
}

.shadow-lg {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}
</style>
