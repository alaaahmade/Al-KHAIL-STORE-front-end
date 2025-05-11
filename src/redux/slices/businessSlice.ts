import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'src/utils/axios';
import { IBusinessType, IBusiness } from 'src/types/business';

interface BusinessState {
  businesses: IBusiness[];
  businessTypes: IBusinessType[];
  loading: boolean;
  error: string | null;
}

const initialState: BusinessState = {
  businesses: [],
  businessTypes: [],
  loading: false,
  error: null,
};

// Business Types Actions
export const fetchBusinessTypes = createAsyncThunk(
  'business/fetchBusinessTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/business-types');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch business types');
    }
  }
);

export const createBusinessType = createAsyncThunk(
  'business/createBusinessType',
  async (data: Partial<IBusinessType>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/business-types', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create business type');
    }
  }
);

export const updateBusinessType = createAsyncThunk(
  'business/updateBusinessType',
  async ({ id, data }: { id: number; data: Partial<IBusinessType> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/business-types/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update business type');
    }
  }
);

export const deleteBusinessType = createAsyncThunk(
  'business/deleteBusinessType',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/business-types/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete business type');
    }
  }
);

// Business Actions
export const fetchBusinesses = createAsyncThunk(
  'business/fetchBusinesses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/businesses');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch businesses');
    }
  }
);

export const createBusiness = createAsyncThunk(
  'business/createBusiness',
  async (data: Partial<IBusiness>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/businesses', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create business');
    }
  }
);

export const updateBusiness = createAsyncThunk(
  'business/updateBusiness',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/businesses/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update business');
    }
  }
);

export const deleteBusiness = createAsyncThunk(
  'business/deleteBusiness',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/businesses/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete business');
    }
  }
);

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Business Types
      .addCase(fetchBusinessTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBusinessTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.businessTypes = action.payload;
      })
      .addCase(fetchBusinessTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createBusinessType.fulfilled, (state, action) => {
        state.businessTypes.push(action.payload);
      })
      .addCase(updateBusinessType.fulfilled, (state, action) => {
        const index = state.businessTypes.findIndex((type) => type.id === action.payload.id);
        if (index !== -1) {
          state.businessTypes[index] = action.payload;
        }
      })
      .addCase(deleteBusinessType.fulfilled, (state, action) => {
        state.businessTypes = state.businessTypes.filter((type) => type.id !== action.payload);
      })
      // Businesses
      .addCase(fetchBusinesses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBusinesses.fulfilled, (state, action) => {
        state.loading = false;
        state.businesses = action.payload;
      })
      .addCase(fetchBusinesses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createBusiness.fulfilled, (state, action) => {
        state.businesses.push(action.payload);
      })
      .addCase(updateBusiness.fulfilled, (state, action) => {
        const index = state.businesses.findIndex((business) => business.id === action.payload.id);
        if (index !== -1) {
          state.businesses[index] = action.payload;
        }
      })
      .addCase(deleteBusiness.fulfilled, (state, action) => {
        state.businesses = state.businesses.filter((business) => business.id !== action.payload);
      });
  },
});

export default businessSlice.reducer;
