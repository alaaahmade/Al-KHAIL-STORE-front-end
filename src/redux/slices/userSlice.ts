import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'src/utils/axios';
import { IUser } from 'src/types/user';

interface UserState {
  users: IUser[];
  currentUser: IUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk('user/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/users');
    return response.data.data.users;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
  }
});

export const createUser = createAsyncThunk(
  'user/createUser',
  async (userData: Partial<IUser>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/users', userData);
      return response.data.user; // Make sure we return the created user data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ id, data }: { id: number; data: any }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/users/${id}`, data);
      console.log('Update response:', response.data); // For debugging
      return response.data.user; // Make sure we return the updated user data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`/users/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create user
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      // Update user
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          // Replace the entire user object with the updated data
          state.users[index] = action.payload;
        }
      })
      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      });
  },
});

export default userSlice.reducer;
