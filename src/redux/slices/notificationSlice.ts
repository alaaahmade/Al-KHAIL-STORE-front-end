import { createSlice } from '@reduxjs/toolkit';

interface INotificationsSlice {
  openNotification: boolean;
  target: string;
  title: string;
  content: string;
  SOptions: any[]
  error: {
    [key: string]: string;
  },
  targetId: string;
}

const initialState: INotificationsSlice = {
  openNotification: false,
  target: '',
  title: '',
  content: '',
  error: {},
  SOptions: [],
  targetId: ''
};

const NotificationsSlice = createSlice({
  name: 'signDialog',
  initialState,
  reducers: {
    openNotificationsDialog: (state) => {
      state.openNotification = true; 
    },
    closeNotificationsDialog: (state) => {
      state.openNotification = false; 
    },

    changeStateValue: (state, action: { payload: { type: keyof INotificationsSlice; value: any } }) => {
      (state[action.payload.type] as typeof action.payload.value) = action.payload.value;
  },

  setError: (state, action) => {
    state.error = action.payload;
  },
  setSOptions: (state, action) => {
    state.SOptions = action.payload;
  }
}
});

export const { openNotificationsDialog, changeStateValue, closeNotificationsDialog,setError, setSOptions } = NotificationsSlice.actions;

export default NotificationsSlice.reducer;
