import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { postLogin, postRegister } from "../api/authApi.js";
import { getAccessToken, putAccessToken, removeAccessToken } from "../../../helpers/apiHelper.js";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper.js";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(getAccessToken());
  const isAuthLogin = ref(false);
  const isAuthRegister = ref(false);
  const isAuthLogout = ref(false);
  const isLoggedIn = computed(() => Boolean(token.value));

  async function login(email, password) {
    isAuthLogin.value = true;
    try {
      const res = await postLogin({ email, password });
      putAccessToken(res.data.token);
      token.value = res.data.token;
      await showSuccessDialog(res.message || "Login berhasil");
      return true;
    } catch (error) {
      await showErrorDialog(error.message);
      return false;
    } finally {
      isAuthLogin.value = false;
    }
  }

  async function register(name, email, password) {
    isAuthRegister.value = true;
    try {
      const res = await postRegister({ name, email, password });
      await showSuccessDialog(res.message || "Registrasi berhasil, silakan masuk");
      return true;
    } catch (error) {
      await showErrorDialog(error.message);
      return false;
    } finally {
      isAuthRegister.value = false;
    }
  }

  function logout() {
    isAuthLogout.value = true;
    removeAccessToken();
    token.value = null;
    isAuthLogout.value = false;
  }

  return { token, isLoggedIn, isAuthLogin, isAuthRegister, isAuthLogout, login, register, logout };
});
