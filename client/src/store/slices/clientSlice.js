import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import clientService from '../../services/clientService';

const initialState = {
  clients: [],
  client: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const getClients = createAsyncThunk('clients/getAll', async (_, thunkAPI) => {
  try {
    return await clientService.getClients();
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const getClient = createAsyncThunk('clients/get', async (id, thunkAPI) => {
  try {
    return await clientService.getClient(id);
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const createClient = createAsyncThunk('clients/create', async (clientData, thunkAPI) => {
  try {
    return await clientService.createClient(clientData);
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateClient = createAsyncThunk('clients/update', async ({ id, data }, thunkAPI) => {
  try {
    return await clientService.updateClient({ id, data });
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteClient = createAsyncThunk('clients/delete', async (id, thunkAPI) => {
  try {
    return await clientService.deleteClient(id);
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearClient: (state) => {
      state.client = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getClients.pending, (state) => { state.isLoading = true; })
      .addCase(getClients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.clients = action.payload;
      })
      .addCase(getClients.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createClient.pending, (state) => { state.isLoading = true; })
      .addCase(createClient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.clients.unshift(action.payload);
      })
      .addCase(createClient.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateClient.pending, (state) => { state.isLoading = true; })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.clients = state.clients.map((c) => c._id === action.payload._id ? action.payload : c);
        state.client = action.payload;
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteClient.pending, (state) => { state.isLoading = true; })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // The backend returns { success: true, data: {} } where data is empty usually, or we can just filter by id
        // Wait, action.meta.arg contains the `id` that was passed to the thunk!
        state.clients = state.clients.filter((c) => c._id !== action.meta.arg);
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearClient } = clientSlice.actions;
export default clientSlice.reducer;
