import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'src/utils/axios';

interface CartState {
  cart: any;
  loading: boolean;
  error: any;
  order: any;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
  order: null,
};

// Cart Actions
export const fetchCart = createAsyncThunk(
  'cart/fetchCartes',
  async (cartId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/v1/carts/${cartId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cartes');
    }
  }
);

export const fetchOrder = createAsyncThunk(
  'cart/fetchOrder',
  async (sessionId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/v1/orders/session/${sessionId}`);
      return response.data.data.order;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    changeOrder: (state, action) => {
      state.order = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder;
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { changeOrder } = cartSlice.actions;
export default cartSlice.reducer;
