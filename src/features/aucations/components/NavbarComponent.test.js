import { describe, it, expect, vi, beforeEach } from "vitest";
import NavbarComponent from "./NavbarComponent.vue";
import { renderWithProviders } from "../../../test-utils.js";
import { useUsersStore } from "../../users/states/usersStore.js";
import { useAuthStore } from "../../auth/states/authStore.js";
import * as tools from "../../../helpers/toolsHelper.js";

vi.mock("../../../helpers/toolsHelper.js", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    showConfirmDialog: vi.fn(),
  };
});

describe("NavbarComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("merender nama pengguna default dan emit toggle-sidebar ketika menu diklik", async () => {
    const { wrapper } = await renderWithProviders(NavbarComponent);
    expect(wrapper.find('[data-testid="display-name"]').text()).toBe("Pengguna");

    await wrapper.find('[data-testid="btn-menu"]').trigger("click");
    expect(wrapper.emitted("toggle-sidebar")).toHaveLength(1);
  });

  it("merender foto profil jika tersedia", async () => {
    const { wrapper, pinia } = await renderWithProviders(NavbarComponent);
    const users = useUsersStore(pinia);
    users.profile = { name: "John Doe", photo: "https://example.com/photo.jpg" };
    await wrapper.vm.$nextTick();

    const img = wrapper.find("img");
    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toBe("https://example.com/photo.jpg");
  });

  it("menangani aksi logout ketika dikonfirmasi", async () => {
    const { wrapper, pinia, router } = await renderWithProviders(NavbarComponent);
    const auth = useAuthStore(pinia);
    auth.logout = vi.fn();
    const routerSpy = vi.spyOn(router, "replace");
    tools.showConfirmDialog.mockResolvedValue(true);

    await wrapper.find('[data-testid="btn-logout"]').trigger("click");
    expect(tools.showConfirmDialog).toHaveBeenCalledWith("Yakin ingin keluar?");
    expect(auth.logout).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith("/auth/login");
  });
});
