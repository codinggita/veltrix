import axiosInstance from './axiosInstance';

const getNotifications = () => {
  return axiosInstance.get('/notifications');
};

const markAllAsRead = () => {
  return axiosInstance.put('/notifications/read');
};

const markAsRead = (id) => {
  return axiosInstance.put(`/notifications/${id}/read`);
};

const notificationService = {
  getNotifications,
  markAllAsRead,
  markAsRead,
};

export default notificationService;
