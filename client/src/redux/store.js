import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Note the change from {storage} to storage

// Combine reducers
const rootReducer = combineReducers({
    user: userReducer,
});

// Persist configuration
const persistConfig = {
    key: 'root',
    storage,
    version: 1,
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
export const store = configureStore({
    reducer: persistedReducer, // Use the persistedReducer directly here
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

// Create the persistor
export const persistor = persistStore(store);
