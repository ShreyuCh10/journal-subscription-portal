import api from "./api";

export const getReceiptByPaymentId = (paymentId) => {
  return api.get(`/api/receipts/payment/${paymentId}`);
};

export const downloadReceipt = (receiptId) => {
  return api.get(`/api/receipts/download/${receiptId}`, {
    responseType: "blob",
  });
};