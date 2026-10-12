import { describe, it, expect } from "vitest";
import SidebarComponent from "./SidebarComponent.vue";
import { renderWithProviders } from "../../../test-utils.js";

describe("SidebarComponent", () => {
  it("merender tautan navigasi", async () => {
    const { wrapper } = await renderWithProviders(SidebarComponent, {
      props: { open: false },
    });

    expect(wrapper.text()).toContain("Dashboard Lelang");
    expect(wrapper.text()).toContain("Lelang Saya");
    expect(wrapper.text()).toContain("Daftar Pengguna");
    expect(wrapper.text()).toContain("Profil Saya");
    expect(wrapper.find('[data-testid="sidebar-backdrop"]').exists()).toBe(false);
  });

  it("menampilkan backdrop ketika open=true dan meng-emit close saat diklik", async () => {
    const { wrapper } = await renderWithProviders(SidebarComponent, {
      props: { open: true },
    });

    const backdrop = wrapper.find('[data-testid="sidebar-backdrop"]');
    expect(backdrop.exists()).toBe(true);
    await backdrop.trigger("click");
    expect(wrapper.emitted("close")).toHaveLength(1);

    await wrapper.find('[data-testid="btn-close"]').trigger("click");
    expect(wrapper.emitted("close")).toHaveLength(2);
  });
});
