import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'src/utils/axios';

interface SellersState {
  sellers: any[];
  sellerStore: any,
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
}

const initialState: SellersState = {
  sellers:[],
  sellerStore: null,
  open: false,
  editMode: false,
  isHome: false,
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
  loadingB : false
};

export const fetchSellers = createAsyncThunk(
  'sellers/fetchSellers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/v1/sellers');
      console.log(response.data.data);
      
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
      })
      .addCase(fetchSellers.fulfilled, (state, action) => {
        state.sellers = action.payload;
        state.loadingB = false;
      })
      .addCase(fetchSellers.rejected, (state) => {
        state.loadingB = false;
      })
      .addCase(createSeller.pending, (state) => {
        state.loadingB = true;
      })
      .addCase(createSeller.fulfilled, (state, action) => {
        state.sellers = action.payload;
        state.loadingB = false;
      })
      .addCase(createSeller.rejected, (state) => {
        state.loadingB = false;
      })
      .addCase(fetchSellerStore.pending, (state) => {
        state.loadingB = true;
      })
      .addCase(fetchSellerStore.fulfilled, (state, action) => {
        state.sellerStore = action.payload;
        state.loadingB = false;
      })
      .addCase(fetchSellerStore.rejected, (state) => {
        state.loadingB = false;
      });
  }
});

export const {  setSellers, openCreateDialog,setLadingB, closeCreateDialog, setEditMode,changeIsHome, changeNewSeller } = SellersSlice.actions;

export default SellersSlice.reducer;
