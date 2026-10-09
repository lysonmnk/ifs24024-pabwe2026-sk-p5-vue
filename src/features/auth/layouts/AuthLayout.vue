<script setup>
import { RouterLink, RouterView } from "vue-router";
import { Gavel } from "lucide-vue-next";

const tab = "rounded-lg py-2 text-center text-sm font-semibold transition";
</script>

<template>
  <main role="main" class="min-h-screen grid place-items-center p-4 bg-gradient-to-br from-slate-50 to-indigo-50">
    <div class="w-full max-w-md">
      <header class="text-center mb-6">
        <div class="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-500 grid place-items-center text-white shadow-lg">
          <Gavel :size="28" />
        </div>
        <h1 class="text-3xl font-extrabold mt-3">Delcom Auction</h1>
        <p class="text-sm text-slate-500">Platform Lelang Online Modern</p>
      </header>
      <section class="bg-white rounded-3xl shadow-xl p-6">
        <nav class="grid grid-cols-2 gap-1 bg-slate-100 rounded-xl p-1 mb-5">
          <RouterLink to="/auth/login" :class="tab" active-class="bg-white text-indigo-600 shadow" data-testid="tab-login">Masuk Akun</RouterLink>
          <RouterLink to="/auth/register" :class="tab" active-class="bg-white text-indigo-600 shadow" data-testid="tab-register">Daftar Baru</RouterLink>
        </nav>
        <RouterView />
      </section>
    </div>
  </main>
</template>
