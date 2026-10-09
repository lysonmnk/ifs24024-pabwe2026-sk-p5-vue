<script setup>
import { useRouter } from "vue-router";
import { LogIn, Lock, Mail } from "lucide-vue-next";
import { useAuthStore } from "../states/authStore.js";
import { useInput } from "../../../hooks/useInput.js";
import { showWarningDialog } from "../../../helpers/toolsHelper.js";

const router = useRouter();
const auth = useAuthStore();
const [email, onEmail] = useInput("");
const [password, onPassword] = useInput("");

async function submit() {
  if (!email.value || !password.value) {
    await showWarningDialog("Email dan kata sandi wajib diisi");
    return;
  }
  if (await auth.login(email.value, password.value)) router.replace("/");
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="submit">
    <div>
      <label
        for="login-email-input"
        class="block text-xs font-bold uppercase text-slate-700"
      >
        Alamat Email
      </label>
      <span
        class="mt-1 flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2.5"
      >
        <Mail :size="16" class="text-slate-600" aria-hidden="true" />
        <input
          id="login-email-input"
          type="email"
          :value="email"
          placeholder="nama@email.com"
          class="w-full outline-none text-sm text-slate-900 placeholder:text-slate-500"
          data-testid="login-email"
          @input="onEmail"
        />
      </span>
    </div>

    <div>
      <label
        for="login-password-input"
        class="block text-xs font-bold uppercase text-slate-700"
      >
        Kata Sandi
      </label>
      <span
        class="mt-1 flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2.5"
      >
        <Lock :size="16" class="text-slate-600" aria-hidden="true" />
        <input
          id="login-password-input"
          type="password"
          :value="password"
          placeholder="••••••••"
          class="w-full outline-none text-sm text-slate-900 placeholder:text-slate-500"
          data-testid="login-password"
          @input="onPassword"
        />
      </span>
    </div>

    <button
      id="login-submit-button"
      type="submit"
      :disabled="auth.isAuthLogin"
      class="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
    >
      <LogIn :size="16" aria-hidden="true" />
      {{ auth.isAuthLogin ? "Memproses..." : "Masuk Sekarang" }}
    </button>
  </form>
</template>
