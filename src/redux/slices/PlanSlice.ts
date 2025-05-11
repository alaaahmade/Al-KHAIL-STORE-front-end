import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'src/utils/axios';

interface PlanSliceState {
  plans: any[];
  open: boolean;
  isHome: boolean;
  newPlan: {
    name: string;
    credits: string;
    amountJOD: string;
    id?: string
  }
  editMode: boolean
  loadingB: boolean
  error: {
    name: string;
    credits: string;
    amountJOD: string;
    id: string;
    message: string;
  }
}

const initialState: PlanSliceState = {
  plans:[],
  open: false,
  editMode: false,
  isHome: false,
  newPlan: {
    name: '',
    credits: '',
    amountJOD: '',
    id: ''
  },
  loadingB : false,
  error: {
    name: '',
    credits: '',
    amountJOD: '',
    id: '',
    message: '',
  },
};

export const fetchPlans = createAsyncThunk(
  'subscriptions/plans/fetchPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/subscriptions/plans`);
       return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add rating');
    }
  }
);

export const deletePlan = createAsyncThunk(
  'subscriptions/plans/deletePlan',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/subscriptions/plans/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete plan');
    }
  }
);

const PlansSlice = createSlice({
  name: 'Plans',
  initialState,
  reducers: {
    setPlans : (state, action) => {
      state.plans = action.payload;
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
    changeNewPlan: (state, action) => {
      const { field, value }: { field: keyof PlanSliceState['newPlan']; value: string } = action.payload;
      state.newPlan[field] = value;  
    },

    setEditMode: (state, action) => {
      state.editMode = action.payload;
    },
    setLadingB: (state, action) => {
      state.loadingB = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.pending, (state) => {
        state.loadingB = true;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.plans = action.payload;
        state.loadingB = false;
      })
      .addCase(fetchPlans.rejected, (state) => {
        state.loadingB = false;
      })
      .addCase(deletePlan.pending, (state) => {
        state.loadingB = true;
      })
      .addCase(deletePlan.fulfilled, (state, action) => {
        state.plans = state.plans.filter((plan) => plan.id !== action.payload.id);
        state.loadingB = false;
      }
      )
      .addCase(deletePlan.rejected, (state) => {
        state.loadingB = false;
      }
      );
  },
});

export const {  setPlans, setError, openCreateDialog,setLadingB, closeCreateDialog, setEditMode,changeIsHome, changeNewPlan } = PlansSlice.actions;

export default PlansSlice.reducer;
