import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'src/utils/axios';
import { HOST_API } from 'src/config-global';

interface SignDialogState {
  open: boolean;
  customers: any[];
  openStatus: boolean;
  status: string;
  code: string
}

const initialState: SignDialogState = {
  open: false,
  openStatus: false,
  customers:[],
  status: '',
  code: ''
};

export const gitCustomers = async () => {
  const customer = await axios.get(`${HOST_API}users/customers`,) 
  console.log(customer, 'fetch');
  
  return customer.data.users
}

export const fetchCustomers = createAsyncThunk(
  'customer/fetchCustomers',  
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${HOST_API}/users/customers`,)
      return response.data.users;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
)

export const deleteCustomer = async (id: string) => {
  const customer = await axios.delete(`${HOST_API}users/customers/${id}`,)
  return customer.data
}

const signDialogSlice = createSlice({
  name: 'signDialog',
  initialState,
  reducers: {
    openDialog: (state) => {
      state.open = true; 
    },
    closeDialog: (state) => {
      state.open = false; 
    },
    changeCode : (state, action) => {      
      state.code = action.payload.code;
    },
    openStatus: (state) => {
      state.openStatus = true;
    },
    closeStatus : (state) => {
      state.openStatus = false;
    },

    changeStatus : (state, action) => {
      state.status = action.payload.status;
    },

    setCustomer : (state, action) => {
      state.customers = action.payload.customers;
    }
    
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCustomers.pending, (state) => {
      state.customers = [];
    })
    .addCase(fetchCustomers.fulfilled, (state, action) => {
      console.log(action.payload.map((user: any) => ({
        id: user.id || '',
        name: user.fullName || '',
        avatarUrl: user.profilePicture || '',
        phoneNumber: user.phoneNumber || '+1234567890123',
        email: user.email || '',
        status: user.status ,
        createdAt: user.createdAt,
        dateOfBirth: user.dateOfBirth || '',
        bookings: user.bookings,
        interests: user.interests,
        credits: user.credits || 0,
      })));
      
      state.customers = action.payload.map((user: {
        credits: number;
        interests: any;
        bookings: any;
        roles: any;
        dateOfBirth: string;
        createdAt: string;
        id: string;
        fullName: string;
        profilePicture: string;
        phoneNumber: string;
        email: string;
        status: boolean; }) => ({
        id: user.id || '',
        name: user.fullName || '',
        avatarUrl: user.profilePicture || '',
        phoneNumber: user.phoneNumber || '+1234567890123',
        email: user.email || '',
        status: user.status ,
        createdAt: user.createdAt,
        dateOfBirth: user.dateOfBirth || '',
        bookings: user.bookings,
        interests: user.interests,
        credits: user.credits || 0,
      }));
    })
    .addCase(fetchCustomers.rejected, (state) => {
      state.customers = [];
    })
    }
});

export const { openDialog, closeDialog, changeCode, openStatus, closeStatus, changeStatus, setCustomer } = signDialogSlice.actions;

export default signDialogSlice.reducer;
