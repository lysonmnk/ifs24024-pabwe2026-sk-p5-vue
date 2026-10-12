import { describe, it, expect, vi } from "vitest";
import UsersPage from "./UsersPage.vue";
import { renderWithProviders } from "../../../test-utils.js";
import { useUsersStore } from "../states/usersStore.js";

describe("UsersPage", () => {
  it("menampilkan pesan memuat saat data sedang diambil", async () => {
    const { wrapper, pinia } = await renderWithProviders(UsersPage);
    const store = useUsersStore(pinia);
    store.isUsers = true;
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Memuat pengguna...");
  });

  it("menampilkan pesan kosong jika tidak ada pengguna", async () => {
    const { wrapper, pinia } = await renderWithProviders(UsersPage);
    const store = useUsersStore(pinia);
    store.isUsers = false;
    store.users = [];
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Belum ada pengguna.");
  });

  it("merender daftar pengguna baik yang memiliki foto maupun tidak", async () => {
    const { wrapper, pinia } = await renderWithProviders(UsersPage);
    const store = useUsersStore(pinia);
    store.isUsers = false;
    store.users = [
      { id: 1, name: "Alice", email: "alice@example.com", photo: "https://example.com/alice.jpg" },
      { id: 2, name: "", email: "bob@example.com", photo: null },
    ];
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Alice");
    expect(wrapper.text()).toContain("alice@example.com");
    expect(wrapper.find("img").attributes("src")).toBe("https://example.com/alice.jpg");
    expect(wrapper.text()).toContain("bob@example.com");
  });
});
