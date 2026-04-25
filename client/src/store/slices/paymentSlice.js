import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import paymentService from '../../services/paymentService';

const initialState = {
  payments: [],
  stats: {
    totalCollected: 0,
    pendingProcessing: 0,
    failedTransactions: 0
  },
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const getPayments = createAsyncThunk('payments/getAll', async (_, thunkAPI) => {
  try {
    const response = await paymentService.getPayments();
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const getPaymentStats = createAsyncThunk('payments/getStats', async (_, thunkAPI) => {
  try {
    const response = await paymentService.getPaymentStats();
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Fix 13: Added createPayment thunk
export const createPayment = createAsyncThunk('payments/create', async (paymentData, thunkAPI) => {
  try {
    const response = await paymentService.createPayment(paymentData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPayments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPayments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.payments = action.payload.data || action.payload;
      })
      .addCase(getPayments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getPaymentStats.fulfilled, (state, action) => {
        state.stats = action.payload.data || action.payload;
      })
      .addCase(createPayment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const newPayment = action.payload.data || action.payload;
        state.payments.unshift(newPayment);
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = paymentSlice.actions;
export default paymentSlice.reducer;
