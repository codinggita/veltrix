import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import invoiceService from '../../services/invoiceService';

const initialState = {
  invoices: [],
  invoice: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const getInvoices = createAsyncThunk('invoices/getAll', async (_, thunkAPI) => {
  try {
    const response = await invoiceService.getInvoices();
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const createInvoice = createAsyncThunk('invoices/create', async (invoiceData, thunkAPI) => {
  try {
    const response = await invoiceService.createInvoice(invoiceData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateInvoiceStatus = createAsyncThunk('invoices/updateStatus', async ({ id, status }, thunkAPI) => {
  try {
    const response = await invoiceService.updateInvoiceStatus(id, status);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteInvoice = createAsyncThunk('invoices/delete', async (id, thunkAPI) => {
  try {
    await invoiceService.deleteInvoice(id);
    return id;
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const invoiceSlice = createSlice({
  name: 'invoices',
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
      .addCase(getInvoices.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getInvoices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.invoices = action.payload.data || action.payload;
      })
      .addCase(getInvoices.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createInvoice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const newInvoice = action.payload.data || action.payload;
        state.invoices.unshift(newInvoice);
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.invoices = state.invoices.filter((inv) => inv._id !== action.payload);
      });
  },
});

export const { reset } = invoiceSlice.actions;
export default invoiceSlice.reducer;
