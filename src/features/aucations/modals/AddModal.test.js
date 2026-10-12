import { describe, it, expect, vi, beforeEach } from "vitest";
import AddModal from "./AddModal.vue";
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

describe("AddModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("menampilkan peringatan jika field belum lengkap", async () => {
    const { wrapper } = await renderWithProviders(AddModal, {
      global: {
        stubs: {
          MarkdownEditor: { template: "<div data-testid='stub-editor'></div>", props: ["modelValue"] },
        },
      },
    });

    await wrapper.find("form").trigger("submit.prevent");
    expect(tools.showWarningDialog).toHaveBeenCalledWith(
      "Judul, harga awal, dan batas waktu wajib diisi"
    );
  });

  it("berhasil menambahkan lelang dan meng-emit done", async () => {
    const { wrapper, pinia } = await renderWithProviders(AddModal, {
      global: {
        stubs: {
          MarkdownEditor: { template: "<div data-testid='stub-editor'></div>", props: ["modelValue"] },
        },
      },
    });
    const store = useAucationsStore(pinia);
    store.addAucation = vi.fn().mockResolvedValue(true);

    await wrapper.find('[data-testid="add-title"]').setValue("Barang Antik");
    await wrapper.find('[data-testid="add-start-bid"]').setValue("100000");
    await wrapper.find('[data-testid="add-closed-at"]').setValue("2026-12-31T23:59");

    await wrapper.find("form").trigger("submit.prevent");
    expect(store.addAucation).toHaveBeenCalled();
    expect(wrapper.emitted("done")).toHaveLength(1);
  });

  it("meng-emit close ketika ModalShell ditutup", async () => {
    const { wrapper } = await renderWithProviders(AddModal, {
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
