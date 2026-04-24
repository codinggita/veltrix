import axiosInstance from './axiosInstance';

const getInvoices = async () => {
  const response = await axiosInstance.get('/invoices');
  return response.data;
};

const getInvoice = async (id) => {
  const response = await axiosInstance.get(`/invoices/${id}`);
  return response.data;
};

const createInvoice = async (invoiceData) => {
  const response = await axiosInstance.post('/invoices', invoiceData);
  return response.data;
};

const updateInvoiceStatus = async (id, status) => {
  const response = await axiosInstance.patch(`/invoices/${id}/status`, { status });
  return response.data;
};

const deleteInvoice = async (id) => {
  const response = await axiosInstance.delete(`/invoices/${id}`);
  return response.data;
};

const invoiceService = {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoiceStatus,
  deleteInvoice,
};

export default invoiceService;
