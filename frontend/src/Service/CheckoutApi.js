import api from "./api";

export const processCheckout = (data) => {
  return api.post("/api/checkout", data);
};

export const createRazorpayOrder = (data) => {
  return api.post("/api/checkout/create-order", data);
};

export const verifyRazorpayPayment = (data) => {
  return api.post("/api/checkout/verify-payment", data);
};