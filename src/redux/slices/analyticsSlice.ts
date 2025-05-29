import axiosInstance from '@/utils/axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface AnalyticsState {
  analytics: any;
  loading: boolean;
  error: any;
}

const initialState: AnalyticsState = {
  analytics: {},
  loading: false,
  error: null,
};

export const fetchAnalyticsForAdmin = createAsyncThunk(
  'analytics/fetchAnalyticsForAdmin',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/v1/sellers/dashboard/admin');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch analytics for admin'
      );
    }
  }
);

export const fetchAnalyticsForSeller = createAsyncThunk(
  'analytics/fetchAnalyticsForSeller',
  async (store: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/v1/sellers/dashboard/${store}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || `Failed to fetch analytics for seller ${store}`
      );
    }
  }
);

const AnalyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalyticsForAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAnalyticsForAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchAnalyticsForAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAnalyticsForSeller.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAnalyticsForSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchAnalyticsForSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default AnalyticsSlice.reducer;
