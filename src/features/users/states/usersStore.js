import { ref } from "vue";
import { defineStore } from "pinia";
import { getMe, getUsers, postMePhoto, putMe, putMePassword } from "../api/userApi.js";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper.js";

export const useUsersStore = defineStore("users", () => {
  const users = ref([]);
  const user = ref(null);
  const profile = ref(null);
  const isUsers = ref(false);
  const isProfile = ref(false);
  const isProfileChange = ref(false);
  const isProfileChanged = ref(false);

  async function fetchUsers() {
    isUsers.value = true;
    try {
      users.value = (await getUsers()).data.users || [];
    } catch (error) {
      await showErrorDialog(error.message);
    } finally {
      isUsers.value = false;
    }
  }

  async function fetchProfile() {
    isProfile.value = true;
    try {
      profile.value = (await getMe()).data.user;
      return true;
    } catch (error) {
      profile.value = null;
      return false;
    } finally {
      isProfile.value = false;
    }
  }

  async function mutate(fn) {
    isProfileChange.value = true;
    isProfileChanged.value = false;
    try {
      const res = await fn();
      isProfileChanged.value = true;
      await showSuccessDialog(res.message || "Berhasil diperbarui");
      await fetchProfile();
      return true;
    } catch (error) {
      await showErrorDialog(error.message);
      return false;
    } finally {
      isProfileChange.value = false;
    }
  }

  const changeProfile = (payload) => mutate(() => putMe(payload));
  const changePhoto = (file) => mutate(() => postMePhoto(file));
  const changePassword = (payload) => mutate(() => putMePassword(payload));

  return { users, user, profile, isUsers, isProfile, isProfileChange, isProfileChanged, fetchUsers, fetchProfile, changeProfile, changePhoto, changePassword };
});
