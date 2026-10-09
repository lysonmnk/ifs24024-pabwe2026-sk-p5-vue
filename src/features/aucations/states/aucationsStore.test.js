import { setActivePinia, createPinia } from "pinia";
import { useAucationsStore } from "./aucationsStore.js";
import * as api from "../api/aucationApi.js";

vi.mock("../api/aucationApi.js");
vi.mock("../../../helpers/toolsHelper.js", () => ({ showSuccessDialog: vi.fn(), showErrorDialog: vi.fn() }));

describe("aucationsStore", () => {
  beforeEach(() => setActivePinia(createPinia()));

  it("fetchAucations sukses/gagal", async () => {
    const s = useAucationsStore();
    api.getAucations.mockResolvedValueOnce({ data: { aucations: [{ id: 1 }] } });
    await s.fetchAucations();
    expect(s.aucations).toHaveLength(1);
    api.getAucations.mockResolvedValueOnce({ data: {} });
    await s.fetchAucations();
    expect(s.aucations).toEqual([]);
    api.getAucations.mockRejectedValueOnce(new Error("x"));
    await s.fetchAucations();
    expect(s.aucations).toEqual([]);
  });
  it("fetchAucation sukses/gagal", async () => {
    const s = useAucationsStore();
    api.getAucation.mockResolvedValueOnce({ data: { aucation: { id: 1 } } });
    expect(await s.fetchAucation(1)).toBe(true);
    api.getAucation.mockRejectedValueOnce(new Error("x"));
    expect(await s.fetchAucation(1)).toBe(false);
    expect(s.aucation).toBeNull();
  });
  it("seluruh mutasi", async () => {
    const s = useAucationsStore();
    for (const fn of ["postAucation", "putAucation", "postAucationCover", "deleteAucation", "postBid", "deleteBid", "deleteAllAucations"]) {
      api[fn].mockResolvedValue({ message: "ok" });
    }
    expect(await s.addAucation({})).toBe(true);
    expect(s.isAucationAdded).toBe(true);
    expect(await s.changeAucation(1, {})).toBe(true);
    expect(await s.changeCover(1, {})).toBe(true);
    expect(await s.deleteAucation(1)).toBe(true);
    expect(await s.addBid(1, 5)).toBe(true);
    expect(await s.deleteBid(1)).toBe(true);
    expect(await s.deleteAllAucations()).toBe(true);
    api.postBid.mockResolvedValue({});
    await s.addBid(1, 5);
    api.postBid.mockRejectedValueOnce(new Error("x"));
    expect(await s.addBid(1, 5)).toBe(false);
  });
});
