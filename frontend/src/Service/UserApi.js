import api from "./api";

/* ===============================
   GET ALL USERS
================================= */
export const getAllUsers = () => {
  return api.get("/api/users");
};

/* ===============================
   GET USER BY ID
================================= */
export const getUserById = (id) => {
  return api.get(`/api/users/${id}`);
};

/* ===============================
   CREATE USER
================================= */
export const createUser = (userData) => {
  return api.post("/api/users", userData);
};

/* ===============================
   UPDATE USER
================================= */
export const updateUser = (id, userData) => {
  return api.put(`/api/users/${id}`, userData);
};

/* ===============================
   DELETE USER
================================= */
export const deleteUser = (id) => {
  return api.delete(`/api/users/${id}`);
};

/* ===============================
   GET CURRENT LOGGED-IN USER
================================= */
export const getCurrentUser = () => {
  return api.get("/api/users/me");
};