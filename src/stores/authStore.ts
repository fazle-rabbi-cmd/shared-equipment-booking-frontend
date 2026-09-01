import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../services/api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'EMPLOYEE' | 'ADMIN';
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'));
  const token = ref<string | null>(localStorage.getItem('token'));

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === 'ADMIN');

  async function login(credentials: { email: string; password: string }) {
    const response = await api.post('/auth/login', credentials);
    token.value = response.data.data.token;
    user.value = response.data.data.user;

    localStorage.setItem('token', token.value!);
    localStorage.setItem('user', JSON.stringify(user.value));
  }

  async function register(data: { name: string; email: string; password: string; role?: string }) {
    const response = await api.post('/auth/register', data);
    token.value = response.data.data.token;
    user.value = response.data.data.user;

    localStorage.setItem('token', token.value!);
    localStorage.setItem('user', JSON.stringify(user.value));
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  return { user, token, isAuthenticated, isAdmin, login, register, logout };
});