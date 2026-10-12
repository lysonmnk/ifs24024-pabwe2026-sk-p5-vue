import { describe, it, expect, vi, beforeEach } from "vitest";
import BidModal from "./BidModal.vue";
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

describe("BidModal", () => {
  const mockAucation = {
    id: 1,
    title: "Jam Antik",
    start_bid: 100000,
    bids: [{ id: 1, bid: 150000, user_id: 2 }],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("menampilkan penawaran tertinggi saat ini", async () => {
    const { wrapper } = await renderWithProviders(BidModal, {
      props: { aucation: mockAucation },
    });

    expect(wrapper.find('[data-testid="highest"]').text()).toContain("150.000");
  });

  it("menampilkan peringatan jika nominal tawaran lebih rendah atau sama dengan penawaran tertinggi", async () => {
    const { wrapper } = await renderWithProviders(BidModal, {
      props: { aucation: mockAucation },
    });

    await wrapper.find('[data-testid="bid-input"]').setValue("150000");
    await wrapper.find("form").trigger("submit.prevent");

    expect(tools.showWarningDialog).toHaveBeenCalled();
  });

  it("berhasil mengirim tawaran jika nominal lebih tinggi dan emit done", async () => {
    const { wrapper, pinia } = await renderWithProviders(BidModal, {
      props: { aucation: mockAucation },
    });
    const store = useAucationsStore(pinia);
    store.addBid = vi.fn().mockResolvedValue(true);

    await wrapper.find('[data-testid="bid-input"]').setValue("200000");
    await wrapper.find("form").trigger("submit.prevent");

    expect(store.addBid).toHaveBeenCalledWith(1, 200000);
    expect(wrapper.emitted("done")).toHaveLength(1);
  });

  it("meng-emit close ketika ditutup", async () => {
    const { wrapper } = await renderWithProviders(BidModal, {
      props: { aucation: mockAucation },
    });

    await wrapper.find('[data-testid="modal-close"]').trigger("click");
    expect(wrapper.emitted("close")).toHaveLength(1);
  });
});
