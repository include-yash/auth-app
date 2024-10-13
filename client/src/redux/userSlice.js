import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser : null,
    isLoading : false,
    error : ""
}

const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {
        signInStart: (state)=>{
            state.isLoading = true
        },
        signInSuccess: (state,action)=>{
            state.currentUser = action.payload;
            state.isLoading = false;
            state.error = ""
        },
        signInFailure: (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;  
        }
    }
})