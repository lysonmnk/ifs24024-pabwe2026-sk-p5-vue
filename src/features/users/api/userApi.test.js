import * as api from "./userApi.js";
import * as helper from "../../../helpers/apiHelper.js";

vi.mock("../../../helpers/apiHelper.js", () => ({ apiFetch: vi.fn().mockResolvedValue({}) }));

describe("userApi", () => {
  it("memanggil endpoint pengguna", async () => {
    await api.getUsers();
    await api.getMe();
    await api.putMe({ name: "n", email: "e" });
    await api.postMePhoto(new File(["a"], "a.png"));
    await api.putMePassword({ password: "a", new_password: "b" });
    expect(helper.apiFetch.mock.calls.map((c) => c[0])).toEqual(["/users", "/users/me", "/users/me", "/users/me/photo", "/users/me/password"]);
  });
});
