import { apiFetch, getAccessToken, putAccessToken, removeAccessToken } from "./apiHelper.js";

const mockFetch = (ok, json) => vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok, json: async () => json }));

describe("apiHelper", () => {
  it("menyimpan, membaca, dan menghapus token", () => {
    putAccessToken("abc");
    expect(getAccessToken()).toBe("abc");
    removeAccessToken();
    expect(getAccessToken()).toBeNull();
  });

  it("mengirim GET dengan query dan Authorization", async () => {
    putAccessToken("tok");
    mockFetch(true, { success: true, data: {} });
    await apiFetch("/x", { params: { a: 1, b: "", c: null, d: undefined } });
    const [url, opts] = fetch.mock.calls[0];
    expect(url).toContain("/x?a=1");
    expect(url).not.toContain("b=");
    expect(opts.headers.Authorization).toBe("Bearer tok");
  });

  it("mengirim JSON dan FormData, serta melempar error", async () => {
    mockFetch(true, { success: true });
    await apiFetch("/x", { method: "POST", body: { a: 1 } });
    expect(fetch.mock.calls[0][1].headers["Content-Type"]).toBe("application/json");
    const form = new FormData();
    await apiFetch("/x", { method: "POST", body: form, isForm: true });
    expect(fetch.mock.calls[1][1].body).toBe(form);
    mockFetch(false, { message: "gagal" });
    await expect(apiFetch("/x")).rejects.toThrow("gagal");
    mockFetch(true, { success: false });
    await expect(apiFetch("/x")).rejects.toThrow("Terjadi kesalahan pada server");
  });
});
