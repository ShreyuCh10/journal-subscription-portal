import api from "./api";

// ================== GET RECEIPT DETAILS ==================
export const getReceiptByPaymentId = (paymentId) => {
  return api.get(`/api/receipts/payment/${paymentId}`);
};

// ================== DOWNLOAD RECEIPT (SECURE) ==================
export const downloadReceiptByPaymentId = (paymentId) => {
  return api.get(`/api/receipts/download/payment/${paymentId}`, {
    responseType: "blob",
  });
};