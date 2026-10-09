import { apiFetch } from "../../../helpers/apiHelper.js";

export const getUsers = () => apiFetch("/users");
export const getMe = () => apiFetch("/users/me");
export const putMe = ({ name, email }) => apiFetch("/users/me", { method: "PUT", body: { name, email } });
export const postMePhoto = (file) => {
  const form = new FormData();
  form.append("photo", file);
  return apiFetch("/users/me/photo", { method: "POST", body: form, isForm: true });
};
export const putMePassword = ({ password, new_password }) =>
  apiFetch("/users/me/password", { method: "PUT", body: { password, new_password } });
