<!-- src/views/UserDetailView.vue -->
<template>
  <div
    class="bg-gray-100 flex flex-col justify-start items-center pb-10 h-dvh overflow-y-auto w-screen"
  >
    <AdminHeader />
    <div class="flex flex-col items-center h-full w-full">
      <h1 class="text-3xl font-bold text-gray-800 mb-8 mt-4">User Details</h1>

      <button
        @click="goBack"
        class="self-start bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded ml-32"
      >
        Back
      </button>

      <div class="flex w-full mt-8 px-32 max-h-500px">
        <!-- Left Menu or Navigation -->
        <div class="min-w-[200px] w-[500px] lg:w-1/3 mr-4 h-60 bg-white rounded-l-lg p-4 shadow-md">
          <h2 class="text-2xl text-gray-800 my-2 mx-2 font-bold mb-4">User Details</h2>
          <ul>
            <li
              @click="currentTab = 'details'"
              :class="{ 'active-link': currentTab === 'details' }"
              class="w-full text-left p-2 rounded nav-link cursor-pointer"
            >
              User Details
            </li>
            <li
              @click="currentTab = 'update'"
              :class="{ 'active-link': currentTab === 'update' }"
              class="w-full text-left p-2 rounded nav-link cursor-pointer"
            >
              Update User
            </li>
            <li
              @click="currentTab = 'delete'"
              :class="{ 'active-link': currentTab === 'delete' }"
              class="w-full text-left p-2 rounded nav-link cursor-pointer"
            >
              Delete User
            </li>
          </ul>
        </div>

        <!-- Right Content Section -->
        <div
          class="min-w-fit w-[600px] max-h-[60dvh] lg:w-1/2 p-4 bg-white shadow-md rounded-r-lg overflow-y-auto"
        >
          <div v-if="currentTab === 'details'" class="text-gray-800 p-5 h-full w-full">
            <h2 class="text-2xl font-bold mb-3">{{ user.name }}</h2>
            <h3 class="text-xl mb-4 text-gray-600">Scores of Previous Quizzes</h3>
            <div class="overflow-x-auto">
              <table
                class="w-full mb-4 bg-gray-100 rounded-lg overflow-y-auto table-auto border-2 border-gray-300"
              >
                <thead class="bg-gray-200 border-b-2 border-gray-300">
                  <tr>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider border-2 border-gray-300"
                    >
                      Quiz Name
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider border-2 border-gray-300"
                    >
                      Score
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider border-2 border-gray-300"
                    >
                      Obtainable Score
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider border-2 border-gray-300"
                    >
                      Date
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider border-2 border-gray-300"
                    >
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y-2 divide-gray-200">
                  <tr
                    v-for="quiz in user.quizzes"
                    :key="quiz.date"
                    class="hover:bg-gray-300 bg-gray-200 border-2 border-gray-300"
                  >
                    <td class="px-4 py-3 whitespace-nowrap text-gray-800 border-2 border-gray-300">
                      {{ quiz.quizName }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-800 border-2 border-gray-300">
                      {{ quiz.correctAnswers }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-800 border-2 border-gray-300">
                      {{ quiz.totalQuestions }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-800 border-2 border-gray-300">
                      {{ formatDate(quiz.date) }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-800 border-2 border-gray-300">
                      {{ formatTime(quiz.date) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div v-else-if="currentTab === 'update'" class="text-gray-600">
            <h2 class="text-3xl font-bold mb-6 text-gray-800">Update User</h2>
            <form @submit.prevent="updateUser">
              <div class="mb-4">
                <label class="block text-gray-700 font-semibold mb-2">Name:</label>
                <input
                  v-model="user.name"
                  type="text"
                  class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div class="mb-4">
                <label class="block text-gray-700 font-semibold mb-2">Email:</label>
                <input
                  v-model="user.email"
                  type="text"
                  class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </form>
          </div>

          <div v-else-if="currentTab === 'delete'">
            <h2 class="text-3xl font-bold mb-6 text-gray-800">Delete User</h2>
            <p class="text-gray-600 mb-4">Are you sure you want to delete this user?</p>
            <button
              @click="deleteUser"
              class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminHeader from '@/components/AdminHeader.vue'
import { useRoute } from 'vue-router'
import { currentTabState, view } from '@/global_state/state'
import { axiosInstance } from '@/axiosConfig' // Adjust the path as needed
import router from '@/router'

const route = useRoute()
const userId = ref(route.params.id)
const currentTab = ref('details')

const user = ref({
  id: '',
  name: '',
  email: '',
  quizzes: []
})

const goBack = () => {
  router.go(-1)
  currentTabState.value = 'details'
}

// Fetch user data based on userId
const fetchUserData = async (id) => {
  try {
    const response = await axiosInstance.get(`/user/${id}`)
    const { _id, ...rest } = response.data.data
    user.value = { id: _id, ...rest }
    console.log(user.value.id)
  } catch (error) {
    console.error('Error fetching user data:', error)
  }
}

const fetchUserQuizData = async (id) => {
  const response = await axiosInstance.get(`/quiz/user/${id}`)
  user.value.quizzes = response.data.data
}

onMounted(() => {
  fetchUserData(userId.value)
  fetchUserQuizData(userId.value)
  view.value = 'admin'
})

const updateUser = async () => {
  try {
    console.log(user.value)
    await axiosInstance.patch(`/user/${user.value.id}`, {
      ...user.value,
      id: undefined,
      _id: undefined,
      quizzes: undefined,
      name: user.value.name,
      email: user.value.email,
      isAdmin: undefined
    })
    console.log('User updated successfully')
    alert('User updated successfully')
  } catch (error) {
    console.error('Error updating user:', error)
  }
}

const deleteUser = async () => {
  try {
    console.log(user.value.id)
    await axiosInstance.delete(`/user/${user.value.id}`)
    console.log('User deleted successfully')
    alert('User deleted successfully')
  } catch (error) {
    console.error('Error deleting user:', error)
  }
}

// Function to format date and time
const formatDate = (dateString) => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const formatTime = (dateString) => {
  const options = { hour: '2-digit', minute: '2-digit' }
  return new Date(dateString).toLocaleTimeString('en-UK', options)
}
</script>

<style scoped>
.nav-link {
  position: relative;
  @apply text-gray-800 text-lg hover:text-blue-500 px-4 py-2 rounded-full transition-all duration-200;
}

.nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 0px;
  height: 4px;
  background-color: #3182ce;
  transition: width 0.3s ease-in-out;
}

.nav-link:hover::after {
  width: 100%;
}

.active-link::after {
  width: 65%;
  background-color: #3182ce;
}

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

.shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.rounded-l-lg {
  border-radius: 0.5rem 0 0 0.5rem;
}

.rounded-r-lg {
  border-radius: 0 0.5rem 0.5rem 0;
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

.bg-red-500 {
  background-color: #e53e3e;
}

.bg-red-700 {
  background-color: #c53030;
}
</style>
