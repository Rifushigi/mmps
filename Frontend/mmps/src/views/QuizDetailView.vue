<!-- src/views/QuizDetailView.vue -->
<template>
  <div
    class="bg-slate-800 flex flex-col justify-start items-center pb-10 h-dvh overflow-y-auto w-screen"
  >
    <AdminHeader />
    <div class="flex flex-col items-center h-full w-full">
      <h1 class="text-3xl font-bold text-gray-300 mb-8 mt-4">Quiz Details</h1>

      <button
        @click="goBack"
        class="self-start bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded ml-32"
      >
        Back
      </button>

      <div class="flex w-full mt-8 px-32 max-h-500px">
        <QuizDetailMenu />
        <QuizDetailContent />
      </div>
    </div>
  </div>
</template>

<script setup>
import AdminHeader from '@/components/AdminHeader.vue'
import QuizDetailMenu from '@/components/QuizDetailMenu.vue'
import QuizDetailContent from '@/components/QuizDetailContent.vue'
import { currentTabState, view } from '@/global_state/state'
import { onMounted } from 'vue'
import router from '@/router'

onMounted(() => (view.value = 'admin'))

const goBack = () => {
  router.go(-1)
  currentTabState.value = 'details'
}
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
