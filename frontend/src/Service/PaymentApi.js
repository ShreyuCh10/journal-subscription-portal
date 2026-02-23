import axios from "axios";

const BASE_URL = "http://localhost:8080/api/payments";

import api from "./api";

// Process payment
export const processPayment = (invoiceId, method) => {
  return axios.post(`api/payments}/${invoiceId}`, {
    method: method
  });
};

// Get payment by invoice
export const getPaymentByInvoice = (invoiceId) => {
  return axios.get(`api/payments/invoice/${invoiceId}`);
};