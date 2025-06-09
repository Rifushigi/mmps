<template>
  <!-- Result Component -->
  <div class="results w-full bg-white rounded shadow-md p-8 h-full">
    <div class="flex h-[60%] w-full justify-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800 mt-4">Quiz Results</h1>
        <p class="text-lg text-gray-600 mb-4">Your Score:</p>
        <h2 class="text-4xl font-bold mb-6" :class="scoreColorClass">
          {{ numberOfCorrectAnswers }} / {{ quizQuestionLength }} ({{ scorePercentage }}%)
        </h2>
        <p class="text-lg text-gray-600 mb-4">Time Taken: {{ formatTimeTaken(timeTaken.time) }}</p>
        <div v-if="feedbackMessage" class="text-lg mb-4" :class="feedbackColorClass">
          {{ feedbackMessage }}
        </div>
      </div>
    </div>
    <div class="my-8 flex justify-center mr-4">
      <RouterLink
        @click="handleGoBack"
        to="/"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 mr-4"
        >Go Back</RouterLink
      >
    </div>
  </div>
</template>

<script setup>
import { computed} from 'vue'
import { timeLeft, timeTaken } from '../global_state/state'
import router from '@/router'

function handleGoBack() {
  timeLeft.time = props.duration
  timeTaken.time = 0
  router.push('/')
}

const props = defineProps({
  numberOfCorrectAnswers: Number,
  quizQuestionLength: Number,
  quizQuestions: Array,
  yourAnswers: Array,
  duration: Number
})

function formatTimeTaken(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}

const scorePercentage = computed(() =>
  Math.round((props.numberOfCorrectAnswers / props.quizQuestionLength) * 100)
)

const feedbackMessage = computed(() => {
  if (scorePercentage.value >= 80) return 'Excellent work!'
  if (scorePercentage.value >= 60) return 'Good job!'
  return 'You can do better, keep practicing!'
})

const feedbackColorClass = computed(() => {
  if (scorePercentage.value >= 80) return 'text-green-500'
  if (scorePercentage.value >= 60) return 'text-blue-500'
  return 'text-red-500'
})

const scoreColorClass = computed(() => {
  if (scorePercentage.value >= 80) return 'text-green-500'
  if (scorePercentage.value >= 60) return 'text-yellow-500'
  return 'text-red-500'
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

.bg-blue-500 {
  background-color: #3182ce;
}

.bg-blue-600 {
  background-color: #2b6cb0;
}

.text-green-500 {
  color: #48bb78;
}

.text-yellow-500 {
  color: #ecc94b;
}

.text-red-500 {
  color: #f56565;
}

.shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
