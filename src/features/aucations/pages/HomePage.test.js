import { describe, it, expect, vi, beforeEach } from "vitest";
import HomePage from "./HomePage.vue";
import { renderWithProviders, createMockPinia } from "../../../test-utils.js";
import { useAucationsStore } from "../states/aucationsStore.js";
import * as tools from "../../../helpers/toolsHelper.js";

vi.mock("../../../helpers/toolsHelper.js", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    showConfirmDialog: vi.fn(),
  };
});

describe("HomePage", () => {
  const mockAucations = [
    {
      id: 1,
      title: "Laptop Gaming",
      description: "Laptop spek tinggi",
      start_bid: 5000000,
      closed_at: "2026-12-31 23:59:00",
      cover: "https://example.com/laptop.jpg",
      bids: [{ id: 1, bid: 6000000 }],
    },
    {
      id: 2,
      title: "Kamera Vintage",
      description: null,
      start_bid: 1000000,
      closed_at: "2026-10-01 00:00:00",
      cover: null,
      bids: [],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("merender lelang dan menyaring berdasarkan pencarian", async () => {
    const pinia = createMockPinia();
    const store = useAucationsStore(pinia);
    store.fetchAucations = vi.fn().mockImplementation(async () => {
      store.aucations = mockAucations;
      store.isAucation = false;
    });

    const { wrapper } = await renderWithProviders(HomePage, {
      pinia,
      global: {
        stubs: {
          AddModal: true,
        },
      },
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Laptop Gaming");
    expect(wrapper.text()).toContain("Kamera Vintage");
    expect(wrapper.text()).toContain("Tanpa cover");

    // Filter dengan pencarian
    const searchInput = wrapper.find('[data-testid="search"]');
    await searchInput.setValue("Laptop");
    expect(wrapper.text()).toContain("Laptop Gaming");
    expect(wrapper.text()).not.toContain("Kamera Vintage");

    // Pencarian tidak ditemukan
    await searchInput.setValue("TidakAda");
    expect(wrapper.find('[data-testid="empty"]').exists()).toBe(true);
  });

  it("mengganti tab dan memanggil fetchAucations", async () => {
    const { wrapper, pinia } = await renderWithProviders(HomePage, {
      global: {
        stubs: {
          AddModal: true,
        },
      },
    });
    const store = useAucationsStore(pinia);
    store.fetchAucations = vi.fn();

    await wrapper.find('[data-testid="tab-mine"]').trigger("click");
    expect(store.fetchAucations).toHaveBeenCalledWith({ is_me: 1 });

    await wrapper.find('[data-testid="tab-ongoing"]').trigger("click");
    expect(store.fetchAucations).toHaveBeenCalledWith({ is_closed: 0 });

    await wrapper.find('[data-testid="tab-closed"]').trigger("click");
    expect(store.fetchAucations).toHaveBeenCalledWith({ is_closed: 1 });
  });

  it("menangani hapus semua lelang ketika dikonfirmasi", async () => {
    const { wrapper, pinia } = await renderWithProviders(HomePage, {
      global: {
        stubs: {
          AddModal: true,
        },
      },
    });
    const store = useAucationsStore(pinia);
    store.deleteAllAucations = vi.fn().mockResolvedValue(true);
    store.fetchAucations = vi.fn();
    tools.showConfirmDialog.mockResolvedValue(true);

    await wrapper.find('[data-testid="btn-delete-all"]').trigger("click");
    expect(tools.showConfirmDialog).toHaveBeenCalledWith("Hapus SEMUA lelang milikmu?");
    expect(store.deleteAllAucations).toHaveBeenCalled();
  });

  it("membuka dan menutup AddModal saat tambah lelang", async () => {
    const { wrapper, pinia } = await renderWithProviders(HomePage, {
      global: {
        stubs: {
          AddModal: {
            template: "<div data-testid='stub-add-modal'><button data-testid='stub-close' @click=\"$emit('close')\"></button><button data-testid='stub-done' @click=\"$emit('done')\"></button></div>",
            emits: ["close", "done"],
          },
        },
      },
    });
    const store = useAucationsStore(pinia);
    store.fetchAucations = vi.fn();

    await wrapper.find('[data-testid="btn-add"]').trigger("click");
    expect(wrapper.find('[data-testid="stub-add-modal"]').exists()).toBe(true);

    // trigger close
    await wrapper.find('[data-testid="stub-close"]').trigger("click");
    expect(wrapper.find('[data-testid="stub-add-modal"]').exists()).toBe(false);

    // trigger open again and done
    await wrapper.find('[data-testid="btn-add"]').trigger("click");
    await wrapper.find('[data-testid="stub-done"]').trigger("click");
    expect(store.fetchAucations).toHaveBeenCalled();
  });
});
