
import api from "./api";


// Get all invoices
export const getAllInvoices = () => {
  return axios.get(api/invoices);
};

// Get invoice by ID
export const getInvoiceById = (id) => {
  return axios.get(`api/invoices/${id}`);
};

// Create invoice
export const createInvoice = (invoice) => {
  return axios.post(api/invoices, invoice);
};

// Delete invoice
export const deleteInvoice = (id) => {
  return axios.delete(`api/invoices/${id}`);
};