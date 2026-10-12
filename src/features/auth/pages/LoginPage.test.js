import { describe, it, expect, vi, beforeEach } from "vitest";
import LoginPage from "./LoginPage.vue";
import { renderWithProviders } from "../../../test-utils.js";
import { useAuthStore } from "../states/authStore.js";
import * as tools from "../../../helpers/toolsHelper.js";

vi.mock("../../../helpers/toolsHelper.js", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    showWarningDialog: vi.fn(),
  };
});

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("menampilkan peringatan jika email atau password kosong", async () => {
    const { wrapper } = await renderWithProviders(LoginPage);

    await wrapper.find("form").trigger("submit.prevent");
    expect(tools.showWarningDialog).toHaveBeenCalledWith("Email dan kata sandi wajib diisi");
  });

  it("berhasil melakukan login dan navigasi ke beranda", async () => {
    const { wrapper, pinia, router } = await renderWithProviders(LoginPage);
    const auth = useAuthStore(pinia);
    auth.login = vi.fn().mockResolvedValue(true);
    const routerSpy = vi.spyOn(router, "replace");

    await wrapper.find('[data-testid="login-email"]').setValue("user@example.com");
    await wrapper.find('[data-testid="login-password"]').setValue("secret123");
    await wrapper.find("form").trigger("submit.prevent");

    expect(auth.login).toHaveBeenCalledWith("user@example.com", "secret123");
    expect(routerSpy).toHaveBeenCalledWith("/");
  });
});
