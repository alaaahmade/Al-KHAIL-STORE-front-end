import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'src/utils/axios';

interface SellersState {
  sellers: any[];
  error: string | null;
  shop: any;
  sellerStore: any,
  products: any[]
  open: boolean;
  isHome: boolean;
  newSeller: {
    firstName: string,
    lastName: string,
    email: string,
    storeDescription: string,
    contactNumber: string,
    storeAddress: string,
    storeLogo: string,
    storeCategory: string,
    password: string,
  }
  editMode: boolean
  loadingB: boolean
  stores: any []
  featuredProducts: any[]
}

const initialState: SellersState = {
  sellers:[],
  stores: [],
  featuredProducts: [],
  sellerStore: null,
  shop: null,
  open: false,
  editMode: false,
  isHome: false,
  products: [],
  newSeller: {
    firstName: '',
    lastName: '',
    email: '',
    storeDescription: '',
    contactNumber: '',
    storeAddress: '',
    storeLogo: '',
    storeCategory: '',
    password: '',
  },
  loadingB : false,
  error: null
};

export const fetchSellers = createAsyncThunk(
  'sellers/fetchSellers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/v1/sellers');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sellers');
    }
  }
)

export const createSeller = createAsyncThunk(
  'sellers/createSeller',
  async (data: any, { rejectWithValue }) => {
    try {
      const newSeller = await axios.post('/v1/sellers', data);
      const response = await axios.get('/v1/sellers');
      
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create seller');
    }
  }
)

export const fetchShopeProfile = createAsyncThunk(
  'sellers/fetchShopeProfile',
  async (shopId: string, {rejectWithValue}) => {
    try {
      const response = await axios.get(`/v1/stores/${shopId}`);      
      return response.data.data.store;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch shop profile');
    }
  }
)

export const fetchSellerStore = createAsyncThunk(
  'sellers/fetchSellerStore',
  async (userId, { rejectWithValue }) => {
    try {
      const response =await axios.get(`/v1/sellers/${userId}`)      
      return response.data.data.store;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch seller store');
    }
  }
)

export const fetchStores = createAsyncThunk(
  'sellers/fetchStores',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/v1/stores');      
      return response.data.data.stores;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stores');
    }
  }
)

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/v1/products/featured');
      return response.data.data.products;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured products');
    }
  }
);

export const fetchAllProducts = createAsyncThunk(
  'products/fetchAllProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/v1/products');
      return response.data.data.products;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured products');
    }
  }
);

const SellersSlice = createSlice({
  name: 'Sellers',
  initialState,
  reducers: {
    setSellers : (state, action) => {
      state.sellers = action.payload;
    },

    openCreateDialog: (state) => {
      state.open = true
    },
    closeCreateDialog: (state) => {
      state.open = false
    },
    changeIsHome: (state, action) => {
      state.isHome = action.payload
    },
    changeNewSeller: (state, action) => {
      const { field, value }: { field: keyof SellersState['newSeller']; value: string } = action.payload;
      state.newSeller[field] = value;  
    },

    setEditMode: (state, action) => {
      state.editMode = action.payload;
    },
    setLadingB: (state, action) => {
      state.loadingB = action.payload;
    },
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellers.pending, (state) => {
        state.loadingB = true;
        state.error = null
      })
      .addCase(fetchSellers.fulfilled, (state, action) => {
        state.sellers = action.payload;
        state.loadingB = false;
        state.error = null

      })
      .addCase(fetchSellers.rejected, (state) => {
        state.loadingB = false;
        state.error = 'Failed to fetch sellers'

      })
      .addCase(createSeller.pending, (state) => {
        state.loadingB = true;
        state.error = null

      })
      .addCase(createSeller.fulfilled, (state, action) => {
        state.sellers = action.payload;
        state.loadingB = false;
        state.error = null

      })
      .addCase(createSeller.rejected, (state) => {
        state.loadingB = false;
        state.error = 'Failed to create seller'
      })
      .addCase(fetchSellerStore.pending, (state) => {
        state.loadingB = true;
        state.error = null

      })
      .addCase(fetchSellerStore.fulfilled, (state, action) => {
        state.sellerStore = action.payload;
        state.loadingB = false;
        state.error = null

      })
      .addCase(fetchSellerStore.rejected, (state) => {
        state.loadingB = false;
        state.error = 'Failed to fetch seller store'
      })
      .addCase(fetchShopeProfile.pending, (state) => {
        state.loadingB = true;
        state.error = null

      })
      .addCase(fetchShopeProfile.fulfilled, (state, action) => {
        state.shop = action.payload;
        state.loadingB = false;
        state.error = null

      })
      .addCase(fetchShopeProfile.rejected, (state) => {
        state.loadingB = false;
        state.error = 'Failed to fetch shope profile'
      })
      .addCase(fetchStores.pending, (state) => {
        state.loadingB = true;
        state.error = null

      })
      .addCase(fetchStores.fulfilled, (state, action) => {
        state.stores = action.payload;
        state.loadingB = false;
        state.error = null

      })
      .addCase(fetchStores.rejected, (state) => {
        state.loadingB = false;
        state.error = 'Failed to fetch stores'
      })
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.loadingB = true;
        state.error = null

      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredProducts = action.payload;
        state.loadingB = false;
        state.error = null

      })
      .addCase(fetchFeaturedProducts.rejected, (state) => {
        state.loadingB = false;
        state.error = 'Failed to fetch featured products'
      })
      .addCase(fetchAllProducts.pending, (state) => {
        state.loadingB = true;
        state.error = null

      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loadingB = false;
        state.error = null

      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.loadingB = false;
        state.error = 'Failed to fetch all products'
      })

  }
});

export const {  setSellers, openCreateDialog,setLadingB, closeCreateDialog, setEditMode,changeIsHome, changeNewSeller } = SellersSlice.actions;

export default SellersSlice.reducer;
