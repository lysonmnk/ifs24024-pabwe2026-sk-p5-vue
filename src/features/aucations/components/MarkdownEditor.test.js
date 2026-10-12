import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import MarkdownEditor from "./MarkdownEditor.vue";
import Editor from "@toast-ui/editor";

vi.mock("@toast-ui/editor", () => {
  return {
    default: vi.fn().mockImplementation(function (options) {
      this.options = options;
      this.getMarkdown = vi.fn().mockReturnValue("isi teks markdown");
      this.destroy = vi.fn();
    }),
  };
});

describe("MarkdownEditor", () => {
  it("menginisialisasi editor dan emit update:modelValue ketika konten berubah", async () => {
    const wrapper = mount(MarkdownEditor, {
      props: { modelValue: "awal" },
    });

    expect(Editor).toHaveBeenCalled();
    const instance = Editor.mock.instances[0];

    // Trigger events.change
    instance.options.events.change();
    expect(wrapper.emitted("update:modelValue")).toEqual([["isi teks markdown"]]);

    wrapper.unmount();
    expect(instance.destroy).toHaveBeenCalled();
  });
});
