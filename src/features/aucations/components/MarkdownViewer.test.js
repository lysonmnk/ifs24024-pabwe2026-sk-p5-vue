import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import MarkdownViewer from "./MarkdownViewer.vue";
import Editor from "@toast-ui/editor";

const mockSetMarkdown = vi.fn();
vi.mock("@toast-ui/editor", () => {
  return {
    default: {
      factory: vi.fn().mockImplementation(() => ({
        setMarkdown: mockSetMarkdown,
      })),
    },
  };
});

describe("MarkdownViewer", () => {
  it("menginisialisasi viewer dan memperbarui markdown ketika prop value berubah", async () => {
    const wrapper = mount(MarkdownViewer, {
      props: { value: "konten awal" },
    });

    expect(Editor.factory).toHaveBeenCalled();
    await wrapper.setProps({ value: "konten baru" });
    expect(mockSetMarkdown).toHaveBeenCalledWith("konten baru");
  });
});
