<script setup>
import { onMounted, ref } from "vue";
import { RouterView, useRouter } from "vue-router";
import NavbarComponent from "../components/NavbarComponent.vue";
import SidebarComponent from "../components/SidebarComponent.vue";
import { useUsersStore } from "../../users/states/usersStore.js";
import { useAuthStore } from "../../auth/states/authStore.js";

const router = useRouter();
const users = useUsersStore();
const auth = useAuthStore();
const open = ref(false);

onMounted(async () => {
  if (!(await users.fetchProfile())) {
    auth.logout();
    router.replace("/auth/login");
  }
});
</script>

<template>
  <div class="min-h-screen">
    <NavbarComponent @toggle-sidebar="open = !open" />
    <div class="flex">
      <SidebarComponent :open="open" @close="open = false" />
      <main role="main" class="min-w-0 flex-1 p-4 sm:p-6"><RouterView /></main>
    </div>
  </div>
</template>
