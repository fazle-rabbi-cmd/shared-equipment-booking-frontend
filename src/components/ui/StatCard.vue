<template>
  <div class="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
    <div :class="['flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', tones[tone].bg, tones[tone].text]">
      <component :is="icon" :size="18" />
    </div>
    <div class="min-w-0">
      <p class="truncate text-xs text-gray-500">{{ label }}</p>
      <p class="text-lg font-semibold leading-tight tracking-tight text-gray-900">{{ value }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';

withDefaults(defineProps<{ icon: Component; label: string; value: string | number; tone?: 'blue' | 'amber' | 'emerald' }>(), {
  tone: 'blue',
});

const tones = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
};
</script>