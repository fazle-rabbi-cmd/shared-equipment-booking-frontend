<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="w-full max-w-sm">
      <!-- Brand -->
      <div class="flex items-center justify-center gap-2 mb-8">
        <div class="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center">
          <span class="text-white font-semibold text-sm">E</span>
        </div>
        <span class="text-base font-semibold text-gray-900">EquipBook</span>
      </div>

      <div class="bg-white border border-gray-200 rounded-lg p-8">
        <h1 class="text-lg font-semibold text-gray-900 mb-1">Sign in</h1>
        <p class="text-sm text-gray-500 mb-6">Use your company account to access the booking system.</p>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
            <input
              v-model="email"
              type="email"
              required
              autocomplete="email"
              placeholder="you@company.com"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input
              v-model="password"
              type="password"
              required
              autocomplete="current-password"
              placeholder="••••••••"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
          </div>

          <div v-if="errorMessage" class="px-3 py-2 bg-red-50 border border-red-200 rounded-md">
            <p class="text-sm text-red-700">{{ errorMessage }}</p>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Signing in…' : 'Sign in' }}
          </button>
        </form>
      </div>

      <p class="text-sm text-center text-gray-500 mt-6">
        Don't have an account?
        <router-link to="/register" class="text-blue-600 font-medium hover:text-blue-700">Register</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const loading = ref(false);

const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    await authStore.login({ email: email.value, password: password.value });
    router.push('/');
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || 'Failed to login';
  } finally {
    loading.value = false;
  }
};
</script>