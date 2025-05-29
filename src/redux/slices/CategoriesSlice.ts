import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'src/utils/axios';

export const gitCategories = async () => {
  const response = await axios.get('/v1/categories/');
  return response.data.data.categories;
};

interface CategoriesState {
  categories: any[]; // Replace 'any[]' with a specific type if known
  isLoading: boolean;
  ladingB: boolean;
  error: any;
  newCategory: {
    id?: string;
    name: string;
    icon: File | string | null;
    description: string;
  };
  open: boolean;
  editMode?: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  ladingB: false,
  isLoading: false,
  error: {},
  newCategory: {
    name: '',
    icon: null,
    description: '',
  },
  open: false,
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/v1/categories/');
      return response.data.data.categories;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

const CategoriesSlice = createSlice({
  name: 'Categories',
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = [...action.payload];
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    changeNewCat: (state, action) => {
      const {
        field,
        value,
      }: { field: keyof CategoriesState['newCategory']; value: string | File | null } =
        action.payload;
      if (field === 'icon' && (value === null || value instanceof File)) {
        state.newCategory[field] = value;
      } else if (field === 'icon' && typeof value === 'string') {
        state.newCategory[field] = value;
      } else if (field !== 'icon' && typeof value === 'string') {
        state.newCategory[field] = value;
      }
    },
    openCreateDialog: (state) => {
      state.open = true;
    },
    closeCreateDialog: (state) => {
      state.open = false;
    },
    setLadingB: (state, action) => {
      state.ladingB = action.payload;
    },
    setEditMode: (state, action) => {
      state.editMode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setCategories,
  setError,
  setIsLoading,
  changeNewCat,
  openCreateDialog,
  closeCreateDialog,
  setEditMode,
  setLadingB,
} = CategoriesSlice.actions;

export default CategoriesSlice.reducer;
