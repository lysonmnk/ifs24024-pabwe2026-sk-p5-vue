<script setup>
import { ref } from "vue";
import ModalShell from "./ModalShell.vue";
import MarkdownEditor from "../components/MarkdownEditor.vue";
import { useAucationsStore } from "../states/aucationsStore.js";
import { useInput } from "../../../hooks/useInput.js";
import { showWarningDialog, toApiDate } from "../../../helpers/toolsHelper.js";

const props = defineProps({ aucation: { type: Object, required: true } });
const emit = defineEmits(["close", "done"]);
const store = useAucationsStore();
const toLocal = (v) => (v ? String(v).replace(" ", "T").slice(0, 16) : "");
const [title, onTitle] = useInput(props.aucation.title || "");
const [startBid, onStartBid] = useInput(props.aucation.start_bid ?? "");
const [closedAt, onClosedAt] = useInput(toLocal(props.aucation.closed_at));
const description = ref(props.aucation.description || "");

async function submit() {
  if (!title.value || !startBid.value || !closedAt.value) {
    await showWarningDialog("Judul, harga awal, dan batas waktu wajib diisi");
    return;
  }
  const ok = await store.changeAucation(props.aucation.id, {
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
  <ModalShell title="Ubah Lelang" @close="emit('close')">
    <form class="space-y-3" @submit.prevent="submit">
      <input :value="title" :class="input" data-testid="change-title" @input="onTitle" />
      <MarkdownEditor v-model="description" />
      <input :value="startBid" type="number" min="0" :class="input" data-testid="change-start-bid" @input="onStartBid" />
      <input :value="closedAt" type="datetime-local" :class="input" data-testid="change-closed-at" @input="onClosedAt" />
      <button type="submit" :disabled="store.isAucationChange" class="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
        {{ store.isAucationChange ? "Menyimpan..." : "Simpan Perubahan" }}
      </button>
    </form>
  </ModalShell>
</template>
