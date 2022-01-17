import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    loginModal: "login",
};

const auth = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload;
        },
        setLoginModal: (state, action) => {
            state.loginModal = action.payload;
        },
    },
});

export const { setAuthenticated, setLoginModal } = auth.actions;

export default auth.reducer;
