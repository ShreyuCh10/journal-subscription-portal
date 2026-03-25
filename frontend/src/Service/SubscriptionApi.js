import api from "./api";

export const getAllSubscriptions = async () => {
  return api.get("/api/subscriptions");
};

export const getSubscriptionById = (id) => {
  return api.get(`/api/subscriptions/${id}`);
};

export const createSubscription = (subscription) => {
  return api.post("/api/subscriptions", subscription);
};

export const fetchUserSubscriptions = () => {
  return api.get(`/api/subscriptions/my`);
};

export const cancelSubscription = (id) => {
  return api.put(`/api/subscriptions/cancel/${id}`);
};