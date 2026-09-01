import { ref } from 'vue';

export interface ToastItem {
  id: number;
  message: string;
  type: 'success' | 'error';
}

const toasts = ref<ToastItem[]>([]);
let counter = 0;

function push(message: string, type: ToastItem['type']) {
  const id = ++counter;
  toasts.value.push({ id, message, type });
  setTimeout(() => remove(id), 3500);
}

function remove(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id);
}

export function useToast() {
  return {
    toasts,
    remove,
    success: (message: string) => push(message, 'success'),
    error: (message: string) => push(message, 'error'),
  };
}