import { apiFetch } from "../../../helpers/apiHelper.js";

export const getAucations = (params) => apiFetch("/aucations", { params });
export const getAucation = (id) => apiFetch(`/aucations/${id}`);
export const postAucation = ({ title, description, start_bid, closed_at }) =>
  apiFetch("/aucations", { method: "POST", body: { title, description, start_bid, closed_at } });
export const putAucation = (id, { title, description, start_bid, closed_at }) =>
  apiFetch(`/aucations/${id}`, { method: "PUT", body: { title, description, start_bid, closed_at } });
export const postAucationCover = (id, file) => {
  const form = new FormData();
  form.append("cover", file);
  return apiFetch(`/aucations/${id}/cover`, { method: "POST", body: form, isForm: true });
};
export const deleteAucation = (id) => apiFetch(`/aucations/${id}`, { method: "DELETE" });
export const postBid = (id, bid) => apiFetch(`/aucations/${id}/bids`, { method: "POST", body: { bid } });
export const deleteBid = (id) => apiFetch(`/aucations/${id}/bids`, { method: "DELETE" });
export const deleteAllAucations = () => apiFetch("/aucations", { method: "DELETE" });
