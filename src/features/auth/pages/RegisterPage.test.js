import { describe, it, expect, vi, beforeEach } from "vitest";
import RegisterPage from "./RegisterPage.vue";
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

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("menampilkan peringatan jika kolom masih ada yang kosong", async () => {
    const { wrapper } = await renderWithProviders(RegisterPage);

    await wrapper.find("form").trigger("submit.prevent");
    expect(tools.showWarningDialog).toHaveBeenCalledWith("Semua kolom wajib diisi");
  });

  it("menampilkan peringatan jika kata sandi kurang dari 6 karakter", async () => {
    const { wrapper } = await renderWithProviders(RegisterPage);

    await wrapper.find('[data-testid="register-name"]').setValue("Nama User");
    await wrapper.find('[data-testid="register-email"]').setValue("user@example.com");
    await wrapper.find('[data-testid="register-password"]').setValue("12345");
    await wrapper.find("form").trigger("submit.prevent");

    expect(tools.showWarningDialog).toHaveBeenCalledWith("Kata sandi minimal 6 karakter");
  });

  it("berhasil mendaftar dan navigasi ke halaman login", async () => {
    const { wrapper, pinia, router } = await renderWithProviders(RegisterPage);
    const auth = useAuthStore(pinia);
    auth.register = vi.fn().mockResolvedValue(true);
    const routerSpy = vi.spyOn(router, "replace");

    await wrapper.find('[data-testid="register-name"]').setValue("Nama User");
    await wrapper.find('[data-testid="register-email"]').setValue("user@example.com");
    await wrapper.find('[data-testid="register-password"]').setValue("123456");
    await wrapper.find("form").trigger("submit.prevent");

    expect(auth.register).toHaveBeenCalledWith("Nama User", "user@example.com", "123456");
    expect(routerSpy).toHaveBeenCalledWith("/auth/login");
  });
});
