<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 antialiased">
    <router-view />
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
// Root layout wrapper
import ToastContainer from './components/ui/ToastContainer.vue';
</script>