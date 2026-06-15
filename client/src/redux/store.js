import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import matchReducer from './slices/matchSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    matches: matchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
