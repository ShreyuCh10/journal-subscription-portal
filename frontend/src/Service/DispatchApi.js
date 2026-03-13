 import api from "./api";

export const getAllDispatches = () => api.get("/api/dispatches");

export const getDispatchCounts = () => api.get("/api/dispatches/counts");

export const updateDispatchStatus = (id, status) =>
  api.put(`/api/dispatches/${id}/status?status=${status}`);

export const createDispatch = (data) => api.post("/api/dispatches", data);

export const getUserShipments = () => api.get("/api/dispatches/my");
