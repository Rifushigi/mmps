<template>
  <div class="bg-white rounded-lg p-4 flex flex-col items-center shadow-md">
    <h2 class="text-xl font-bold text-gray-800">{{ stat.title }}</h2>
    <p class="text-gray-600">{{ stat.value }}</p>
  </div>
</template>

<script setup>
defineProps({
  stat: Object
})
</script>

<style scoped>
.bg-white {
  background-color: #ffffff;
}

.text-gray-800 {
  color: #2d3748;
}

.text-gray-600 {
  color: #718096;
}

.shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
