import { setActivePinia, createPinia } from "pinia";
import { useUsersStore } from "./usersStore.js";
import * as api from "../api/userApi.js";

vi.mock("../api/userApi.js");
vi.mock("../../../helpers/toolsHelper.js", () => ({ showSuccessDialog: vi.fn(), showErrorDialog: vi.fn() }));

describe("usersStore", () => {
  beforeEach(() => setActivePinia(createPinia()));

  it("fetchUsers", async () => {
    const s = useUsersStore();
    api.getUsers.mockResolvedValueOnce({ data: { users: [{ id: 1 }] } });
    await s.fetchUsers();
    expect(s.users).toHaveLength(1);
    api.getUsers.mockResolvedValueOnce({ data: {} });
    await s.fetchUsers();
    expect(s.users).toEqual([]);
    api.getUsers.mockRejectedValueOnce(new Error("x"));
    await s.fetchUsers();
  });
  it("fetchProfile", async () => {
    const s = useUsersStore();
    api.getMe.mockResolvedValueOnce({ data: { user: { id: 1 } } });
    expect(await s.fetchProfile()).toBe(true);
    api.getMe.mockRejectedValueOnce(new Error("x"));
    expect(await s.fetchProfile()).toBe(false);
    expect(s.profile).toBeNull();
  });
  it("mutasi profil", async () => {
    const s = useUsersStore();
    api.getMe.mockResolvedValue({ data: { user: { id: 1 } } });
    api.putMe.mockResolvedValue({ message: "ok" });
    api.postMePhoto.mockResolvedValue({});
    api.putMePassword.mockRejectedValueOnce(new Error("salah"));
    expect(await s.changeProfile({})).toBe(true);
    expect(await s.changePhoto({})).toBe(true);
    expect(await s.changePassword({})).toBe(false);
    expect(s.isProfileChanged).toBe(false);
  });
});
