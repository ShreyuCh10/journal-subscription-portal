import api from "./api";


export const createUser = (userData) => api.post("/api/users", userData);

export const getCurrentUser = () => api.get("/api/users/me");

export const getAllUsers = () => api.get("/api/users");

export const getInterestedUsers = () => api.get("/api/users/interested");


export const getNotSubscribedUsers= () => api.get("/api/users/not-subscribed");

export const updateCurrentUser = (userData) => api.put("/api/users/profile", userData);