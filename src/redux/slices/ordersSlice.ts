import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'src/utils/axios';

interface OrdersState {
  orders: any[];
  ordersTypes: any[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  ordersTypes: [],
  loading: false,
  error: null,
};


// Orders Actions
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/v1/orders');
      return response.data.data.orders;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const createOrders = createAsyncThunk(
  'orders/createOrders',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.post('/v1/orders', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create orders');
    }
  }
);

export const updateOrders = createAsyncThunk(
  'orders/updateOrders',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/v1/orders/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update orders');
    }
  }
);

export const deleteOrders = createAsyncThunk(
  'orders/deleteOrders',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/v1/orders/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete orders');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createOrders.fulfilled, (state, action) => {
        state.orders.push(action.payload);
      })
      .addCase(updateOrders.fulfilled, (state, action) => {
        const index = state.orders.findIndex((orders) => orders.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(deleteOrders.fulfilled, (state, action) => {
        state.orders = state.orders.filter((orders) => orders.id !== action.payload);
      });
  },
});

export default ordersSlice.reducer;
