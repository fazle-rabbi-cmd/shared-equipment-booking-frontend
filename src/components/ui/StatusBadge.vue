<template>
  <span
    :class="['inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset', styleFor(status)]"
  >
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' }>();

const styles: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  APPROVED: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  REJECTED: 'bg-red-50 text-red-700 ring-red-600/20',
  CANCELLED: 'bg-gray-100 text-gray-600 ring-gray-500/20',
};

function styleFor(status: string) {
  return styles[status] || styles.CANCELLED;
}

const label = computed(() => props.status.charAt(0) + props.status.slice(1).toLowerCase());
</script>