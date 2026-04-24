import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import userReducer from './features/userSlice';
import invoiceReducer from './features/invoiceSlice';
import clientReducer from './features/clientSlice';
import paymentReducer from './features/paymentSlice';
import uiReducer from './features/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    invoice: invoiceReducer,
    client: clientReducer,
    payment: paymentReducer,
    ui: uiReducer,
  },
});
