<script setup>
import { ref } from "vue";
import ModalShell from "./ModalShell.vue";
import MarkdownEditor from "../components/MarkdownEditor.vue";
import { useAucationsStore } from "../states/aucationsStore.js";
import { useInput } from "../../../hooks/useInput.js";
import { showWarningDialog, toApiDate } from "../../../helpers/toolsHelper.js";

const emit = defineEmits(["close", "done"]);
const store = useAucationsStore();
const [title, onTitle] = useInput("");
const [startBid, onStartBid] = useInput("");
const [closedAt, onClosedAt] = useInput("");
const description = ref("");

async function submit() {
  if (!title.value || !startBid.value || !closedAt.value) {
    await showWarningDialog("Judul, harga awal, dan batas waktu wajib diisi");
    return;
  }
  const ok = await store.addAucation({
    title: title.value,
    description: description.value,
    start_bid: Number(startBid.value),
    closed_at: toApiDate(closedAt.value),
  });
  if (ok) emit("done");
}
const input = "w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500";
</script>

<template>
  <ModalShell title="Tambah Lelang" @close="emit('close')">
    <form class="space-y-3" @submit.prevent="submit">
      <input :value="title" :class="input" placeholder="Judul barang" data-testid="add-title" @input="onTitle" />
      <MarkdownEditor v-model="description" />
      <input :value="startBid" type="number" min="0" :class="input" placeholder="Harga awal (Rp)" data-testid="add-start-bid" @input="onStartBid" />
      <input :value="closedAt" type="datetime-local" :class="input" data-testid="add-closed-at" @input="onClosedAt" />
      <button type="submit" :disabled="store.isAucationAdd" class="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
        {{ store.isAucationAdd ? "Menyimpan..." : "Simpan Lelang" }}
      </button>
    </form>
  </ModalShell>
</template>
