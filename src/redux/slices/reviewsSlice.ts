import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'src/utils/axios';

interface ReviewsState {
  reviews: any[];
  latestReviews: any[];
  productReviews: any[]
  reviewsTypes: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ReviewsState = {
  reviews: [],
  latestReviews: [],
  productReviews: [],
  reviewsTypes: [],
  loading: false,
  error: null,
};


// Reviews Actions
export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/v1/comments');
      return response.data.data;
      
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

export const fetchLatestReviews = createAsyncThunk(
  'reviews/fetchLatestReviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/v1/reviews/latest');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

export const createCommentReply = createAsyncThunk(
  'reviews/createCommentReply',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.post('/v1/comment-replies', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create comment reply');
    }
  }
);

export const createReviews = createAsyncThunk(
  'reviews/createReviews',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.post('/v1/reviews', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create reviews');
    }
  }
);

export const fetchCommentsByProduct = createAsyncThunk(
  'reviews/fetchCommentsByProduct',
  async(productId: string, {rejectWithValue}) => {
    try {
      const {data} = await axios.get(`/v1/reviews/product/${productId}`)
      return data.data
    } catch (error) {
      rejectWithValue(error?.response?.data?.message || 'Failed to fetch reviews')
    }
  }
)

export const updateReviews = createAsyncThunk(
  'reviews/updateReviews',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/v1/reviews/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update reviews');
    }
  }
);

export const deleteReviews = createAsyncThunk(
  'reviews/deleteReviews',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/v1/reviews/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete reviews');
    }
  }
);

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      // Reviews
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createReviews.fulfilled, (state, action) => {
        state.reviews.push(action.payload);
      })
      .addCase(updateReviews.fulfilled, (state, action) => {
        const index = state.reviews.findIndex((reviews) => reviews.id === action.payload.id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })
      .addCase(deleteReviews.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter((reviews) => reviews.id !== action.payload);
      })
      // Latest Reviews
      .addCase(fetchLatestReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLatestReviews.fulfilled, (state, action) => {
        state.loading = false;        
        state.latestReviews = action.payload.data;
      })
      .addCase(fetchLatestReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCommentsByProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCommentsByProduct.fulfilled, (state, action) => {
        state.loading = false;        
        state.productReviews = action.payload;
      })
      .addCase(fetchCommentsByProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
  },
});


export default reviewsSlice.reducer;
