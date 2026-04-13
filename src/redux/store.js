import { configureStore } from '@reduxjs/toolkit';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'

import userReducer from './slices/userSlice'; // Import du reducer

// 2. Configuration de la persistence
const persistConfig = {
  key: 'respawn',
  storage
};

export const store = configureStore({
  reducer: {
    user: persistReducer(persistConfig, userReducer)
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});


export const persistor = persistStore(store)