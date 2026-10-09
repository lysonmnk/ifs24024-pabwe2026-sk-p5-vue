<script setup>
import { computed } from "vue";
import ModalShell from "./ModalShell.vue";
import { useAucationsStore } from "../states/aucationsStore.js";
import { useInput } from "../../../hooks/useInput.js";
import { formatRupiah, getHighestBid, showWarningDialog } from "../../../helpers/toolsHelper.js";

const props = defineProps({ aucation: { type: Object, required: true } });
const emit = defineEmits(["close", "done"]);
const store = useAucationsStore();
const [bid, onBid] = useInput("");
const highest = computed(() => getHighestBid(props.aucation));

async function submit() {
  if (!bid.value || Number(bid.value) <= highest.value) {
    await showWarningDialog(`Tawaran harus lebih tinggi dari ${formatRupiah(highest.value)}`);
    return;
  }
  if (await store.addBid(props.aucation.id, Number(bid.value))) emit("done");
}
</script>

<template>
  <ModalShell title="Ajukan Penawaran" @close="emit('close')">
    <form class="space-y-3" @submit.prevent="submit">
      <p class="text-sm text-slate-500">Tawaran tertinggi saat ini: <b data-testid="highest">{{ formatRupiah(highest) }}</b></p>
      <input :value="bid" type="number" min="0" class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500" placeholder="Nominal tawaran (Rp)" data-testid="bid-input" @input="onBid" />
      <button type="submit" :disabled="store.isBidAdd" class="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
        {{ store.isBidAdd ? "Mengirim..." : "Kirim Tawaran" }}
      </button>
    </form>
  </ModalShell>
</template>
