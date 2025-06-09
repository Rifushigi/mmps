<template>
  <div class="w-full bg-white shadow-md z-10 p-4">
    <div class="flex items-center justify-between">
      <h4 class="text-xl font-semibold text-gray-800">Question {{ questionStatus }}</h4>
      <div class="timer">
        <span class="text-lg text-gray-600">Time Left: {{ formatTimeTaken(timeLeft.time) }}</span>
      </div>
      <div class="bar w-64 h-6 bg-gray-200 rounded-full">
        <div
          class="completion h-full bg-blue-500 rounded-full"
          :style="{ width: barPercentage }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { timeLeft } from '@/global_state/state'

defineProps(['questionStatus', 'barPercentage'])


function formatTimeTaken(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m : ${remainingSeconds.toString().padStart(2, '0')}s`
}
</script>

<style scoped>
.timer {
  top: 10px;
  right: 10px;
  padding: 10px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.bg-white {
  background-color: #ffffff;
}

.text-gray-800 {
  color: #2d3748;
}

.text-gray-600 {
  color: #718096;
}

.bg-gray-200 {
  background-color: #edf2f7;
}

.bg-blue-500 {
  background-color: #3182ce;
}

.shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
