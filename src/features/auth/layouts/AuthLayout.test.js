import { describe, it, expect } from "vitest";
import AuthLayout from "./AuthLayout.vue";
import { renderWithProviders } from "../../../test-utils.js";

describe("AuthLayout", () => {
  it("merender judul, logo, dan tab autentikasi", async () => {
    const { wrapper } = await renderWithProviders(AuthLayout);
    expect(wrapper.text()).toContain("Delcom Auction");
    expect(wrapper.find('[data-testid="tab-login"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="tab-register"]').exists()).toBe(true);
  });
});
