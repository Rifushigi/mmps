<template>
  <div
    class="bg-gray-100 flex flex-col justify-start items-center pb-10 h-dvh w-screen overflow-y-auto"
  >
    <AdminHeader />
    <div class="flex flex-col items-center h-full w-full">
      <h1 class="text-3xl font-bold text-gray-800 mt-4 mb-8">Statistics</h1>

      <div class="flex-grow w-3/4 mt-8 px-14">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          <StatisticCard
            v-for="stat in statistics"
            :key="stat.id"
            :stat="stat"
            class="bg-white shadow-md rounded-lg p-4 transition-transform transform hover:translate-y-[-4px]"
          />
        </div>
      </div>

      <p v-if="statistics.length === 0" class="text-gray-600 mt-4">No statistics available.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminHeader from '@/components/AdminHeader.vue'
import StatisticCard from '@/components/StatisticCard.vue'
import { axiosInstance } from '@/axiosConfig'

const statistics = ref([])

const fetchStatistics = async () => {
  try {
    const [userResponse, quizResponse] = await Promise.all([
      axiosInstance.get('/user/total'),
      axiosInstance.get('/quiz/total')
    ])

    const userCount = userResponse.data.data
    const quizCount = quizResponse.data.data.totalQuizzes
    console.log('quiz count', quizCount)

    statistics.value = [
      { id: 1, title: 'Total Users', value: userCount },
      { id: 2, title: 'Total Quizzes', value: quizCount }
    ]
  } catch (error) {
    console.error('Failed to fetch statistics:', error)
  }
}

onMounted(fetchStatistics)
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

.shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.rounded-lg {
  border-radius: 0.5rem;
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
