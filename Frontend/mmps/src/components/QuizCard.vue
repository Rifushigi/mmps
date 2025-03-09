<!-- src/components/QuizCard.vue -->
<template>
  <div
    @click="selectQuiz"
    :class="{
      'card-taken': quiz.taken && !store.getters.isAdmin,
      'card-available': !quiz.taken || store.getters.isAdmin
    }"
    class="bg-white text-gray-800 p-4 rounded-lg hover:bg-blue-100 cursor-pointer transition-all duration-200 shadow-md"
  >
    <h3 class="text-lg font-bold mb-2">{{ quiz.name }}</h3>
    <p class="text-sm">Questions: {{ quiz.questions.length }}</p>
    <p class="text-sm">Time: {{ quiz.duration }} Minutes</p>
    <p v-if="isAdmin" class="text-sm">Created at: {{ formatDate(quiz.dateCreated) }}</p>
    <div v-if="quiz.taken && !store.getters.isAdmin" class="text-red-400 text-sm">
      Already taken
    </div>
  </div>
</template>

<script setup>
import { quiz_id } from '@/global_state/state'
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const isAdmin = computed(() => store.getters.isAdmin)

const props = defineProps({ quiz: Object })
const emit = defineEmits(['quizSelected'])

console.log(props.quiz)

const selectQuiz = () => {
  const quizId = store.getters.isAdmin ? props.quiz._id : props.quiz.id
  quiz_id.value = props.quiz._id
  console.log(props.quiz.taken)
  if (!props.quiz.taken || store.getters.isAdmin) {
    emit('quizSelected', quizId, props.quiz.duration)
  }
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}
</script>

<style scoped>
.card-taken {
  cursor: not-allowed;
  opacity: 0.6;
}

.card-available:hover {
  background-color: #ebf8ff; /* Light blue background on hover */
}

.text-gray-800 {
  color: #2d3748;
}

.text-gray-300 {
  color: #d1d5db;
}

.text-red-400 {
  color: #fc8181;
}

.bg-white {
  background-color: #ffffff;
}

.hover\:bg-blue-100:hover {
  background-color: #ebf8ff;
}

.shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
