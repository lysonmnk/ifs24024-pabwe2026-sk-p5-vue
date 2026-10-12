import { describe, it, expect, vi } from "vitest";
import AucationLayout from "./AucationLayout.vue";
import { renderWithProviders, createMockPinia } from "../../../test-utils.js";
import { useUsersStore } from "../../users/states/usersStore.js";
import { useAuthStore } from "../../auth/states/authStore.js";

describe("AucationLayout", () => {
  it("merender layout dengan benar dan toggle sidebar", async () => {
    const pinia = createMockPinia();
    const users = useUsersStore(pinia);
    users.fetchProfile = vi.fn().mockResolvedValue(true);

    const { wrapper } = await renderWithProviders(AucationLayout, {
      pinia,
      global: {
        stubs: {
          NavbarComponent: {
            template: "<header @click=\"$emit('toggle-sidebar')\"></header>",
            emits: ["toggle-sidebar"],
          },
          SidebarComponent: {
            template: "<aside @click=\"$emit('close')\"></aside>",
            props: ["open"],
            emits: ["close"],
          },
        },
      },
    });

    expect(wrapper.find("main").exists()).toBe(true);
    // trigger toggle-sidebar
    await wrapper.find("header").trigger("click");
    // trigger sidebar close
    await wrapper.find("aside").trigger("click");
  });

  it("melakukan logout dan redirect ke /auth/login jika fetchProfile gagal", async () => {
    const pinia = createMockPinia();
    const users = useUsersStore(pinia);
    const auth = useAuthStore(pinia);
    users.fetchProfile = vi.fn().mockResolvedValue(false);
    auth.logout = vi.fn();

    const { router } = await renderWithProviders(AucationLayout, {
      pinia,
      global: {
        stubs: {
          NavbarComponent: true,
          SidebarComponent: true,
        },
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    expect(auth.logout).toHaveBeenCalled();
    expect(router.currentRoute.value.path).toBe("/auth/login");
  });
});
