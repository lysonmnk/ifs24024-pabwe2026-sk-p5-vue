<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { LogOut, Menu } from "lucide-vue-next";
import { useUsersStore } from "../../users/states/usersStore.js";
import { useAuthStore } from "../../auth/states/authStore.js";
import { showConfirmDialog } from "../../../helpers/toolsHelper.js";

defineEmits(["toggle-sidebar"]);
const router = useRouter();
const users = useUsersStore();
const auth = useAuthStore();
const displayName = computed(() => users.profile?.name || users.profile?.email || "Pengguna");

async function logout() {
  if (await showConfirmDialog("Yakin ingin keluar?")) {
    auth.logout();
    router.replace("/auth/login");
  }
}
</script>

<template>
  <header class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4">
    <div class="flex items-center gap-3">
      <button class="lg:hidden" aria-label="Menu" data-testid="btn-menu" @click="$emit('toggle-sidebar')"><Menu :size="22" /></button>
      <span class="font-extrabold text-indigo-600">Delcom Auction</span>
    </div>
    <div class="flex items-center gap-3">
      <img v-if="users.profile?.photo" :src="users.profile.photo" alt="foto" class="h-9 w-9 rounded-full object-cover" />
      <span v-else class="grid h-9 w-9 place-items-center rounded-full bg-indigo-100 font-bold text-indigo-600" data-testid="avatar">{{ displayName.charAt(0).toUpperCase() }}</span>
      <span class="hidden text-sm font-semibold sm:block" data-testid="display-name">{{ displayName }}</span>
      <button class="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Keluar" data-testid="btn-logout" @click="logout"><LogOut :size="18" /></button>
    </div>
  </header>
</template>
