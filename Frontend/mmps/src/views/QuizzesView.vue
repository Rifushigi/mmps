<template>
  <!-- Quizzes View -->
  <div class="bg-gray-100 flex flex-col justify-start items-center pb-10 h-dvh overflow-y-auto">
    <QuizzesHeader />
    <div class="flex flex-col items-center h-full">
      <h1 class="text-3xl font-bold text-gray-800 my-8">Select a Quiz</h1>

      <div class="flex-grow w-full mt-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <Card v-for="quiz in quizData" :key="quiz.id" :quiz="quiz" @quizSelected="onSelectQuiz" />
        </div>
      </div>
      <FacialRecognitionModal
        :show="showModal"
        mode="quiz"
        :quizId="quizId"
        @verified="handleFaceVerified"
        @close="closeModal"
      />
      <p v-if="quizData.length === 0" class="text-gray-600 mt-4">
        No quizzes found in this category.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import router from '@/router'
import Card from '@/components/QuizCard.vue'
import FacialRecognitionModal from '@/components/FacialRecognitionModal.vue'
import QuizzesHeader from '@/components/QuizzesHeader.vue'
import {
  capturing,
  showCamera,
  cancelLoading,
  view,
  timeLeft,
  verified
} from '@/global_state/state'
import { axiosInstance } from '@/axiosConfig'
import store from '@/store/store'

const showModal = ref(false)
const quizId = ref(null)
const quizData = ref([])

console.log(quizId)

onMounted(() => {
  view.value = 'user'
  fetchQuizzes()
})

const fetchQuizzes = async () => {
  const response = await axiosInstance.get('/quiz')
  const quizzes = response.data.data
  const userId = store.getters.user._id
  quizzes.forEach((quiz) => {
    quiz.taken = quiz.taken.includes(userId)
  })

  quizData.value = quizzes
}

const onSelectQuiz = (quiz, time) => {
  console.log('Quiz selected:', quiz)
  timeLeft.time = time * 60
  showModal.value = true
  showCamera.state = true
  cancelLoading.value = false
  quizId.value = quiz.toString()
}

const closeModal = () => {
  showModal.value = false
  capturing.state = false
  showCamera.state = false
}

// Function to handle the "verified" event from the modal
const handleFaceVerified = () => {
  showModal.value = false
  verified.value = true
  capturing.state = false
  showCamera.state = false
  console.log('got here', quizId.value)
  router.push(`/quiz/${quizId.value}`)
}
</script>

<style scoped>
.bg-gray-100 {
  background-color: #f7fafc;
}

.text-gray-800 {
  color: #2d3748;
}

.text-gray-600 {
  color: #718096;
}

.card {
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 16px;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-4px);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
}

.card-description {
  font-size: 1rem;
  color: #4a5568;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.card-footer button {
  background-color: #3182ce;
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.card-footer button:hover {
  background-color: #2b6cb0;
}
</style>
