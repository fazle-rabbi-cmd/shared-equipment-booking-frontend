<template>
  <header class="sticky top-0 z-30">
    <div class="bg-[#14161A]">
      <div class="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <div class="flex items-center gap-2">
          <div class="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600">
            <span class="text-xs font-bold text-white">E</span>
          </div>
          <div class="leading-none">
            <p class="text-sm font-semibold text-white">EquipBook</p>
            <p class="mt-0.5 hidden text-xs text-gray-400 sm:block">{{ isAdminPage ? 'Admin panel' : 'Dashboard' }}</p>
          </div>
        </div>

        <div class="flex items-center gap-1.5 sm:gap-2">
          <router-link
            v-if="isAdminPage || authStore.isAdmin"
            :to="isAdminPage ? '/' : '/admin'"
            class="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <component :is="isAdminPage ? LayoutGrid : ShieldCheck" :size="15" />
            <span class="hidden sm:inline">{{ isAdminPage ? 'Dashboard' : 'Admin panel' }}</span>
          </router-link>

          <button
            @click="handleLogout"
            class="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut :size="15" />
            <span class="hidden sm:inline">Log out</span>
          </button>

          <div
            class="ml-1 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white"
            :title="authStore.user?.name"
          >
            {{ initials }}
          </div>
        </div>
      </div>
    </div>
    <div class="h-0.5 bg-gradient-to-r from-blue-500 via-blue-400/50 to-transparent" />
  </header>
</template>

<script setup lang="ts">
import { LayoutGrid, LogOut, ShieldCheck } from 'lucide-vue-next';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const isAdminPage = computed(() => route.path === '/admin');

const initials = computed(() => {
  const name = authStore.user?.name || '';
  return (
    name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '?'
  );
});

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>