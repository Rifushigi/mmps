<!-- src/components/UserCard.vue -->
<template>
  <div
    class="bg-white rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-blue-100 transition-all"
    @click="goToDetail"
  >
    <h2 class="text-xl font-bold text-gray-800">{{ user.name }}</h2>
    <p class="text-gray-600">{{ user.role }}</p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  user: Object
})

const router = useRouter()

const goToDetail = () => {
  router.push({ name: 'UserDetail', params: { id: props.user._id } })
}
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

.hover\:bg-blue-100:hover {
  background-color: #ebf8ff;
}

.transition-all {
  transition: all 0.3s ease-in-out;
}

.rounded-lg {
  border-radius: 0.5rem;
}
</style>
