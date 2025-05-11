import { createSlice } from '@reduxjs/toolkit';
import axios from 'src/utils/axios';
import { _advertisements } from 'src/_mock/_advertisements';

interface AdvertisementsState {
  advertisements: any[];
  open: boolean;
  isHome: boolean;
  newAd: {
    title: string;
    image: string;
    link: string;
    id?: string
  }
  editMode: boolean
  loadingB: boolean
}

const initialState: AdvertisementsState = {
  advertisements:[..._advertisements],
  open: false,
  editMode: false,
  isHome: false,
  newAd: {
    title: '',
    image: '',
    link: '',
    id: ''
  },
  loadingB : false
};


export const gitAdvertisements = async () => {
  const advertisements = await axios.get('/advertisements')

  return advertisements.data.advertisements
}

const AdvertisementsSlice = createSlice({
  name: 'Advertisements',
  initialState,
  reducers: {
    setAdvertisements : (state, action) => {
      state.advertisements = action.payload;
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
    changeNewAd: (state, action) => {
      const { field, value }: { field: keyof AdvertisementsState['newAd']; value: string } = action.payload;
      state.newAd[field] = value;  
    },

    setEditMode: (state, action) => {
      state.editMode = action.payload;
    },
    setLadingB: (state, action) => {
      state.loadingB = action.payload;
    },
    
  },
});

export const {  setAdvertisements, openCreateDialog,setLadingB, closeCreateDialog, setEditMode,changeIsHome, changeNewAd } = AdvertisementsSlice.actions;

export default AdvertisementsSlice.reducer;
