const TOKEN_KEY = "accessToken";

export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);
export const putAccessToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeAccessToken = () => localStorage.removeItem(TOKEN_KEY);

/**
 * Wrapper fetch ke REST API Delcom.
 * @param {string} path  contoh: "/auth/login"
 * @param {{method?:string, params?:object, body?:object|FormData, isForm?:boolean}} opts
 */
export async function apiFetch(path, { method = "GET", params, body, isForm = false } = {}) {
  const url = new URL(`${DELCOM_BASEURL}${path}`);
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  const headers = {};
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload;
  if (body) {
    if (isForm) {
      payload = body;
    } else {
      headers["Content-Type"] = "application/json";
      payload = JSON.stringify(body);
    }
  }

  const response = await fetch(url.toString(), { method, headers, body: payload });
  const json = await response.json();
  if (!response.ok || json.success === false) {
    throw new Error(json.message || "Terjadi kesalahan pada server");
  }
  return json;
}
