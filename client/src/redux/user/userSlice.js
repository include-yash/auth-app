import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentuser: null,
    loading: false,
    error: "",
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.currentuser = action.payload;
            state.loading = false;
            state.error = "";
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { signInStart, signInSuccess, signInFailure } = userSlice.actions;

export default userSlice.reducer;
