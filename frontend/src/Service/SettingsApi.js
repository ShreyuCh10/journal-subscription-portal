import api from "./api";

export const getSettings = () => api.get("/api/admin/settings");

export const updateSettings = (data) => api.put("/api/admin/settings", data);
