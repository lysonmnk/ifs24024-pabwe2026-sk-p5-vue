import Swal from "sweetalert2";

export const showSuccessDialog = (message) =>
  Swal.fire({ icon: "success", title: "Berhasil", text: message, timer: 1800, showConfirmButton: false });

export const showErrorDialog = (message) =>
  Swal.fire({ icon: "error", title: "Gagal", text: message });

export const showWarningDialog = (message) =>
  Swal.fire({ icon: "warning", title: "Perhatian", text: message });

export const showConfirmDialog = async (message) => {
  const result = await Swal.fire({
    icon: "question",
    title: "Konfirmasi",
    text: message,
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Batal",
  });
  return result.isConfirmed;
};

export const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
    Number(value) || 0
  );

export const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
};

/** "2026-10-10T10:00" -> "2026-10-10 10:00:00" */
export const toApiDate = (value) => (value ? `${value.replace("T", " ")}:00` : "");

/** Nilai tawaran tertinggi (fallback ke harga awal) */
export const getHighestBid = (aucation) => {
  const bids = (aucation?.bids || []).map((b) => Number(b.bid) || 0);
  return Math.max(Number(aucation?.start_bid) || 0, ...bids);
};

export const isAucationClosed = (aucation, now = Date.now()) =>
  Boolean(aucation?.is_closed) || (aucation?.closed_at ? new Date(aucation.closed_at).getTime() <= now : false);

export const countdownText = (closedAt, now = Date.now()) => {
  const diff = new Date(closedAt).getTime() - now;
  if (!closedAt || diff <= 0) return "Ditutup";
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return d > 0 ? `${d} hari ${h} jam lagi` : `${h} jam ${m} menit lagi`;
};
