<template>
  <div
    class="bg-white rounded-lg p-4 flex flex-col items-center cursor-pointer hover:shadow-lg transition-all"
    @click="selectSection"
  >
    <div :class="`icon-${section.icon} text-5xl mb-4 text-blue-500`"></div>
    <h2 class="text-xl font-bold text-gray-800">{{ section.title }}</h2>
    <p class="text-gray-600">{{ section.description }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  section: Object,
  sectionSelected: Function
})

const selectSection = () => {
  props.sectionSelected(props.section)
}
</script>

<style scoped>
.bg-white {
  background-color: #ffffff;
}

.text-gray-700 {
  color: #4a5568;
}

.text-gray-800 {
  color: #2d3748;
}

.text-gray-600 {
  color: #718096;
}

.text-blue-500 {
  color: #3182ce;
}

.hover\:shadow-lg:hover {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.transition-all {
  transition: all 0.3s ease;
}
</style>
