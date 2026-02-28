
import api from "./api";

// ✅ Get invoice by id
export const getInvoiceById = (id) => {
  return api.get(`/api/invoices/${id}`);
};

// ✅ Create invoice for a subscription
export const createInvoiceForSubscription = (subscriptionId, amount) => {
  return api.post(`/api/invoices/subscription/${subscriptionId}?amount=${amount}`);
};