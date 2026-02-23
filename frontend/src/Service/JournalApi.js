import axios from "axios";

const BASE_URL = "http://localhost:8080/api/journals";

import api from "./api";

// Get all journals
export const getAllJournals = () => {
  return axios.get(api/journals);
};

// Get journal by ID
export const getJournalById = (id) => {
  return axios.get(`api/journals/${id}`);
};

// Create journal
export const createJournal = (journal) => {
  return axios.post(api/journals, journal);
};

// Delete journal
export const deleteJournal = (id) => {
  return axios.delete(`api/journals/${id}`);
};