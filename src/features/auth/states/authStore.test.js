import { setActivePinia, createPinia } from "pinia";
import { useAuthStore } from "./authStore.js";
import * as api from "../api/authApi.js";
import * as tools from "../../../helpers/toolsHelper.js";

vi.mock("../api/authApi.js");
vi.mock("../../../helpers/toolsHelper.js", () => ({ showSuccessDialog: vi.fn(), showErrorDialog: vi.fn() }));

describe("authStore", () => {
  beforeEach(() => setActivePinia(createPinia()));

  it("login berhasil & gagal", async () => {
    const s = useAuthStore();
    api.postLogin.mockResolvedValueOnce({ data: { token: "t" } });
    expect(await s.login("a", "b")).toBe(true);
    expect(s.isLoggedIn).toBe(true);
    api.postLogin.mockRejectedValueOnce(new Error("salah"));
    expect(await s.login("a", "b")).toBe(false);
    expect(tools.showErrorDialog).toHaveBeenCalledWith("salah");
  });
  it("register berhasil & gagal", async () => {
    const s = useAuthStore();
    api.postRegister.mockResolvedValueOnce({ message: "ok" });
    expect(await s.register("n", "e", "p")).toBe(true);
    api.postRegister.mockRejectedValueOnce(new Error("x"));
    expect(await s.register("n", "e", "p")).toBe(false);
  });
  it("logout", () => {
    const s = useAuthStore();
    s.token = "t";
    s.logout();
    expect(s.isLoggedIn).toBe(false);
  });
});
