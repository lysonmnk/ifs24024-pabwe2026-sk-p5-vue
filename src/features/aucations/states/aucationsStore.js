import { ref } from "vue";
import { defineStore } from "pinia";
import * as api from "../api/aucationApi.js";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper.js";

export const useAucationsStore = defineStore("aucations", () => {
  const aucations = ref([]);
  const aucation = ref(null);
  const isAucation = ref(false);
  const isAucationAdd = ref(false);
  const isAucationAdded = ref(false);
  const isAucationChange = ref(false);
  const isAucationChanged = ref(false);
  const isAucationChangeCover = ref(false);
  const isAucationChangedCover = ref(false);
  const isAucationDelete = ref(false);
  const isAucationDeleted = ref(false);
  const isBidAdd = ref(false);
  const isBidAdded = ref(false);
  const isBidDelete = ref(false);
  const isBidDeleted = ref(false);
  const isAucationDeleteAll = ref(false);
  const isAucationDeletedAll = ref(false);

  async function fetchAucations(params = {}) {
    isAucation.value = true;
    try {
      aucations.value = (await api.getAucations(params)).data.aucations || [];
    } catch (error) {
      aucations.value = [];
      await showErrorDialog(error.message);
    } finally {
      isAucation.value = false;
    }
  }

  async function fetchAucation(id) {
    isAucation.value = true;
    try {
      aucation.value = (await api.getAucation(id)).data.aucation;
      return true;
    } catch (error) {
      aucation.value = null;
      await showErrorDialog(error.message);
      return false;
    } finally {
      isAucation.value = false;
    }
  }

  async function mutate(loading, done, fn) {
    loading.value = true;
    done.value = false;
    try {
      const res = await fn();
      done.value = true;
      await showSuccessDialog(res.message || "Berhasil");
      return true;
    } catch (error) {
      await showErrorDialog(error.message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  const addAucation = (payload) => mutate(isAucationAdd, isAucationAdded, () => api.postAucation(payload));
  const changeAucation = (id, payload) => mutate(isAucationChange, isAucationChanged, () => api.putAucation(id, payload));
  const changeCover = (id, file) => mutate(isAucationChangeCover, isAucationChangedCover, () => api.postAucationCover(id, file));
  const deleteAucation = (id) => mutate(isAucationDelete, isAucationDeleted, () => api.deleteAucation(id));
  const addBid = (id, bid) => mutate(isBidAdd, isBidAdded, () => api.postBid(id, bid));
  const deleteBid = (id) => mutate(isBidDelete, isBidDeleted, () => api.deleteBid(id));
  const deleteAllAucations = () => mutate(isAucationDeleteAll, isAucationDeletedAll, () => api.deleteAllAucations());

  return {
    aucations, aucation, isAucation,
    isAucationAdd, isAucationAdded, isAucationChange, isAucationChanged,
    isAucationChangeCover, isAucationChangedCover, isAucationDelete, isAucationDeleted,
    isBidAdd, isBidAdded, isBidDelete, isBidDeleted, isAucationDeleteAll, isAucationDeletedAll,
    fetchAucations, fetchAucation, addAucation, changeAucation, changeCover,
    deleteAucation, addBid, deleteBid, deleteAllAucations,
  };
});
