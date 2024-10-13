import {configureStore, ConfigureStore} from '@reduxjs/toolkit';

export const store = configureStore({
    reducer: {},
    middleware: (getDefaultMiddleware) =>getDefaultMiddleware({
        serializableCheck:  false,
    }),
});

