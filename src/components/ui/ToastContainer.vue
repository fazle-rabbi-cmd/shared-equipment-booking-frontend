<template>
  <Teleport to="body">
    <div class="fixed inset-x-4 bottom-4 z-50 flex flex-col gap-2 sm:inset-x-auto sm:right-4 sm:w-80">
      <TransitionGroup name="toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="flex items-start gap-2.5 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg"
        >
          <component
            :is="t.type === 'success' ? CheckCircle2 : XCircle"
            :size="18"
            :class="t.type === 'success' ? 'text-emerald-500' : 'text-red-500'"
            class="mt-0.5 shrink-0"
          />
          <p class="flex-1 text-sm text-gray-700">{{ t.message }}</p>
          <button @click="remove(t.id)" class="text-gray-300 hover:text-gray-500" aria-label="Dismiss">
            <X :size="14" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { CheckCircle2, X, XCircle } from 'lucide-vue-next';
import { useToast } from '../../composables/useToast';

const { toasts, remove } = useToast();
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(8px);
}
</style>