import { configureStore } from '@reduxjs/toolkit';
// import { persistStore, persistReducer } from 'redux-persist';
// import { rootPersistConfig, rootReducer } from './root-reducer';
import productsReducer from './slices/productsReducer';
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
import SellersSlice from './slices/SellersSlice';
import CategoriesSlice from './slices/CategoriesSlice';
import InterestsSlice from './slices/InterestsSlice';
import PlansSlice from './slices/PlanSlice';
import ordersSlice from './slices/ordersSlice';
import reviewsSlice from './slices/reviewsSlice';
import serviceSlice from './slices/serviceSlice';

// ----------------------------------------------------------------------

// export type RootState = ReturnType<typeof rootReducer>;
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

const store = configureStore({
  reducer: {
    products: productsReducer,
    business: businessReducer,
    role: roleReducer,
    permission: permissionReducer,
    user: userReducer,
    signDialog: signDialogSlice,
    NotificationsSlice,
    TransactionsSlice,
    SubscriptionsSlice,
    SellersSlice,
    CategoriesSlice,
    InterestsSlice,
    PlansSlice,
    ordersSlice,
    reviewsSlice,
    serviceSlice
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
