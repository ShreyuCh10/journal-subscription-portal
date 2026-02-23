import axios from "axios";

const BASE_URL = "http://localhost:8080/api/subscriptions";

import api from "./api";

// Get all subscriptions
export const getAllSubscriptions = () => {
  return axios.get(api/subscriptions);
};

// Get subscription by ID
export const getSubscriptionById = (id) => {
  return axios.get(`api/subscriptions/${id}`);
};

// Create subscription
export const createSubscription = (subscription) => {
  return axios.post(api/subscriptions, subscription);
};

// Cancel subscription
export const cancelSubscription = (id) => {
  return axios.put(`api/subscriptions/${id}/cancel`);
};