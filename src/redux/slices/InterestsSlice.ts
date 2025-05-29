import { createSlice } from '@reduxjs/toolkit';
import axios from 'src/utils/axios';

export const gitInterests = async () => {
  const response = await axios.get('/interests/');
  return response.data;
};

interface InterestsState {
  interests: any[]; // Replace 'any[]' with a specific type if known
  isLoading: boolean;
  ladingB: boolean;
  error: any;
  newInterest: {
    id?: string;
    name: string;
    image: File | string | null;
    description: string;
  };
  open: boolean;
  editMode?: string | null;
}

const initialState: InterestsState = {
  interests: [],
  ladingB: false,
  isLoading: false,
  error: {},
  newInterest: {
    name: '',
    image: null,
    description: '',
  },
  open: false,
};

const InterestsSlice = createSlice({
  name: 'Interests',
  initialState,
  reducers: {
    setInterests: (state, action) => {
      state.interests = [...action.payload];
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    changeNewInterest: (state, action) => {
      const {
        field,
        value,
      }: { field: keyof InterestsState['newInterest']; value: string | File | null } =
        action.payload;
      if (field === 'image' && (value === null || value instanceof File)) {
        state.newInterest[field] = value;
      } else if (field === 'image' && typeof value === 'string') {
        state.newInterest[field] = value;
      } else if (field !== 'image' && typeof value === 'string') {
        state.newInterest[field] = value;
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
});

export const {
  setInterests,
  setError,
  setIsLoading,
  changeNewInterest,
  openCreateDialog,
  closeCreateDialog,
  setEditMode,
  setLadingB,
} = InterestsSlice.actions;

export default InterestsSlice.reducer;
