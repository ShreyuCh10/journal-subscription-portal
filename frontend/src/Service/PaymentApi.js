

import api from "./api";

export const processPayment = (invoiceId, method) => {
  return api.post(`api/payments}/${invoiceId}`, {
    method: method
  });
};

export const getPaymentByInvoice = (invoiceId) => {
  return api.get(`api/payments/invoice/${invoiceId}`);
};