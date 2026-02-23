import axios from "axios";

const BASE_URL = "http://localhost:8080/api/receipts";

import api from "./api";

// Get receipt by payment ID
export const getReceiptByPayment = (paymentId) => {
  return axios.get(`api/receipts/payment/${paymentId}`);
};