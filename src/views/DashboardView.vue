<template>
  <div class="min-h-screen bg-[#F7F7F5] pb-12">
    <AppHeader />

    <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <!-- Stats -->
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <StatCard :icon="Package" label="Available equipment" :value="equipmentList.length" />
        <StatCard :icon="CalendarCheck2" label="Active reservations" :value="activeCount" tone="emerald" />
        <StatCard :icon="Clock" label="Pending approval" :value="pendingCount" tone="amber" />
      </div>

      <div class="mt-6 flex flex-col gap-6 lg:mt-8 lg:flex-row lg:gap-8">
        <!-- Equipment catalog -->
        <section class="space-y-4 lg:w-2/3">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 class="text-base font-semibold tracking-tight text-gray-900">Available equipment</h2>
            
            <div class="flex flex-col sm:flex-row gap-2">
              <!-- Category Filter Dropdown -->
              <select
                v-model="selectedCategory"
                class="rounded-md border border-gray-300 bg-white py-2 px-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">All Categories</option>
                <option v-for="cat in availableCategories" :key="cat" :value="cat">
                  {{ cat }}
                </option>
              </select>

              <!-- Search Input -->
              <div class="relative sm:w-64">
                <Search :size="15" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search equipment…"
                  class="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="equipmentLoading" class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div v-for="n in 4" :key="n" class="h-44 animate-pulse rounded-xl bg-gray-100" />
          </div>

          <!-- Empty -->
          <div
            v-else-if="equipmentList.length === 0"
            class="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-14 text-center"
          >
            <PackageSearch :size="28" class="text-gray-300" />
            <p class="mt-3 text-sm font-medium text-gray-700">No equipment found</p>
            <p class="mt-1 text-xs text-gray-500">Try a different search term or category.</p>
          </div>

          <!-- Grid -->
          <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div
              v-for="item in equipmentList"
              :key="item.id"
              class="flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
            >
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <component :is="equipmentIcon(item.category)" :size="19" />
                </div>
                <div class="min-w-0">
                  <p class="truncate text-xs font-medium text-gray-500">{{ item.category }}</p>
                  <h3 class="truncate text-sm font-semibold text-gray-900">{{ item.name }}</h3>
                </div>
              </div>

              <p class="mt-3 flex-1 text-xs leading-relaxed text-gray-500 line-clamp-2">
                {{ item.description || 'No description provided.' }}
              </p>

              <p
                v-if="item.requiresApproval"
                class="mt-2.5 inline-flex w-fit items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700"
              >
                <ShieldAlert :size="12" /> Needs approval
              </p>

              <button
                @click="openBookingModal(item)"
                class="mt-3 inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm shadow-blue-600/20 transition-colors hover:bg-blue-700"
              >
                Book equipment
              </button>
            </div>
          </div>
        </section>

        <!-- My reservations -->
        <section class="space-y-4 lg:w-1/3">
          <h2 class="text-base font-semibold tracking-tight text-gray-900">My reservations</h2>

          <div v-if="reservationsLoading" class="space-y-3">
            <div v-for="n in 3" :key="n" class="h-24 animate-pulse rounded-xl bg-gray-100" />
          </div>

          <div
            v-else-if="myReservations.length === 0"
            class="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-10 text-center"
          >
            <CalendarX2 :size="24" class="text-gray-300" />
            <p class="mt-2 text-sm font-medium text-gray-700">No reservations yet</p>
            <p class="mt-1 text-xs text-gray-500">Book equipment to see it here.</p>
          </div>

          <div v-else class="space-y-3">
            <div v-for="res in myReservations" :key="res.id" class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div class="flex items-start justify-between gap-2">
                <h4 class="text-sm font-semibold text-gray-900">{{ res.equipment?.name }}</h4>
                <StatusBadge :status="res.status" />
              </div>
              <p class="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                <Clock :size="12" /> {{ formatDateTime(res.startTime) }} – {{ formatDateTime(res.endTime) }}
              </p>
              <button
                v-if="res.status === 'PENDING' || res.status === 'APPROVED'"
                @click="cancelTarget = res"
                class="mt-3 text-xs font-medium text-red-600 hover:underline"
              >
                Cancel reservation
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- Booking modal -->
    <Modal :open="showModal" :title="`Book: ${selectedEquipment?.name ?? ''}`" @close="showModal = false">
      <form @submit.prevent="submitBooking" class="space-y-4">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700">Start time</label>
          <input
            v-model="bookingForm.startTime"
            type="datetime-local"
            required
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700">End time</label>
          <input
            v-model="bookingForm.endTime"
            type="datetime-local"
            required
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <p v-if="modalError" class="text-xs text-red-600">{{ modalError }}</p>
        <div class="flex gap-3 pt-1">
          <button
            type="button"
            @click="showModal = false"
            class="w-1/2 rounded-md bg-gray-100 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="inline-flex w-1/2 items-center justify-center gap-1.5 rounded-md bg-blue-600 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Loader2 v-if="submitting" :size="15" class="animate-spin" />
            {{ submitting ? 'Booking…' : 'Confirm' }}
          </button>
        </div>
      </form>
    </Modal>

    <!-- Cancel confirmation -->
    <Modal :open="!!cancelTarget" title="Cancel reservation" @close="cancelTarget = null">
      <p class="text-sm text-gray-600">
        Cancel your reservation for <strong>{{ cancelTarget?.equipment?.name }}</strong>? This can't be undone.
      </p>
      <div class="mt-5 flex gap-3">
        <button
          @click="cancelTarget = null"
          class="w-1/2 rounded-md bg-gray-100 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
        >
          Keep it
        </button>
        <button
          @click="confirmCancel"
          :disabled="cancelling"
          class="inline-flex w-1/2 items-center justify-center gap-1.5 rounded-md bg-red-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Loader2 v-if="cancelling" :size="15" class="animate-spin" />
          {{ cancelling ? 'Cancelling…' : 'Cancel reservation' }}
        </button>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { CalendarCheck2, CalendarX2, Clock, Loader2, Package, PackageSearch, Search, ShieldAlert } from 'lucide-vue-next';
import { computed, onMounted, ref, watch } from 'vue';
import AppHeader from '../components/layout/AppHeader.vue';
import Modal from '../components/ui/Modal.vue';
import StatCard from '../components/ui/StatCard.vue';
import StatusBadge from '../components/ui/StatusBadge.vue';
import { useToast } from '../composables/useToast';
import { equipmentIcon } from '../lib/equipmentIcon';
import api from '../services/api';

interface Equipment {
  id: number;
  name: string;
  category: string;
  description: string | null;
  requiresApproval: boolean;
}

interface Reservation {
  id: number;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  equipment?: { id: number; name: string };
}

const toast = useToast();

const equipmentList = ref<Equipment[]>([]);
const allCategories = ref<string[]>([]);
const myReservations = ref<Reservation[]>([]);
const searchQuery = ref('');
const selectedCategory = ref('');
const equipmentLoading = ref(true);
const reservationsLoading = ref(true);

const availableCategories = computed(() => allCategories.value);

const activeCount = computed(() => myReservations.value.filter((r) => r.status === 'APPROVED').length);
const pendingCount = computed(() => myReservations.value.filter((r) => r.status === 'PENDING').length);

const showModal = ref(false);
const selectedEquipment = ref<Equipment | null>(null);
const bookingForm = ref({ startTime: '', endTime: '' });
const modalError = ref('');
const submitting = ref(false);

const cancelTarget = ref<Reservation | null>(null);
const cancelling = ref(false);

let debounceTimer: ReturnType<typeof setTimeout>;
watch(searchQuery, () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(fetchEquipment, 300);
});

watch(selectedCategory, () => {
  fetchEquipment();
});

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

const fetchCategories = async () => {
  try {
    const res = await api.get('/equipment');
    const categories = res.data.data.map((item: Equipment) => item.category);
    allCategories.value = Array.from(new Set(categories));
  } catch (err) {
    console.error('Failed to load categories');
  }
};

const fetchEquipment = async () => {
  equipmentLoading.value = true;
  try {
    let url = `/equipment?search=${encodeURIComponent(searchQuery.value)}`;
    if (selectedCategory.value) {
      url += `&category=${encodeURIComponent(selectedCategory.value)}`;
    }
    const res = await api.get(url);
    equipmentList.value = res.data.data;
  } catch {
    toast.error('Failed to load equipment');
  } finally {
    equipmentLoading.value = false;
  }
};

const fetchMyReservations = async () => {
  reservationsLoading.value = true;
  try {
    const res = await api.get('/reservations/me');
    myReservations.value = res.data.data;
  } catch {
    toast.error('Failed to load reservations');
  } finally {
    reservationsLoading.value = false;
  }
};

const openBookingModal = (item: Equipment) => {
  selectedEquipment.value = item;
  bookingForm.value = { startTime: '', endTime: '' };
  modalError.value = '';
  showModal.value = true;
};

const submitBooking = async () => {
  modalError.value = '';
  if (new Date(bookingForm.value.endTime) <= new Date(bookingForm.value.startTime)) {
    modalError.value = 'End time must be after start time';
    return;
  }
  submitting.value = true;
  try {
    await api.post('/reservations', {
      equipmentId: selectedEquipment.value!.id,
      startTime: new Date(bookingForm.value.startTime).toISOString(),
      endTime: new Date(bookingForm.value.endTime).toISOString(),
    });
    showModal.value = false;
    toast.success('Reservation submitted');
    fetchMyReservations();
  } catch (err: any) {
    modalError.value = err.response?.data?.message || 'Failed to book equipment';
  } finally {
    submitting.value = false;
  }
};

const confirmCancel = async () => {
  if (!cancelTarget.value) return;
  cancelling.value = true;
  try {
    await api.patch(`/reservations/${cancelTarget.value.id}/cancel`);
    toast.success('Reservation cancelled');
    cancelTarget.value = null;
    fetchMyReservations();
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Failed to cancel reservation');
  } finally {
    cancelling.value = false;
  }
};

onMounted(() => {
  fetchEquipment();
  fetchCategories();
  fetchMyReservations();
});
</script>