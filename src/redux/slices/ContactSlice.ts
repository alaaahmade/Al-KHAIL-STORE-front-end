import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'src/utils/axios';

interface ContactState {
  chats: any[];
  loading: boolean;
  error: string | null;
  currentChat: any;
}

const initialState: ContactState = {
  chats: [],
  loading: false,
  error: null,
  currentChat: null,
};

export const fetchChats = createAsyncThunk(
  'contact-management/fetchChats',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/v1/chat/rooms/user/${userId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user chats');
    }
  }
);

export const deleteCustomer = async (id: string) => {
  const customer = await axios.delete(``);
  return customer.data;
};

export const fetchChatDetails = createAsyncThunk(
  'contact-management/fetchChatDetails',
  async (roomId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/v1/chat/room/${roomId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch current chat');
    }
  }
);

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.chats = [];
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.chats = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchChats.rejected, (state) => {
        state.chats = [];
        state.loading = false;
        state.error = 'Failed to fetch users chats';
      })
      .addCase(fetchChatDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChat = action.payload;
      })
      .addCase(fetchChatDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default contactSlice.reducer;
