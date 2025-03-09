<template>
  <div
    class="bg-gray-100 flex flex-col justify-start items-center pb-10 h-dvh w-screen overflow-y-auto"
  >
    <AdminHeader />
    <div class="flex flex-col items-center h-full w-full">
      <h1 class="text-3xl font-bold text-gray-800 mt-4 mb-8">User Management</h1>

      <!-- Search Input -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by name"
        class="mb-4 p-2 rounded bg-white text-gray-800 border border-gray-300 w-1/4 focus:ring-blue-500 focus:border-blue-500"
      />

      <div class="flex-grow w-full mt-8 px-14">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <UserCard
            v-for="user in filteredUsers"
            :key="user.id"
            :user="user"
            @userSelected="onSelectUser"
            class="bg-white shadow-md rounded p-4 transition-transform transform hover:translate-y-[-4px]"
          />
        </div>
      </div>

      <UserModal
        :show="showModal"
        :user="selectedUser"
        @actionConfirmed="handleActionConfirmed"
        @close="closeModal"
      />

      <p v-if="filteredUsers.length === 0" class="text-gray-600 mt-4">No users available.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import AdminHeader from '@/components/AdminHeader.vue'
import UserCard from '@/components/UserCard.vue'
import UserModal from '@/components/UserModal.vue'
import { axiosInstance } from '@/axiosConfig'
import { useStore } from 'vuex'

const store = useStore()
const token = computed(() => store.getters.token)
axiosInstance.interceptors.request.use(
  (config) => {
    if (token.value) {
      config.headers.Authorization = `Bearer ${token.value}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

const users = ref([])
const showModal = ref(false)
const selectedUser = ref(null)
const searchQuery = ref('') // Add search query

const fetchUsers = async () => {
  try {
    const response = await axiosInstance.get('/user/all')
    console.log(response)
    users.value = response.data.data
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

onMounted(fetchUsers)

const onSelectUser = (user) => {
  selectedUser.value = user
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const handleActionConfirmed = () => {
  showModal.value = false
  // Perform actions based on user selection
}

// Computed property to filter users based on search query and exclude admins
const filteredUsers = computed(() => {
  return users.value.filter(
    (user) => !user.isAdmin && user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
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

.focus\:ring-blue-500:focus {
  box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.5);
}

.focus\:border-blue-500:focus {
  border-color: #3182ce;
}

.shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.rounded {
  border-radius: 0.25rem;
}

.grid {
  display: grid;
  gap: 1rem;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.sm\:grid-cols-2 {
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.lg\:grid-cols-3 {
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
