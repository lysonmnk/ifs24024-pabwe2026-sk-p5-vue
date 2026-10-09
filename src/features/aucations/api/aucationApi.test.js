import * as api from "./aucationApi.js";
import * as helper from "../../../helpers/apiHelper.js";

vi.mock("../../../helpers/apiHelper.js", () => ({ apiFetch: vi.fn().mockResolvedValue({}) }));

describe("aucationApi", () => {
  it("memanggil endpoint yang benar", async () => {
    await api.getAucations({ is_me: 1 });
    await api.getAucation(1);
    await api.postAucation({ title: "t" });
    await api.putAucation(1, { title: "t" });
    await api.postAucationCover(1, new File(["a"], "a.png"));
    await api.deleteAucation(1);
    await api.postBid(1, 9);
    await api.deleteBid(1);
    await api.deleteAllAucations();
    const paths = helper.apiFetch.mock.calls.map((c) => c[0]);
    expect(paths).toEqual(["/aucations", "/aucations/1", "/aucations", "/aucations/1", "/aucations/1/cover", "/aucations/1", "/aucations/1/bids", "/aucations/1/bids", "/aucations"]);
  });
});
