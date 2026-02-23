import api from "./api";

// Get all journals
export const getAllJournals = () => {
  return api.get("/api/journals");
};

// Get journal by ID
export const getJournalById = (id) => {
  return api.get(`/api/journals/${id}`);
};

// Create journal
export const createJournal = (journal) => {
  return api.post("/api/journals", journal);
};

// Delete journal
export const deleteJournal = (id) => {
  return api.delete(`/api/journals/${id}`);
};