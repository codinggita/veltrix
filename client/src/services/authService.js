import axiosInstance from './axiosInstance';

const register = async (userData) => {
  const response = await axiosInstance.post('/auth/register', userData);
  if (response.data.data?.token) {
    localStorage.setItem('veltrix_token', response.data.data.token);
  }
  return response.data;
};

const login = async (userData) => {
  const response = await axiosInstance.post('/auth/login', userData);
  if (response.data.data?.token) {
    localStorage.setItem('veltrix_token', response.data.data.token);
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('veltrix_token');
};

const getMe = async () => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getMe,
};

export default authService;
