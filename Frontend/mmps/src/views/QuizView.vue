<template>
  <!-- Quiz View -->
  <div class="bg-slate-800 max-h-screen h-screen flex flex-col" v-if="quiz">
    <QuizHeader :quiz="quiz" :question-status="questionStatus" :bar-percentage="barPercentage" />

    <div class="flex-1 flex justify-center items-center">
      <div v-if="isLoading" class="flex items-center justify-center min-h-screen">Loading...</div>
      <div v-else-if="!showResults && !isLoading" class="w-[50%] flex items-center justify-center">
        <div class="grid grid-flow-col">
          <Question
            :question="quiz.questions[currentQuestionIndex]"
            :selected-option="selectedOptions[currentQuestionIndex]"
            @selectOption="onOptionSelected"
          />
          <!-- Sidebar for navigating questions -->
          <QuestionSidebar
            :questions="quiz.questions"
            :current-question-index="currentQuestionIndex"
            :answered-questions="answeredQuestions"
            @navigateToQuestion="navigateToQuestion"
            @submit="showConfirmationModal = true"
          />
        </div>
      </div>
      <Result
        v-else
        :numberOfCorrectAnswers="numberOfCorrectAnswers"
        :quizQuestionLength="quiz.questions.length"
        :quizQuestions="quiz.questions"
        :yourAnswers="userAnswers"
        @retakeQuiz="restartQuiz"
        :duration="quiz.duration"
      />
    </div>
    <!-- Facial Recognition Modal -->
    <FacialRecognitionModal
      :show="showFacialRecognition"
      :mode="'quiz'"
      :quiz-id="quizId.value ? quizId.value.toString() : ''"
      @not-verified="handleVerificationFailed"
      @close="handleModalClose"
      @verified="handleVerificationSuccess"
      @not-captured="handleVerificationFailed"
      childStyle="h-90"
      class="!bg-opacity-0 h-full !inset-auto flex flex-col items-center justify-center my-12 px-4"
      :showCloseButton="true"
    />
    <!-- <div class="fixed bottom-4 left-4 z-50 bg-white shadow-md rounded p-4 w-[300px]"> -->
  </div>
  <div v-else class="flex items-center justify-center min-h-screen">Quiz not found.</div>

  <ConfirmationModal
    v-if="showConfirmationModal"
    @confirm="submitQuiz"
    @cancel="showConfirmationModal = false"
  />
</template>

<script setup>
import { ref, computed, reactive, onBeforeUnmount, onMounted, watch } from 'vue'
import Question from '@/components/QuestionComponent.vue'
import QuizHeader from '@/components/QuizHeader.vue'
import Result from '@/components/ResultComponent.vue'
import QuestionSidebar from '@/components/QuestionSidebar.vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import FacialRecognitionModal from '@/components/FacialRecognitionModal.vue'
import { useRoute } from 'vue-router'
import { showCamera, timeLeft, timeTaken, capturing } from '@/global_state/state'
import { useStore } from 'vuex'
import { axiosInstance } from '@/axiosConfig'
import router from '@/router'

const timerInitialized = ref(false)
const verified = ref(false)
const quizes = ref([])
const route = useRoute()
const store = useStore()
const quizId = ref(Number(route.params.id))
const quiz = ref(null)
const showResults = ref(false)
const currentQuestionIndex = ref(0)
const userAnswers = reactive({})
const answeredQuestions = reactive([])
const numberOfCorrectAnswers = ref(0)
let verificationInterval = null
const showFacialRecognition = ref(false)
const showConfirmationModal = ref(false)
const isLoading = ref(true)
const originalDuration = ref(0)
const selectedOptions = reactive([])
const isVerifyingNow = ref(false)


const closeModal = () => {
  showFacialRecognition.value = false
  capturing.state = false
  showCamera.state = false
}

const handleVerificationFailed = async () => {
  console.log('Verification failed, submitting quiz...')
  await closeModal()
  await submitQuiz()

  if (timerIntervalValue.value) {
    clearInterval(timerIntervalValue.value)
  }

  // ✅ Force route navigation
  router.push('/')
}

const handleVerificationSuccess = () => {
  console.log('Verification successful')
  closeModal()
}

const handleModalClose = () => {
  console.log('Modal closed')
  closeModal()
}

const fetchQuizzes = async () => {
  try {
    const response = await axiosInstance.get('/quiz')
    quizes.value = response.data.data
    quiz.value = quizes.value.find((q) => q.id == quizId.value)
    if (quiz.value) {
      originalDuration.value = quiz.value.duration * 60
      timeLeft.time = quiz.value.duration * 60 // Set initial time
       localStorage.setItem('quizTimeLeft', timeLeft.time.toString())
      selectedOptions.splice(
        0,
        selectedOptions.length,
        ...Array(quiz.value.questions.length).fill(null)
      ) // Initialize selected options
    }
    isLoading.value = false
  } catch (error) {
    console.error('Error fetching quizzes:', error)
    isLoading.value = false
  }
}

watch(timeLeft, (newValue) => {
  localStorage.setItem('quizTimeLeft', newValue.toString())
}, { deep: true })

const verificationCheckpoints = ref([])
const progressTriggered = ref(false)

const scheduleNextVerification = () => {
  if (showResults.value || timeLeft.time <= 0) return;

  const minInterval = Math.floor(originalDuration.value / 4)
  const maxInterval = Math.floor(originalDuration.value / 3)
  const delay = Math.floor(Math.random() * (maxInterval - minInterval + 1) + minInterval) * 1000

  verificationInterval = setTimeout(() => {
    if (!showResults.value && timeLeft.time > 0) {
      isVerifyingNow.value = true
      showFacialRecognition.value = true
      showCamera.state = true
    }
    scheduleNextVerification()
  }, delay)
}

const startVerificationChecks = () => {
  if (!verificationInterval) {
    scheduleNextVerification()
  }

  // Define answer-based checkpoints once quiz is loaded
  watch(
    () => quiz.value,
    (newQuiz) => {
      if (newQuiz) {
        const total = newQuiz.questions.length
        verificationCheckpoints.value = [0.25, 0.5, 0.75].map(p => Math.floor(total * p))
      }
    },
    { immediate: true }
  )

  // Watch answered progress
  watch(
    () => answeredQuestions.length,
    (newCount) => {
      if (verificationCheckpoints.value.includes(newCount) && !progressTriggered.value) {
        isVerifyingNow.value = true
        verified.value = false
        progressTriggered.value = true
        showCamera.state = true
        showFacialRecognition.value = true
        // reset after trigger
        setTimeout(() => {
          progressTriggered.value = false
        }, 10000)
      }
    }
  )

  console.log("verified value before watch  ", verified.value)
  // Watch verified state

watch(verified, (newVerified) => {
  if (!isVerifyingNow.value) return
  
  if (!newVerified) {
    closeModal()
    submitQuiz()
    // Only show alert if we're in quiz mode
    if (!showResults.value) {
      alert('Facial verification failed. Quiz has been submitted.')
    }
  } else {
    closeModal()
  }

  isVerifyingNow.value = false
})
}


const questionStatus = computed(
  () => `${currentQuestionIndex.value + 1}/${quiz.value.questions.length}`
)
const barPercentage = computed(
  () => `${(answeredQuestions.length / quiz.value.questions.length) * 100}%`
)

const onOptionSelected = ({ optionId }) => {
  const currentQuestion = quiz.value.questions[currentQuestionIndex.value]

  // Check if the current question has already been answered
  if (!answeredQuestions.includes(currentQuestionIndex.value)) {
    // Add the current question index to answered questions
    answeredQuestions.push(currentQuestionIndex.value)

    // Find the selected option from the current question's options
    const selectedOption = currentQuestion.options.find((option) => option.id === optionId)

    // Determine if the selected option is correct
    const isCorrect = selectedOption.text === currentQuestion.correctAnswer

    // Update the userAnswers object with the selected option details
    userAnswers[currentQuestionIndex.value] = {
      question: currentQuestion.text,
      selectedOption: selectedOption.text,
      isCorrect: isCorrect
    }

    // Update the selectedOptions array with the selected option ID
    selectedOptions[currentQuestionIndex.value] = optionId

    // Update the number of correct answers if the selected option is correct
    if (isCorrect) {
      numberOfCorrectAnswers.value++
    }
  } else {
    // If the question has already been answered, allow changing the selection
    // Remove the previous answer from userAnswers and selectedOptions
    delete userAnswers[currentQuestionIndex.value]
    selectedOptions[currentQuestionIndex.value] = null

    // Proceed with selecting the new option
    const selectedOption = currentQuestion.options.find((option) => option.id === optionId)
    const isCorrect = selectedOption.text === currentQuestion.correctAnswer

    userAnswers[currentQuestionIndex.value] = {
      question: currentQuestion.text,
      selectedOption: selectedOption.text,
      isCorrect: isCorrect
    }

    selectedOptions[currentQuestionIndex.value] = optionId

    // Update the number of correct answers if the selected option is correct
    if (isCorrect) {
      numberOfCorrectAnswers.value++
    }
  }

  // Move to the next question if not the last question
  if (currentQuestionIndex.value < quiz.value.questions.length - 1) {
    currentQuestionIndex.value++
  }
}

const submitQuiz = async () => {
  showResults.value = true
  clearInterval(timerInterval.value)
  showConfirmationModal.value = false

  // Initialize variables to store results
  let correctAnswersCount = 0
  const totalQuestions = quiz.value.questions.length
  const answeredQuestions = Object.keys(userAnswers).length

  // Calculate the number of correct answers
  Object.values(userAnswers).forEach((answer) => {
    if (answer.isCorrect) {
      correctAnswersCount++
    }
  })

  // Display results to the user
  numberOfCorrectAnswers.value = correctAnswersCount

  // Optionally, you can also store these results in a backend or Vuex store
  const quizResult = {
    quizId: quiz.value._id,
    date: new Date().toISOString(),
    quizName: quiz.value.name,
    timeTaken: timeTaken.time / 60,
    totalQuestions: totalQuestions,
    answeredQuestions: answeredQuestions,
    correctAnswers: correctAnswersCount,
    userId: store.getters.user._id
  }

  try {
    const response = await axiosInstance.post('/quiz/quiz-result', quizResult)
    console.log(response)
  } catch (error) {
    console.error('Error submitting quiz result:', error)
  }
}

const navigateToQuestion = (index) => {
  currentQuestionIndex.value = index
}

const restartQuiz = () => {
  currentQuestionIndex.value = 0
  Object.keys(userAnswers).forEach((key) => delete userAnswers[key])
  numberOfCorrectAnswers.value = 0
  answeredQuestions.length = 0
  showResults.value = false
  timeLeft.time = originalDuration.value // Reset to original duration
  timeTaken.time = 0
  selectedOptions.splice(
    0,
    selectedOptions.length,
    ...Array(quiz.value.questions.length).fill(null)
  )
}

const timerIntervalValue = { value: null }

const timerInterval = setInterval(() => {
    if (timeLeft.time > 0) {
        timeLeft.time--
        timeTaken.time++
        console.log(`Time left: ${timeLeft.time}`)
    } else {
        clearInterval(timerIntervalValue.value)
        timerIntervalValue.value = null
    }
}, 1000)

onMounted(async () => {
  const savedTime = localStorage.getItem('quizTimeLeft')
  if (savedTime) {
    timeLeft.time = parseInt(savedTime)
  }

  await fetchQuizzes()

  // Start verification checkpoints
  startVerificationChecks()

  if (!timerInterval && quiz.value && !showResults.value) {
    console.log('Initializing timer once.')
    timerInitialized.value = true

console.log('Attempting to initialize timer...')
console.log('timerInitialized:', timerInitialized.value)
console.log('quiz.value:', quiz.value)
console.log('showResults:', showResults.value)
console.log('timerInterval:', timerInterval)
  } else {
    console.log('Timer already initialized:', timerInterval)
  }
})




onBeforeUnmount(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
  if (verificationInterval) {
    clearTimeout(verificationInterval)
  }
  showCamera.state = false
  capturing.state = false
  localStorage.removeItem('quizTimeLeft')
})

</script>

<style scoped>
.bg-slate-800 {
  background-color: #2d3748;
}

.text-gray-300 {
  color: #e2e8f0;
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

.shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.rounded {
  border-radius: 0.25rem;
}
</style>
