import api from "./api";

export const getAllJournals = () => {
  return api.get("/api/journals");
};

export const getJournalById = (id) => {
  return api.get(`/api/journals/${id}`);
};

export const createJournal = (formData) => {
  return api.post("/api/journals", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateJournal = (id, formData) => {
  return api.put(`/api/journals/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const deleteJournal = (id) => {
  return api.delete(`/api/journals/${id}`);
};