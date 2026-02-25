

import api from "./api";

// Get receipt by payment ID
export const getReceiptByPayment = (paymentId) => {
  return api.get(`api/receipts/payment/${paymentId}`);
};