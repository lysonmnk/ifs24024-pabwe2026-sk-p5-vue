<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft, ImagePlus, Pencil, Trash2 } from "lucide-vue-next";
import MarkdownViewer from "../components/MarkdownViewer.vue";
import ChangeModal from "../modals/ChangeModal.vue";
import ChangeCoverModal from "../modals/ChangeCoverModal.vue";
import BidModal from "../modals/BidModal.vue";
import { useAucationsStore } from "../states/aucationsStore.js";
import { useUsersStore } from "../../users/states/usersStore.js";
import { formatDate, formatRupiah, getHighestBid, isAucationClosed, showConfirmDialog } from "../../../helpers/toolsHelper.js";

const route = useRoute();
const router = useRouter();
const store = useAucationsStore();
const users = useUsersStore();
const modal = ref(null);

const a = computed(() => store.aucation);
const isOwner = computed(() => a.value && users.profile && a.value.user_id === users.profile.id);
const closed = computed(() => isAucationClosed(a.value));
const bids = computed(() => [...(a.value?.bids || [])].sort((x, y) => Number(y.bid) - Number(x.bid)));
const hasMyBid = computed(() => bids.value.some((b) => b.user_id === users.profile?.id));

const load = () => store.fetchAucation(route.params.aucationId);
onMounted(async () => {
  if (!(await load())) router.replace("/");
});

async function done() {
  modal.value = null;
  await load();
}
async function remove() {
  if (await showConfirmDialog("Hapus lelang ini?") && (await store.deleteAucation(a.value.id))) router.replace("/");
}
async function cancelBid() {
  if (await showConfirmDialog("Batalkan tawaranmu?") && (await store.deleteBid(a.value.id))) await load();
}
const btn = "flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold";
</script>

<template>
  <section v-if="a" class="space-y-4">
    <button :class="[btn, 'bg-white shadow-sm']" data-testid="btn-back" @click="router.back()"><ArrowLeft :size="16" /> Kembali</button>
    <img v-if="a.cover" :src="a.cover" :alt="a.title" class="h-72 w-full rounded-2xl object-cover" />
    <div class="rounded-2xl bg-white p-5 shadow-sm space-y-3">
      <h1 class="text-2xl font-extrabold" data-testid="title">{{ a.title }}</h1>
      <p class="text-sm text-slate-500">Harga awal {{ formatRupiah(a.start_bid) }} · Tertinggi <b class="text-indigo-600">{{ formatRupiah(getHighestBid(a)) }}</b></p>
      <p :class="closed ? 'text-red-500' : 'text-emerald-600'" class="text-sm font-semibold">{{ closed ? "Ditutup" : "Berlangsung" }} · berakhir {{ formatDate(a.closed_at) }}</p>
      <MarkdownViewer :value="a.description || ''" />
      <div class="flex flex-wrap gap-2 pt-2">
        <template v-if="isOwner">
          <button :class="[btn, 'bg-indigo-50 text-indigo-600']" data-testid="btn-edit" @click="modal = 'change'"><Pencil :size="14" /> Ubah</button>
          <button :class="[btn, 'bg-indigo-50 text-indigo-600']" data-testid="btn-cover" @click="modal = 'cover'"><ImagePlus :size="14" /> Ganti Cover</button>
          <button :class="[btn, 'bg-red-50 text-red-600']" data-testid="btn-delete" @click="remove"><Trash2 :size="14" /> Hapus</button>
        </template>
        <template v-else-if="!closed">
          <button :class="[btn, 'bg-indigo-600 text-white']" data-testid="btn-bid" @click="modal = 'bid'">Ajukan Tawaran</button>
          <button v-if="hasMyBid" :class="[btn, 'bg-red-50 text-red-600']" data-testid="btn-cancel-bid" @click="cancelBid">Batalkan Tawaran</button>
        </template>
      </div>
    </div>
    <div class="rounded-2xl bg-white p-5 shadow-sm">
      <h2 class="mb-2 font-bold">Riwayat Penawaran</h2>
      <p v-if="!bids.length" class="text-sm text-slate-500">Belum ada penawaran.</p>
      <ol class="space-y-2">
        <li v-for="b in bids" :key="b.id" class="flex justify-between text-sm"><span>{{ b.user?.name || "Penawar" }}</span><b>{{ formatRupiah(b.bid) }}</b></li>
      </ol>
    </div>
    <ChangeModal v-if="modal === 'change'" :aucation="a" @close="modal = null" @done="done" />
    <ChangeCoverModal v-if="modal === 'cover'" :aucation="a" @close="modal = null" @done="done" />
    <BidModal v-if="modal === 'bid'" :aucation="a" @close="modal = null" @done="done" />
  </section>
  <div v-else class="rounded-2xl bg-white p-5 shadow-sm text-center">
    <h1 class="text-xl font-bold text-slate-700" data-testid="title">Memuat detail lelang...</h1>
  </div>
</template>
