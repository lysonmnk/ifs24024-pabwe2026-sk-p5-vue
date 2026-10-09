<script setup>
import { onBeforeUnmount, ref } from "vue";
import ModalShell from "./ModalShell.vue";
import { useAucationsStore } from "../states/aucationsStore.js";
import { showWarningDialog } from "../../../helpers/toolsHelper.js";

const props = defineProps({ aucation: { type: Object, required: true } });
const emit = defineEmits(["close", "done"]);
const store = useAucationsStore();
const file = ref(null);
const preview = ref(props.aucation.cover || "");
let objectUrl = null;

function onFile(e) {
  file.value = e.target.files[0] || null;
  if (objectUrl) URL.revokeObjectURL(objectUrl);
  if (file.value) {
    objectUrl = URL.createObjectURL(file.value);
    preview.value = objectUrl;
  }
}
onBeforeUnmount(() => objectUrl && URL.revokeObjectURL(objectUrl));

async function submit() {
  if (!file.value) {
    await showWarningDialog("Pilih gambar terlebih dahulu");
    return;
  }
  if (await store.changeCover(props.aucation.id, file.value)) emit("done");
}
</script>

<template>
  <ModalShell title="Ganti Cover" @close="emit('close')">
    <form class="space-y-3" @submit.prevent="submit">
      <img v-if="preview" :src="preview" alt="Pratinjau cover" class="h-48 w-full rounded-xl object-cover" data-testid="cover-preview" />
      <input type="file" accept="image/*" data-testid="cover-file" @change="onFile" />
      <button type="submit" :disabled="store.isAucationChangeCover" class="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
        {{ store.isAucationChangeCover ? "Mengunggah..." : "Unggah Cover" }}
      </button>
    </form>
  </ModalShell>
</template>
