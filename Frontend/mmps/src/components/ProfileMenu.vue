<!-- src/components/ProfileMenu.vue -->
<template>
  <div class="w-full h-full bg-white text-gray-800 p-6 rounded-l-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4">Account Settings</h2>
    <ul class="space-y-4">
      <li>
        <button
          @click="selectOption('profile')"
          :class="{ 'active-link': selectedOption === 'profile' }"
          class="w-full text-left p-2 rounded nav-link"
        >
          Profile
        </button>
      </li>
      <li>
        <button
          @click="selectOption('forgot-password')"
          :class="{ 'active-link': selectedOption === 'forgot-password' }"
          class="w-full text-left p-2 rounded nav-link"
        >
          Forgot Password
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['optionSelected'])
const selectedOption = ref('profile')

const selectOption = (option) => {
  selectedOption.value = option
  emit('optionSelected', option)
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

.text-gray-300 {
  color: #d1d5db;
}

.text-white {
  color: #ffffff;
}

.nav-link {
  position: relative;
  @apply text-gray-700 text-lg hover:text-blue-500 px-4 py-2 rounded-full transition-all duration-200;
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
  width: 100%;
  background-color: #3182ce;
}

.shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
