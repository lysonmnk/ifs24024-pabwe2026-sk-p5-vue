<script setup>
import { onMounted } from "vue";
import { useUsersStore } from "../states/usersStore.js";

const store = useUsersStore();
onMounted(() => store.fetchUsers());
</script>

<template>
  <section>
    <h1 class="text-2xl font-extrabold mb-4">Daftar Pengguna</h1>
    <p v-if="store.isUsers" class="text-slate-500">Memuat pengguna...</p>
    <p v-else-if="!store.users.length" class="text-slate-500">Belum ada pengguna.</p>
    <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="u in store.users" :key="u.id" class="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
        <img v-if="u.photo" :src="u.photo" :alt="u.name" class="h-11 w-11 rounded-full object-cover" />
        <span v-else class="grid h-11 w-11 place-items-center rounded-full bg-indigo-100 font-bold text-indigo-600">{{ (u.name || "?").charAt(0).toUpperCase() }}</span>
        <div class="min-w-0">
          <p class="truncate font-semibold">{{ u.name }}</p>
          <p class="truncate text-xs text-slate-500">{{ u.email }}</p>
        </div>
      </li>
    </ul>
  </section>
</template>
