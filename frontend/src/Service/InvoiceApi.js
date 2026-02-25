
import api from "./api";



export const getAllInvoices = () => {
  return api.get(api/invoices);
};


export const getInvoiceById = (id) => {
  return api.get(`api/invoices/${id}`);
};


export const createInvoice = (invoice) => {
  return api.post(api/invoices, invoice);
};


export const deleteInvoice = (id) => {
  return api.delete(`api/invoices/${id}`);
};