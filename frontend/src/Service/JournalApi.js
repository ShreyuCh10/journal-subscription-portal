import api from "./api";

export const getAllJournals = () => {
  return api.get("/api/journals");
};

export const getJournalById = (id) => {
  return api.get(`/api/journals/${id}`);
};

export const createJournal = (journal) => {
  return api.post("/api/journals", journal);
};

export const updateJournal = (id, journal) => {
  return api.put(`/api/journals/${id}`, journal);
};

export const deleteJournal = (id) => {
  return api.delete(`/api/journals/${id}`);
};