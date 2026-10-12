import { describe, it, expect, vi, beforeEach } from "vitest";
import DetailPage from "./DetailPage.vue";
import { renderWithProviders, createMockPinia } from "../../../test-utils.js";
import { useAucationsStore } from "../states/aucationsStore.js";
import { useUsersStore } from "../../users/states/usersStore.js";
import * as tools from "../../../helpers/toolsHelper.js";

vi.mock("../../../helpers/toolsHelper.js", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    showConfirmDialog: vi.fn(),
  };
});

describe("DetailPage", () => {
  const mockAucation = {
    id: 1,
    user_id: 10,
    title: "Barang Langka",
    description: "Deskripsi",
    start_bid: 100000,
    closed_at: "2026-12-31 23:59:00",
    cover: "https://example.com/cover.jpg",
    bids: [
      { id: 1, user_id: 20, bid: 150000, user: { name: "Penawar 1" } },
      { id: 2, user_id: 10, bid: 120000, user: { name: "Penawar 2" } },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("menampilkan pesan memuat jika data lelang belum ada", async () => {
    const pinia = createMockPinia();
    const store = useAucationsStore(pinia);
    store.aucation = null;
    store.fetchAucation = vi.fn().mockImplementation(() => new Promise(() => {})); // pending

    const { wrapper } = await renderWithProviders(DetailPage, {
      pinia,
      global: {
        stubs: {
          MarkdownViewer: true,
          ChangeModal: true,
          ChangeCoverModal: true,
          BidModal: true,
        },
      },
    });

    expect(wrapper.text()).toContain("Memuat detail lelang...");
  });

  it("melakukan redirect ke beranda jika lelang gagal dimuat", async () => {
    const pinia = createMockPinia();
    const store = useAucationsStore(pinia);
    store.aucation = null;
    store.fetchAucation = vi.fn().mockResolvedValue(false);

    const { router } = await renderWithProviders(DetailPage, {
      pinia,
      global: {
        stubs: {
          MarkdownViewer: true,
          ChangeModal: true,
          ChangeCoverModal: true,
          BidModal: true,
        },
      },
    });

    await new Promise((r) => setTimeout(r, 20));
    expect(router.currentRoute.value.path).toBe("/");
  });

  it("menampilkan tombol aksi pemilik jika pengguna adalah pemilik lelang", async () => {
    const { wrapper, pinia, router } = await renderWithProviders(DetailPage, {
      global: {
        stubs: {
          MarkdownViewer: true,
          ChangeModal: true,
          ChangeCoverModal: true,
          BidModal: true,
        },
      },
    });
    const store = useAucationsStore(pinia);
    const users = useUsersStore(pinia);
    store.aucation = mockAucation;
    users.profile = { id: 10, name: "Owner" };
    store.deleteAucation = vi.fn().mockResolvedValue(true);
    tools.showConfirmDialog.mockResolvedValue(true);
    const routerSpy = vi.spyOn(router, "replace");

    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-testid="btn-edit"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="btn-cover"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="btn-delete"]').exists()).toBe(true);

    // Buka ChangeModal
    await wrapper.find('[data-testid="btn-edit"]').trigger("click");
    expect(wrapper.findComponent({ name: "ChangeModal" }).exists()).toBe(true);

    // Buka ChangeCoverModal
    await wrapper.find('[data-testid="btn-cover"]').trigger("click");
    expect(wrapper.findComponent({ name: "ChangeCoverModal" }).exists()).toBe(true);

    // Hapus lelang
    await wrapper.find('[data-testid="btn-delete"]').trigger("click");
    expect(tools.showConfirmDialog).toHaveBeenCalledWith("Hapus lelang ini?");
    expect(store.deleteAucation).toHaveBeenCalledWith(1);
    expect(routerSpy).toHaveBeenCalledWith("/");

    // Hapus lelang ketika dialog dibatalkan
    tools.showConfirmDialog.mockResolvedValue(false);
    store.deleteAucation.mockClear();
    await wrapper.find('[data-testid="btn-delete"]').trigger("click");
    expect(store.deleteAucation).not.toHaveBeenCalled();

    // Hapus lelang ketika deleteAucation return false
    tools.showConfirmDialog.mockResolvedValue(true);
    store.deleteAucation = vi.fn().mockResolvedValue(false);
    routerSpy.mockClear();
    await wrapper.find('[data-testid="btn-delete"]').trigger("click");
    expect(routerSpy).not.toHaveBeenCalled();
  });

  it("menampilkan tombol ajukan tawaran dan batalkan tawaran bagi peserta", async () => {
    const { wrapper, pinia } = await renderWithProviders(DetailPage, {
      global: {
        stubs: {
          MarkdownViewer: true,
          ChangeModal: true,
          ChangeCoverModal: true,
          BidModal: true,
        },
      },
    });
    const store = useAucationsStore(pinia);
    const users = useUsersStore(pinia);
    store.aucation = mockAucation;
    users.profile = { id: 20, name: "Bidder" };
    store.deleteBid = vi.fn().mockResolvedValue(true);
    store.fetchAucation = vi.fn().mockResolvedValue(true);
    tools.showConfirmDialog.mockResolvedValue(true);

    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-testid="btn-bid"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="btn-cancel-bid"]').exists()).toBe(true);

    // Buka BidModal
    await wrapper.find('[data-testid="btn-bid"]').trigger("click");
    expect(wrapper.findComponent({ name: "BidModal" }).exists()).toBe(true);

    // Batalkan tawaran sukses
    await wrapper.find('[data-testid="btn-cancel-bid"]').trigger("click");
    expect(tools.showConfirmDialog).toHaveBeenCalledWith("Batalkan tawaranmu?");
    expect(store.deleteBid).toHaveBeenCalledWith(1);

    // Batalkan tawaran ketika konfirmasi dibatalkan
    tools.showConfirmDialog.mockResolvedValue(false);
    store.deleteBid.mockClear();
    await wrapper.find('[data-testid="btn-cancel-bid"]').trigger("click");
    expect(store.deleteBid).not.toHaveBeenCalled();

    // Batalkan tawaran ketika deleteBid return false
    tools.showConfirmDialog.mockResolvedValue(true);
    store.deleteBid = vi.fn().mockResolvedValue(false);
    store.fetchAucation.mockClear();
    await wrapper.find('[data-testid="btn-cancel-bid"]').trigger("click");
    expect(store.fetchAucation).not.toHaveBeenCalled();
  });

  it("menutup modal dan memuat ulang data saat modal selesai (done)", async () => {
    const { wrapper, pinia } = await renderWithProviders(DetailPage, {
      global: {
        stubs: {
          MarkdownViewer: true,
          ChangeModal: {
            template: "<div data-testid='stub-change'><button data-testid='btn-done' @click=\"$emit('done')\"></button><button data-testid='btn-close' @click=\"$emit('close')\"></button></div>",
            emits: ["done", "close"],
          },
          ChangeCoverModal: true,
          BidModal: true,
        },
      },
    });
    const store = useAucationsStore(pinia);
    const users = useUsersStore(pinia);
    store.aucation = mockAucation;
    users.profile = { id: 10, name: "Owner" };
    store.fetchAucation = vi.fn().mockResolvedValue(true);
    await wrapper.vm.$nextTick();

    await wrapper.find('[data-testid="btn-edit"]').trigger("click");
    await wrapper.find('[data-testid="btn-done"]').trigger("click");
    expect(store.fetchAucation).toHaveBeenCalled();

    // Trigger close modal
    await wrapper.find('[data-testid="btn-edit"]').trigger("click");
    await wrapper.find('[data-testid="btn-close"]').trigger("click");
    expect(wrapper.find('[data-testid="stub-change"]').exists()).toBe(false);
  });

  it("menavigasi kembali ketika tombol kembali diklik", async () => {
    const { wrapper, pinia, router } = await renderWithProviders(DetailPage, {
      global: {
        stubs: {
          MarkdownViewer: true,
          ChangeModal: true,
          ChangeCoverModal: true,
          BidModal: true,
        },
      },
    });
    const store = useAucationsStore(pinia);
    store.aucation = mockAucation;
    const routerBackSpy = vi.spyOn(router, "back");
    await wrapper.vm.$nextTick();

    await wrapper.find('[data-testid="btn-back"]').trigger("click");
    expect(routerBackSpy).toHaveBeenCalled();
  });

  it("membuka dan menutup ChangeCoverModal serta BidModal", async () => {
    const { wrapper, pinia } = await renderWithProviders(DetailPage, {
      global: {
        stubs: {
          MarkdownViewer: true,
          ChangeModal: true,
          ChangeCoverModal: {
            template: "<div data-testid='stub-cover'><button data-testid='btn-cover-close' @click=\"$emit('close')\"></button></div>",
            emits: ["close", "done"],
          },
          BidModal: {
            template: "<div data-testid='stub-bid'><button data-testid='btn-bid-close' @click=\"$emit('close')\"></button></div>",
            emits: ["close", "done"],
          },
        },
      },
    });
    const store = useAucationsStore(pinia);
    const users = useUsersStore(pinia);
    store.aucation = mockAucation;
    users.profile = { id: 10, name: "Owner" };
    await wrapper.vm.$nextTick();

    await wrapper.find('[data-testid="btn-cover"]').trigger("click");
    expect(wrapper.find('[data-testid="stub-cover"]').exists()).toBe(true);
    await wrapper.find('[data-testid="btn-cover-close"]').trigger("click");
    expect(wrapper.find('[data-testid="stub-cover"]').exists()).toBe(false);

    users.profile = { id: 99, name: "Bidder" };
    await wrapper.vm.$nextTick();
    await wrapper.find('[data-testid="btn-bid"]').trigger("click");
    expect(wrapper.find('[data-testid="stub-bid"]').exists()).toBe(true);
    await wrapper.find('[data-testid="btn-bid-close"]').trigger("click");
    expect(wrapper.find('[data-testid="stub-bid"]').exists()).toBe(false);
  });
});
