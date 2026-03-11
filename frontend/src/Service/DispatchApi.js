import api from "./api";

export const getAllDispatches = () => {
  return api.get("/api/dispatch");
};

export const updateDispatchStatus = (id, status) => {
  return api.put(`/api/dispatch/${id}?status=${status}`);
};


export const createDispatch = (subscriptionId) => {
  return api.post(`/api/dispatch/${subscriptionId}`);
};

export const getUserShipments = () => {
  return api.get("/api/dispatch/my-shipments");
};