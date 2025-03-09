<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg p-6 w-96 shadow-lg">
      <h3 class="text-2xl font-semibold mb-4 text-gray-700">Confirm Action</h3>
      <p class="mb-6 text-gray-700">Are you sure you want to access {{ section.title }}?</p>
      <div class="flex justify-end mt-6">
        <button
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded mr-2"
          @click="close"
        >
          Cancel
        </button>
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          @click="confirmAction"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  section: Object
})
const emit = defineEmits(['actionConfirmed', 'close'])

const confirmAction = () => {
  emit('actionConfirmed')
}

const close = () => {
  emit('close')
}
</script>

<style scoped>
.bg-white {
  background-color: #ffffff;
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

.text-gray-800 {
  color: #2d3748;
}

.bg-blue-600 {
  background-color: #3182ce;
}

.bg-blue-700 {
  background-color: #2b6cb0;
}

.shadow-lg {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}
</style>
