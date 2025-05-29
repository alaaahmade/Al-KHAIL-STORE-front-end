import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'src/utils/axios';
import {
  IServiceCategory,
  CreateServiceDto,
  UpdateServiceDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateRatingDto,
  ListingInterface,
} from 'src/types/services';

interface ServiceState {
  services: ListingInterface[];
  featuredServices: ListingInterface[];
  categories: IServiceCategory[];
  currentProduct: ListingInterface | null;
  loading: boolean;
  error: string | null;
}

const initialState: ServiceState = {
  services: [],
  featuredServices: [],
  categories: [],
  currentProduct: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchServices = createAsyncThunk(
  'service/fetchServices',
  async (storeId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/v1/products/store/${storeId}`);

      return response.data.data.products;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch services');
    }
  }
);

export const fetchServiceById = createAsyncThunk(
  'service/fetchServiceById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/v1/products/${id}`);
      return response.data.data.product;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch service details');
    }
  }
);

export const fetchFeaturedServices = createAsyncThunk(
  'service/fetchFeaturedServices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/services/featured');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured services');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'service/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/v1/categories');
      return response.data.data.categories;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const createService = createAsyncThunk(
  'service/createService',
  async (data: CreateServiceDto, { rejectWithValue }) => {
    try {
      const response = await axios.post('/services', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create service');
    }
  }
);

export const updateService = createAsyncThunk(
  'service/updateService',
  async ({ id, data }: { id: string; data: UpdateServiceDto }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/services/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update service');
    }
  }
);

export const deleteService = createAsyncThunk(
  'service/deleteService',
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`/services/${id}`);
      return String(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete service');
    }
  }
);

export const createCategory = createAsyncThunk(
  'service/createCategory',
  async (data: CreateCategoryDto, { rejectWithValue }) => {
    try {
      const response = await axios.post('/services/categories', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create category');
    }
  }
);

export const updateCategory = createAsyncThunk(
  'service/updateCategory',
  async ({ id, data }: { id: number; data: UpdateCategoryDto }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/services/categories/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update category');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'service/deleteCategory',
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`/services/categories/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete category');
    }
  }
);

export const addRating = createAsyncThunk(
  'service/addRating',
  async (
    { serviceId, data }: { serviceId: number; data: CreateRatingDto },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`/services/${serviceId}/ratings`, data);
      return { serviceId, rating: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add rating');
    }
  }
);

const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Services
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Service by ID
      .addCase(fetchServiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchServiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Featured Services
      .addCase(fetchFeaturedServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedServices.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredServices = action.payload;
      })
      .addCase(fetchFeaturedServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Service
      .addCase(createService.fulfilled, (state, action) => {
        state.services.push(action.payload);
      })

      // Update Service
      .addCase(updateService.fulfilled, (state, action) => {
        const index = state.services.findIndex((service) => service.id === action.payload.id);
        if (index !== -1) {
          state.services[index] = action.payload;
        }
        if (state.currentProduct?.id === action.payload.id) {
          state.currentProduct = action.payload;
        }
      })

      // Delete Service
      .addCase(deleteService.fulfilled, (state, action) => {
        state.services = state.services.filter(
          (service) => String(service.id) !== String(action.payload)
        );
        if (String(state.currentProduct?.id) === String(action.payload)) {
          state.currentProduct = null;
        }
      })

      // Create Category
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })

      // Update Category
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex((category) => category.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })

      // Delete Category
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((category) => category.id !== action.payload);
      })

      // Add Rating
      .addCase(addRating.fulfilled, (state, action) => {
        const { serviceId, rating } = action.payload;
        const serviceIndex = state.services.findIndex(
          (service) => String(service.id) === String(serviceId)
        );
        if (serviceIndex !== -1) {
          if (!state.services[serviceIndex].ratings) {
            state.services[serviceIndex].ratings = [];
          }
          state.services[serviceIndex].ratings!.push(rating);
        }
        if (String(state.currentProduct?.id) === String(serviceId)) {
          if (!state?.currentProduct?.ratings) {
            if (state.currentProduct) {
              state.currentProduct.ratings = [];
            }
          }
          state?.currentProduct?.ratings.push(rating);
        }
      });
  },
});

export default serviceSlice.reducer;
