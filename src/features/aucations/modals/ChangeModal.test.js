import { describe, it, expect, vi, beforeEach } from "vitest";
import ChangeModal from "./ChangeModal.vue";
import { renderWithProviders } from "../../../test-utils.js";
import { useAucationsStore } from "../states/aucationsStore.js";
import * as tools from "../../../helpers/toolsHelper.js";

vi.mock("../../../helpers/toolsHelper.js", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    showWarningDialog: vi.fn(),
  };
});

describe("ChangeModal", () => {
  const mockAucation = {
    id: 1,
    title: "Barang Lama",
    start_bid: 50000,
    closed_at: "2026-12-01 10:00:00",
    description: "Deskripsi lama",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("menampilkan peringatan jika field dikosongkan", async () => {
    const { wrapper } = await renderWithProviders(ChangeModal, {
      props: { aucation: mockAucation },
      global: {
        stubs: {
          MarkdownEditor: { template: "<div data-testid='stub-editor'></div>", props: ["modelValue"] },
        },
      },
    });

    await wrapper.find('[data-testid="change-title"]').setValue("");
    await wrapper.find("form").trigger("submit.prevent");
    expect(tools.showWarningDialog).toHaveBeenCalledWith(
      "Judul, harga awal, dan batas waktu wajib diisi"
    );
  });

  it("berhasil mengubah lelang dan emit done", async () => {
    const { wrapper, pinia } = await renderWithProviders(ChangeModal, {
      props: { aucation: mockAucation },
      global: {
        stubs: {
          MarkdownEditor: { template: "<div data-testid='stub-editor'></div>", props: ["modelValue"] },
        },
      },
    });
    const store = useAucationsStore(pinia);
    store.changeAucation = vi.fn().mockResolvedValue(true);

    await wrapper.find('[data-testid="change-title"]').setValue("Barang Baru");
    await wrapper.find("form").trigger("submit.prevent");

    expect(store.changeAucation).toHaveBeenCalled();
    expect(wrapper.emitted("done")).toHaveLength(1);
  });

  it("tidak meng-emit done jika changeAucation gagal", async () => {
    const { wrapper, pinia } = await renderWithProviders(ChangeModal, {
      props: { aucation: mockAucation },
      global: {
        stubs: { MarkdownEditor: true },
      },
    });
    const store = useAucationsStore(pinia);
    store.changeAucation = vi.fn().mockResolvedValue(false);

    await wrapper.find("form").trigger("submit.prevent");
    expect(wrapper.emitted("done")).toBeUndefined();
  });

  it("meng-emit close ketika ditutup", async () => {
    const { wrapper } = await renderWithProviders(ChangeModal, {
      props: { aucation: mockAucation },
      global: {
        stubs: {
          MarkdownEditor: true,
        },
      },
    });

    await wrapper.find('[data-testid="modal-close"]').trigger("click");
    expect(wrapper.emitted("close")).toHaveLength(1);
  });
});
