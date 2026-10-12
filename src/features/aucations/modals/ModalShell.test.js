import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ModalShell from "./ModalShell.vue";

describe("ModalShell", () => {
  it("merender judul, konten slot, dan emit close ketika tombol diklik", async () => {
    const wrapper = mount(ModalShell, {
      props: { title: "Test Modal" },
      slots: { default: "<p>Konten Modal</p>" },
    });

    expect(wrapper.text()).toContain("Test Modal");
    expect(wrapper.text()).toContain("Konten Modal");

    const closeBtn = wrapper.find('[data-testid="modal-close"]');
    await closeBtn.trigger("click");
    expect(wrapper.emitted("close")).toHaveLength(1);
  });
});
