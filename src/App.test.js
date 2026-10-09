import App from "./App.vue";
import { routes, guestOnly, authOnly } from "./router.js";
import { renderWithProviders } from "./test-utils.js";

describe("App & router", () => {
  it("merender RouterView", async () => {
    const { wrapper } = await renderWithProviders(App, { routes: [{ path: "/", component: { template: "<p>halo</p>" } }] });
    expect(wrapper.text()).toContain("halo");
  });
  it("guard rute", () => {
    expect(authOnly()).toBe("/auth/login");
    expect(guestOnly()).toBe(true);
    localStorage.setItem("accessToken", "t");
    expect(authOnly()).toBe(true);
    expect(guestOnly()).toBe("/");
    expect(routes.length).toBe(3);
  });
});
