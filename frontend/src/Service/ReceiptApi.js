import api from "./api";

// Get receipt details using paymentId
export const getReceiptByPaymentId = (paymentId) => {
  return api.get(`/api/receipts/payment/${paymentId}`);
};

// Download receipt using receiptId
export const downloadReceipt = (receiptId) => {
  return api.get(`/api/receipts/download/${receiptId}`, {
    responseType: "blob",
  });
};

// 🔥 Download receipt directly using paymentId (RECOMMENDED)
export const downloadReceiptByPaymentId = (paymentId) => {
  return api.get(`/api/receipts/download/payment/${paymentId}`, {
    responseType: "blob",
  });
};