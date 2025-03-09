<template>
  <div
    class="bg-gray-100 flex flex-col justify-start items-center pb-10 h-dvh overflow-y-auto w-screen"
  >
    <AdminHeader />
    <div class="flex flex-col items-center h-full w-full px-14">
      <h1 class="text-3xl font-bold text-gray-800 mb-8 mt-4">Quiz Management</h1>

      <!-- Search Input -->
      <div class="flex mb-4 justify-between space-x-8">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by title"
          class="p-2 rounded bg-white text-gray-800 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        />

        <button
          class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          @click="openCreateModal"
        >
          Create New Quiz
        </button>
      </div>

      <div class="flex-grow w-full mt-8">
        <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <QuizCard
            v-for="quiz in filteredQuizzes"
            :key="quiz.id"
            :quiz="quiz"
            @quizSelected="onSelectQuiz"
            class="bg-white shadow-md rounded p-4 transition-transform transform hover:translate-y-[-4px]"
          />
        </div>
      </div>

      <CreateQuizModal
        :show="showCreateModal"
        @quizCreated="handleQuizCreated"
        @close="closeCreateModal"
      />

      <p v-if="filteredQuizzes.length === 0" class="text-gray-600 mt-4">No quizzes available.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminHeader from '@/components/AdminHeader.vue'
import QuizCard from '@/components/QuizCard.vue'
import CreateQuizModal from '@/components/CreateQuizModal.vue'
import { axiosInstance } from '@/axiosConfig'

const router = useRouter()
const quizzes = ref([])
const showCreateModal = ref(false)
const searchQuery = ref('') // Add search query

const onSelectQuiz = (quiz) => {
  router.push({ name: 'QuizDetail', params: { id: quiz } })
}

const fetchQuizzes = async () => {
  const response = await axiosInstance.get('/quiz')
  quizzes.value = response.data.data
}

onMounted(fetchQuizzes)

const openCreateModal = () => {
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
}

const handleQuizCreated = async (newQuiz) => {
  try {
    console.log(newQuiz)
    const response = await axiosInstance.post('/quiz', newQuiz)
    if (response.data.data) {
      // Assuming the API returns the created quiz
      quizzes.value.push(response.data.data)
      showCreateModal.value = false
    } else {
      console.error('Quiz creation response did not contain quiz data')
    }
  } catch (error) {
    console.error('Error creating quiz:', error)
    // Handle error (e.g., show error message to user)
  }
}

// Computed property for filtered quizzes
const filteredQuizzes = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return quizzes.value.filter(
    (quiz) => quiz.name && typeof quiz.name === 'string' && quiz.name.toLowerCase().includes(query)
  )
})
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

.bg-white {
  background-color: #ffffff;
}

.border-gray-300 {
  border-color: #e2e8f0;
}

.bg-blue-600 {
  background-color: #3182ce;
}

.bg-blue-700 {
  background-color: #2b6cb0;
}

.text-white {
  color: #ffffff;
}

.rounded {
  border-radius: 0.25rem;
}

.focus\:ring-blue-500:focus {
  box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.5);
}

.focus\:border-blue-500:focus {
  border-color: #3182ce;
}

.shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.transition-transform {
  transition: transform 0.2s;
}

.transform {
  transform: translateY(0);
}

.hover\:translate-y-\[-4px\]:hover {
  transform: translateY(-4px);
}
</style>
