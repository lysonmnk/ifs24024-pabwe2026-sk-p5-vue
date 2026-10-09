<script setup>
import { X } from "lucide-vue-next";

defineProps({ title: { type: String, required: true } });
defineEmits(["close"]);
</script>

<template>
  <div class="fixed inset-0 z-[60] grid place-items-center bg-black/50 p-4" role="dialog">
    <div class="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-extrabold">{{ title }}</h2>
        <button aria-label="Tutup" data-testid="modal-close" @click="$emit('close')"><X :size="20" /></button>
      </div>
      <slot />
    </div>
  </div>
</template>
