import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'src/utils/axios';
import { _subscriptions } from 'src/_mock/_subscriptions';
import { HOST_API } from 'src/config-global';

interface SubscriptionsState {
  subscriptions: any[];
  history: object;
  viewRow: string;
  openRef: boolean;
  openSub: boolean;
  refund: object;
  cancelSub: boolean;
}

const initialState: SubscriptionsState = {
  viewRow: '',
  history: {},
  openRef:false,
  openSub: false,
  cancelSub: false,
  subscriptions:[],
  refund: {}
};

export const fetchSubscriptions = createAsyncThunk(
  'subscriptions/fetchServices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/subscriptions');
      return response.data;
      
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subscriptions  ');
    }
  }
);

export const deleteSubscriptions = createAsyncThunk(
  'subscriptions/deleteServices',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/subscriptions/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subscriptions  ');
    }
  }
);

export const fetchHistory = createAsyncThunk(
  'subscriptions/fetchHistory',
  async (id: string, { rejectWithValue }) => {
    try {
      console.log(id);
      
      const response = await axios.get(`/subscriptions/history/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subscriptions  ');
    }
  }
);

export const refundSubscription = createAsyncThunk(
  'subscriptions/refundSubscription',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/subscriptions/refund/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subscriptions  ');
    }
  }
);

const SubscriptionsSlice = createSlice({
  name: 'Subscriptions',
  initialState,
  reducers: {

    setSubscriptions : (state, action) => {
      state.subscriptions = action.payload.subscriptions;
    },
    onViewRow: (state, action) => {
      state.viewRow = action.payload.id;
    },
    closeViewRow: (state) => {
      state.viewRow = '';
    },
    openSubF: (state) => {
      state.openSub = true
    },
    closeSubF: (state) => {
      state.openSub = false
    },
    openRefF: (state) => {
      state.openRef = true
    },
    closeRefF: (state) => {
      state.openRef = false
    },
    setHistory: (state, action) => {
      state.history = action.payload.history;
    },

    openCancelSub: (state) => {
      state.cancelSub = true
    },
    CloseCancelSub: (state) => {
      state.cancelSub = false
    },
    setRefund: (state, action) => {
      state.refund = action.payload
    }
  },


  extraReducers: (builder) => {
    builder.addCase(fetchSubscriptions.fulfilled, (state, action) => {      
      state.subscriptions = action.payload;
    })
    .addCase(fetchSubscriptions.rejected, (state, action) => {
      state.subscriptions = [];
    })
    .addCase(deleteSubscriptions.fulfilled, (state, action) => {
      state.subscriptions = state.subscriptions.filter((subscription) => subscription.id !== action.payload.id);
    }
    )
    .addCase(fetchHistory.fulfilled, (state, action) => {
      state.history = action.payload;
    })
    .addCase(fetchHistory.rejected, (state, action) => {
      state.history = {};
    }
    )
    .addCase(fetchSubscriptions.pending, (state) => {
      state.subscriptions = [];
    }
    )
  },
  
});

export const {
  setSubscriptions,
  onViewRow,
  closeViewRow,
  openSubF,
  closeSubF,
  openRefF,
  closeRefF,
  setHistory,
  openCancelSub,
  CloseCancelSub,
  setRefund,
} = SubscriptionsSlice.actions;

export default SubscriptionsSlice.reducer;
