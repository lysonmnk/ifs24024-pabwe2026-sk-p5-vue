import { postLogin, postRegister } from "./authApi.js";
import * as helper from "../../../helpers/apiHelper.js";

vi.mock("../../../helpers/apiHelper.js", () => ({ apiFetch: vi.fn().mockResolvedValue({}) }));

describe("authApi", () => {
  it("login & register", async () => {
    await postLogin({ email: "e", password: "p" });
    await postRegister({ name: "n", email: "e", password: "p" });
    expect(helper.apiFetch.mock.calls.map((c) => c[0])).toEqual(["/auth/login", "/auth/register"]);
  });
});
