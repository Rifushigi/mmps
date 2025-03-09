<!-- src/components/ForgotPassword.vue -->
<template>
  <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
    <h2 class="text-3xl font-bold mb-6 text-gray-800">Forgot Password</h2>
    <div class="space-y-6">
      <div>
        <label class="block text-gray-700 font-semibold mb-2">Email:</label>
        <input
          v-model="email"
          type="email"
          class="w-full p-2 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        @click="sendResetLink"
        class="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Send Reset Link
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')

const sendResetLink = () => {
  // Simulate sending a reset link
  alert(`Reset link sent to ${email.value}`)
}
</script>

<style scoped>
.bg-white {
  background-color: #ffffff;
}

.text-gray-800 {
  color: #2d3748;
}

.text-gray-700 {
  color: #4a5568;
}

.text-gray-900 {
  color: #1a202c;
}

.bg-blue-500 {
  background-color: #3182ce;
}

.bg-blue-700 {
  background-color: #2b6cb0;
}

.border-gray-300 {
  border-color: #d1d5db;
}

.focus\:ring-2:focus {
  box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.5);
}

.shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
