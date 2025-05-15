import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'src/utils/axios';

interface ContactState {
  chats: any[];
}

const initialState: ContactState = {
  chats:[],
};

export const fetchChats = createAsyncThunk(
  'contact-management/fetchChats',  
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/v1/chat/rooms/user/${userId}`)      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
)

export const deleteCustomer = async (id: string) => {
  const customer = await axios.delete(``,)
  return customer.data
}

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchChats.pending, (state) => {
      state.chats = [];
    })
    .addCase(fetchChats.fulfilled, (state, action) => {
      state.chats = action.payload
    })
    .addCase(fetchChats.rejected, (state) => {
      state.chats = [];
    })
    }
});


export default contactSlice.reducer;
