<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <main role="main" class="min-h-screen grid place-items-center text-center p-6">
    <div>
      <p class="text-7xl font-extrabold text-indigo-600">404</p>
      <h1 class="mt-2 text-xl font-bold">Halaman tidak ditemukan</h1>
      <p class="text-sm text-slate-500 mt-1">Alamat yang kamu tuju tidak tersedia.</p>
      <RouterLink to="/" class="inline-block mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white">Kembali ke Beranda</RouterLink>
    </div>
  </main>
</template>
