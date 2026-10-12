import { describe, it, expect, vi, beforeEach } from "vitest";
import ChangeCoverModal from "./ChangeCoverModal.vue";
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

describe("ChangeCoverModal", () => {
  const mockAucation = { id: 1, cover: "https://example.com/cover.jpg" };

  beforeEach(() => {
    vi.clearAllMocks();
    global.URL.createObjectURL = vi.fn(() => "blob:mock-url");
    global.URL.revokeObjectURL = vi.fn();
  });

  it("menampilkan pratinjau cover awal", async () => {
    const { wrapper } = await renderWithProviders(ChangeCoverModal, {
      props: { aucation: mockAucation },
    });

    const img = wrapper.find('[data-testid="cover-preview"]');
    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toBe("https://example.com/cover.jpg");
  });

  it("menampilkan peringatan jika submit tanpa memilih file", async () => {
    const { wrapper } = await renderWithProviders(ChangeCoverModal, {
      props: { aucation: { id: 1 } },
    });

    await wrapper.find("form").trigger("submit.prevent");
    expect(tools.showWarningDialog).toHaveBeenCalledWith("Pilih gambar terlebih dahulu");
  });

  it("mengubah pratinjau ketika file dipilih, mengirim cover, dan emit done", async () => {
    const { wrapper, pinia } = await renderWithProviders(ChangeCoverModal, {
      props: { aucation: mockAucation },
    });
    const store = useAucationsStore(pinia);
    store.changeCover = vi.fn().mockResolvedValue(true);

    const file = new File(["dummy content"], "photo.png", { type: "image/png" });
    const input = wrapper.find('[data-testid="cover-file"]');
    Object.defineProperty(input.element, "files", {
      value: [file],
      writable: true,
    });
    await input.trigger("change");

    expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
    expect(wrapper.find('[data-testid="cover-preview"]').attributes("src")).toBe("blob:mock-url");

    await wrapper.find("form").trigger("submit.prevent");
    expect(store.changeCover).toHaveBeenCalledWith(1, file);
    expect(wrapper.emitted("done")).toHaveLength(1);

    wrapper.unmount();
    expect(global.URL.revokeObjectURL).toHaveBeenCalled();
  });

  it("meng-emit close ketika ditutup", async () => {
    const { wrapper } = await renderWithProviders(ChangeCoverModal, {
      props: { aucation: mockAucation },
    });

    await wrapper.find('[data-testid="modal-close"]').trigger("click");
    expect(wrapper.emitted("close")).toHaveLength(1);
  });
});
