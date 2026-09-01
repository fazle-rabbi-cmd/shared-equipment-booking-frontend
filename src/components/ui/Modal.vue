<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="open" class="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
        <div class="fixed inset-0 bg-gray-900/50" @click="$emit('close')" />
        <div
          class="relative max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:max-w-md sm:rounded-xl"
          role="dialog"
          aria-modal="true"
          :aria-label="title"
        >
          <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h3 class="text-base font-semibold text-gray-900">{{ title }}</h3>
            <button
              @click="$emit('close')"
              class="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              aria-label="Close"
            >
              <X :size="18" />
            </button>
          </div>
          <div class="px-6 py-5">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { onMounted, onUnmounted } from 'vue';

const props = defineProps<{ open: boolean; title: string }>();
const emit = defineEmits<{ close: [] }>();

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open) emit('close');
}

onMounted(() => window.addEventListener('keydown', onKeydown));
onUnmounted(() => window.removeEventListener('keydown', onKeydown));
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>