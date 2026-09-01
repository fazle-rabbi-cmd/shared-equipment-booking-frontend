<template>
  <div class="min-h-screen bg-[#F7F7F5] pb-12">
    <AppHeader />

    <main class="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8">
      <!-- Stats -->
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <StatCard :icon="Package" label="Total equipment" :value="equipmentList.length" />
        <StatCard :icon="Clock" label="Pending approvals" :value="pendingApprovals" tone="amber" />
        <StatCard :icon="CheckCircle2" label="Active reservations" :value="activeReservations" tone="emerald" />
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        <!-- Add equipment -->
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 class="text-base font-semibold tracking-tight text-gray-900">Add new equipment</h2>
          <form @submit.prevent="handleAddEquipment" class="mt-4 space-y-4">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700">Name</label>
                <input v-model="newEquipment.name" type="text" required :class="inputClass" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700">Category</label>
                <input v-model="newEquipment.category" type="text" required :class="inputClass" />
              </div>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
              <textarea v-model="newEquipment.description" rows="2" :class="inputClass" />
            </div>
            <label class="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input v-model="newEquipment.requiresApproval" type="checkbox" class="rounded text-blue-600 focus:ring-blue-500" />
              Requires admin approval for booking
            </label>
            <p v-if="equipmentError" class="text-xs text-red-600">{{ equipmentError }}</p>
            <button
              type="submit"
              :disabled="addingEquipment"
              class="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Loader2 v-if="addingEquipment" :size="15" class="animate-spin" />
              <Plus v-else :size="15" />
              {{ addingEquipment ? 'Adding…' : 'Add equipment' }}
            </button>
          </form>
        </div>

        <!-- Equipment catalog -->
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 class="text-base font-semibold tracking-tight text-gray-900">Equipment catalog</h2>
          <div v-if="equipmentLoading" class="mt-4 space-y-2">
            <div v-for="n in 3" :key="n" class="h-14 animate-pulse rounded-lg bg-gray-100" />
          </div>
          <p v-else-if="equipmentList.length === 0" class="mt-4 text-sm text-gray-500">No equipment added yet.</p>
          <div v-else class="mt-4 max-h-80 space-y-2 overflow-y-auto">
            <div v-for="item in equipmentList" :key="item.id" class="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                <component :is="equipmentIcon(item.category)" :size="16" />
              </div>
              <div class="min-w-0 flex-1">
                <h4 class="truncate text-sm font-semibold text-gray-900">{{ item.name }}</h4>
                <p class="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500">
                  {{ item.category }}
                  <span class="inline-flex items-center gap-1" :class="item.isActive ? 'text-emerald-600' : 'text-gray-400'">
                    <span class="h-1.5 w-1.5 rounded-full" :class="item.isActive ? 'bg-emerald-500' : 'bg-gray-300'" />
                    {{ item.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </p>
              </div>
              <button
                @click="openEditModal(item)"
                class="inline-flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100"
              >
                <Pencil :size="13" /> Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Reservations -->
      <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 class="text-base font-semibold tracking-tight text-gray-900">All reservations</h2>

        <div v-if="reservationsLoading" class="mt-4 space-y-2">
          <div v-for="n in 3" :key="n" class="h-14 animate-pulse rounded-lg bg-gray-100" />
        </div>

        <p v-else-if="allReservations.length === 0" class="mt-4 text-sm text-gray-500">No reservations yet.</p>

        <template v-else>
          <!-- Desktop table -->
          <div class="mt-4 hidden overflow-x-auto md:block">
            <table class="w-full border-collapse text-left">
              <thead>
                <tr class="border-b border-gray-200 text-xs font-medium text-gray-500">
                  <th class="px-3 py-2">User</th>
                  <th class="px-3 py-2">Equipment</th>
                  <th class="px-3 py-2">Starts</th>
                  <th class="px-3 py-2">Ends</th>
                  <th class="px-3 py-2">Status</th>
                  <th class="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 text-sm">
                <tr v-for="res in allReservations" :key="res.id">
                  <td class="px-3 py-3 font-medium text-gray-900">{{ res.user?.name }}</td>
                  <td class="px-3 py-3 text-gray-600">{{ res.equipment?.name }}</td>
                  <td class="px-3 py-3 text-xs text-gray-500">{{ formatDateTime(res.startTime) }}</td>
                  <td class="px-3 py-3 text-xs text-gray-500">{{ formatDateTime(res.endTime) }}</td>
                  <td class="px-3 py-3"><StatusBadge :status="res.status" /></td>
                  <td class="px-3 py-3">
                    <div v-if="res.status === 'PENDING'" class="flex gap-2">
                      <button
                        @click="updateStatus(res.id, 'APPROVED')"
                        class="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
                      >
                        Approve
                      </button>
                      <button
                        @click="updateStatus(res.id, 'REJECTED')"
                        class="rounded-md bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                      >
                        Reject
                      </button>
                    </div>
                    <span v-else class="text-xs text-gray-300">—</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile cards -->
          <div class="mt-4 space-y-3 md:hidden">
            <div v-for="res in allReservations" :key="res.id" class="rounded-lg border border-gray-200 p-3">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <p class="text-sm font-semibold text-gray-900">{{ res.equipment?.name }}</p>
                  <p class="text-xs text-gray-500">{{ res.user?.name }}</p>
                </div>
                <StatusBadge :status="res.status" />
              </div>
              <p class="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                <Clock :size="12" /> {{ formatDateTime(res.startTime) }} – {{ formatDateTime(res.endTime) }}
              </p>
              <div v-if="res.status === 'PENDING'" class="mt-3 flex gap-2">
                <button
                  @click="updateStatus(res.id, 'APPROVED')"
                  class="flex-1 rounded-md bg-emerald-50 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
                >
                  Approve
                </button>
                <button
                  @click="updateStatus(res.id, 'REJECTED')"
                  class="flex-1 rounded-md bg-red-50 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </main>

    <!-- Edit equipment modal -->
    <Modal :open="showEditModal" title="Edit equipment" @close="showEditModal = false">
      <form @submit.prevent="handleUpdateEquipment" class="space-y-4">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700">Name</label>
          <input v-model="editForm.name" type="text" required :class="inputClass" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700">Category</label>
          <input v-model="editForm.category" type="text" required :class="inputClass" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
          <textarea v-model="editForm.description" rows="2" :class="inputClass" />
        </div>
        <label class="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input v-model="editForm.requiresApproval" type="checkbox" class="rounded text-blue-600 focus:ring-blue-500" />
          Requires admin approval
        </label>
        <label class="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input v-model="editForm.isActive" type="checkbox" class="rounded text-blue-600 focus:ring-blue-500" />
          Active (available for booking)
        </label>
        <p v-if="editError" class="text-xs text-red-600">{{ editError }}</p>
        <div class="flex gap-3 pt-1">
          <button
            type="button"
            @click="showEditModal = false"
            class="w-1/2 rounded-md bg-gray-100 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="savingEdit"
            class="inline-flex w-1/2 items-center justify-center gap-1.5 rounded-md bg-blue-600 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Loader2 v-if="savingEdit" :size="15" class="animate-spin" />
            {{ savingEdit ? 'Saving…' : 'Save changes' }}
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle2, Clock, Loader2, Package, Pencil, Plus } from 'lucide-vue-next';
import { computed, onMounted, ref } from 'vue';
import AppHeader from '../components/layout/AppHeader.vue';
import Modal from '../components/ui/Modal.vue';
import StatCard from '../components/ui/StatCard.vue';
import StatusBadge from '../components/ui/StatusBadge.vue';
import { useToast } from '../composables/useToast';
import { equipmentIcon } from '../lib/equipmentIcon';
import api from '../services/api';

interface EquipmentItem {
  id: number;
  name: string;
  category: string;
  description: string | null;
  requiresApproval: boolean;
  isActive: boolean;
}

interface Reservation {
  id: number;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  user?: { id: number; name: string };
  equipment?: { id: number; name: string };
}

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors';

const toast = useToast();

const allReservations = ref<Reservation[]>([]);
const equipmentList = ref<EquipmentItem[]>([]);
const equipmentLoading = ref(true);
const reservationsLoading = ref(true);

const pendingApprovals = computed(() => allReservations.value.filter((r) => r.status === 'PENDING').length);
const activeReservations = computed(() => allReservations.value.filter((r) => r.status === 'APPROVED').length);

const newEquipment = ref({ name: '', category: '', description: '', requiresApproval: false });
const equipmentError = ref('');
const addingEquipment = ref(false);

const showEditModal = ref(false);
const editForm = ref<{
  id: number | null;
  name: string;
  category: string;
  description: string;
  requiresApproval: boolean;
  isActive: boolean;
}>({ id: null, name: '', category: '', description: '', requiresApproval: false, isActive: true });
const editError = ref('');
const savingEdit = ref(false);

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

const fetchAllReservations = async () => {
  reservationsLoading.value = true;
  try {
    const res = await api.get('/reservations/admin/all');
    allReservations.value = res.data.data;
  } catch {
    toast.error('Failed to load reservations');
  } finally {
    reservationsLoading.value = false;
  }
};

const fetchEquipment = async () => {
  equipmentLoading.value = true;
  try {
    const res = await api.get('/equipment?all=true');
    equipmentList.value = res.data.data;
  } catch {
    toast.error('Failed to load equipment');
  } finally {
    equipmentLoading.value = false;
  }
};

const handleAddEquipment = async () => {
  equipmentError.value = '';
  addingEquipment.value = true;
  try {
    await api.post('/equipment', newEquipment.value);
    newEquipment.value = { name: '', category: '', description: '', requiresApproval: false };
    toast.success('Equipment added');
    fetchEquipment();
  } catch (err: any) {
    equipmentError.value = err.response?.data?.message || 'Failed to add equipment';
  } finally {
    addingEquipment.value = false;
  }
};

const openEditModal = (item: any) => {
  editForm.value = { 
    ...item, 
    description: item.description || '' 
  };
  editError.value = '';
  showEditModal.value = true;
};

const handleUpdateEquipment = async () => {
  editError.value = '';
  savingEdit.value = true;
  try {
    await api.patch(`/equipment/${editForm.value.id}`, {
      name: editForm.value.name,
      category: editForm.value.category,
      description: editForm.value.description,
      requiresApproval: editForm.value.requiresApproval,
      isActive: editForm.value.isActive,
    });
    showEditModal.value = false;
    toast.success('Equipment updated');
    fetchEquipment();
  } catch (err: any) {
    editError.value = err.response?.data?.message || 'Failed to update equipment';
  } finally {
    savingEdit.value = false;
  }
};

const updateStatus = async (id: number, status: 'APPROVED' | 'REJECTED') => {
  try {
    await api.patch(`/reservations/admin/${id}/status`, { status });
    toast.success(`Reservation ${status.toLowerCase()}`);
    fetchAllReservations();
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Failed to update reservation status');
  }
};

onMounted(() => {
  fetchAllReservations();
  fetchEquipment();
});
</script>