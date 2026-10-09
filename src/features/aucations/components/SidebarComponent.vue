<script setup>
import { RouterLink } from "vue-router";
import { Gavel, LayoutDashboard, UserCircle, Users, X } from "lucide-vue-next";

defineProps({ open: { type: Boolean, default: false } });
defineEmits(["close"]);
const items = [
  { to: "/", label: "Dashboard Lelang", icon: LayoutDashboard },
  { to: "/?mine=1", label: "Lelang Saya", icon: Gavel },
  { to: "/users", label: "Daftar Pengguna", icon: Users },
  { to: "/profile", label: "Profil Saya", icon: UserCircle },
];
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-40 bg-black/40 lg:hidden" data-testid="sidebar-backdrop" @click="$emit('close')" />
  <aside :class="['fixed top-0 left-0 z-50 h-full w-64 bg-white p-4 shadow-lg transition-transform lg:sticky lg:top-16 lg:z-10 lg:h-[calc(100vh-4rem)] lg:translate-x-0 lg:shadow-none lg:border-r lg:border-slate-200', open ? 'translate-x-0' : '-translate-x-full']">
    <button class="mb-3 lg:hidden" aria-label="Tutup" data-testid="btn-close" @click="$emit('close')"><X :size="20" /></button>
    <nav class="space-y-1">
      <RouterLink v-for="i in items" :key="i.label" :to="i.to" class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600" @click="$emit('close')">
        <component :is="i.icon" :size="18" /> {{ i.label }}
      </RouterLink>
    </nav>
  </aside>
</template>
