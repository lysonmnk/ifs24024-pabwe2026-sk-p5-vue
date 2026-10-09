import NotFoundPage from "./NotFoundPage.vue";
import { renderWithProviders } from "../../../test-utils.js";

describe("NotFoundPage", () => {
  it("menampilkan 404", async () => {
    const { wrapper } = await renderWithProviders(NotFoundPage);
    expect(wrapper.text()).toContain("404");
  });
});
