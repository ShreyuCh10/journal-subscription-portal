import api from "./api";

/* CREATE USER */
export const createUser = (userData) => api.post("/api/users", userData);

/* GET CURRENT USER */
export const getCurrentUser = () => api.get("/api/users/me");

/* GET ALL USERS (ADMIN) */
export const getAllUsers = () => api.get("/api/users");

/* GET INTERESTED USERS */
export const getInterestedUsers = () => api.get("/api/users/interested");

/* GET NOT SUBSCRIBED USERS */
export const getNotSubscribedUsers= () => api.get("/api/users/not-subscribed");