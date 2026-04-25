import axiosInstance from './axiosInstance';

const getPayments = async () => {
  const response = await axiosInstance.get('/payments');
  return response.data;
};

const getPaymentStats = async () => {
  const response = await axiosInstance.get('/payments/stats');
  return response.data;
};

const createPayment = async (paymentData) => {
  const response = await axiosInstance.post('/payments', paymentData);
  return response.data;
};

const paymentService = {
  getPayments,
  getPaymentStats,
  createPayment,
};

export default paymentService;
