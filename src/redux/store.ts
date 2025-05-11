import { configureStore } from '@reduxjs/toolkit';
// import { persistStore, persistReducer } from 'redux-persist';
// import { rootPersistConfig, rootReducer } from './root-reducer';
import serviceReducer from './slices/serviceSlice';
// import authReducer from './slices/authSlice';
// import userReducer from './slices/userSlice';
import businessReducer from './slices/businessSlice';
import roleReducer from './slices/roleSlice';
import permissionReducer from './slices/permissionSlice';
import userReducer from './slices/userSlice';
import signDialogSlice  from './slices/customerSignSlice';
import NotificationsSlice from './slices/notificationSlice';
import TransactionsSlice from './slices/transactionsSlice';
import SubscriptionsSlice from './slices/subscriptionsSlice';
import AdvertisementsSlice from './slices/AdsSlice';
import CategoriesSlice from './slices/CategoriesSlice';
import InterestsSlice from './slices/InterestsSlice';
import PlansSlice from './slices/PlanSlice';

// ----------------------------------------------------------------------

// export type RootState = ReturnType<typeof rootReducer>;
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

const store = configureStore({
  reducer: {
    service: serviceReducer,
    business: businessReducer,
    role: roleReducer,
    permission: permissionReducer,
    user: userReducer,
    signDialog: signDialogSlice,
    NotificationsSlice,
    TransactionsSlice,
    SubscriptionsSlice,
    AdvertisementsSlice,
    CategoriesSlice,
    InterestsSlice,
    PlansSlice
    // theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

// const persistor = persistStore(store);

// export { store, persistor };
export { store };
