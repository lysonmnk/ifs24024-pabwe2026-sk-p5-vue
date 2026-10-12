import { describe, it, expect, vi, beforeEach } from "vitest";
import ProfilePage from "./ProfilePage.vue";
import { renderWithProviders } from "../../../test-utils.js";
import { useUsersStore } from "../states/usersStore.js";
import * as tools from "../../../helpers/toolsHelper.js";

vi.mock("../../../helpers/toolsHelper.js", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    showWarningDialog: vi.fn(),
  };
});

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("mengisi input nama dan email sesuai store.profile dan menyimpan profil", async () => {
    const { wrapper, pinia } = await renderWithProviders(ProfilePage);
    const store = useUsersStore(pinia);
    store.profile = { name: "Budi", email: "budi@example.com" };
    store.changeProfile = vi.fn().mockResolvedValue(true);
    await wrapper.vm.$nextTick();

    const nameInput = wrapper.find('[data-testid="profile-name"]');
    expect(nameInput.element.value).toBe("Budi");

    await nameInput.setValue("Budi Baru");
    // Trigger submit on first form (Data Akun)
    const forms = wrapper.findAll("form");
    await forms[0].trigger("submit.prevent");

    expect(store.changeProfile).toHaveBeenCalledWith({
      name: "Budi Baru",
      email: "budi@example.com",
    });
  });

  it("menangani unggah foto profil (validasi kosong & sukses unggah)", async () => {
    const { wrapper, pinia } = await renderWithProviders(ProfilePage);
    const store = useUsersStore(pinia);
    store.changePhoto = vi.fn().mockResolvedValue(true);

    const forms = wrapper.findAll("form");
    // Form kedua adalah Foto Profil
    await forms[1].trigger("submit.prevent");
    expect(tools.showWarningDialog).toHaveBeenCalledWith("Pilih foto terlebih dahulu");

    // Pilih file
    const file = new File(["dummy"], "avatar.jpg", { type: "image/jpeg" });
    const photoInput = wrapper.find('[data-testid="profile-photo"]');
    Object.defineProperty(photoInput.element, "files", {
      value: [file],
      writable: true,
    });
    await photoInput.trigger("change");

    await forms[1].trigger("submit.prevent");
    expect(store.changePhoto).toHaveBeenCalledWith(file);
  });

  it("menangani pemilihan foto ketika tidak ada file yang dipilih", async () => {
    const { wrapper } = await renderWithProviders(ProfilePage);
    const photoInput = wrapper.find('[data-testid="profile-photo"]');
    Object.defineProperty(photoInput.element, "files", {
      value: [],
      writable: true,
    });
    await photoInput.trigger("change");
  });

  it("menangani ubah kata sandi (validasi kosong, gagal, & sukses ubah)", async () => {
    const { wrapper, pinia } = await renderWithProviders(ProfilePage);
    const store = useUsersStore(pinia);
    store.changePassword = vi.fn().mockResolvedValue(false);

    const forms = wrapper.findAll("form");
    // Form ketiga adalah Ubah Kata Sandi
    await forms[2].trigger("submit.prevent");
    expect(tools.showWarningDialog).toHaveBeenCalledWith("Isi kata sandi lama dan baru");

    // Hanya isi kata sandi lama
    await wrapper.find('[data-testid="old-password"]').setValue("oldpass123");
    await forms[2].trigger("submit.prevent");
    expect(tools.showWarningDialog).toHaveBeenCalledWith("Isi kata sandi lama dan baru");

    // Isi kata sandi baru tapi store.changePassword return false
    await wrapper.find('[data-testid="new-password"]').setValue("newpass123");
    await forms[2].trigger("submit.prevent");
    expect(store.changePassword).toHaveBeenCalled();
    expect(wrapper.find('[data-testid="old-password"]').element.value).toBe("oldpass123");

    // Sukses ubah
    store.changePassword.mockResolvedValue(true);
    await forms[2].trigger("submit.prevent");
    expect(wrapper.find('[data-testid="old-password"]').element.value).toBe("");
    expect(wrapper.find('[data-testid="new-password"]').element.value).toBe("");
  });
});
