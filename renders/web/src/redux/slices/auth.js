import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
    isAuthenticated: false,
    loginModal: false,
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

function logout() {
    return (dispatch) => {
        dispatch(setAuthenticated(false));
        localStorage.removeItem("token");
        toast.success("Đăng xuất thành công, hẹn gặp lại.");
    };
}

export { logout };

export default auth.reducer;
