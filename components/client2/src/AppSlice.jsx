import { createSlice } from "@reduxjs/toolkit";
import { TOKEN_MAPPING_NAME } from "./utils/TokenManager";

const initialState = {
  userToken: localStorage.getItem(TOKEN_MAPPING_NAME),
  profile: null,
};

const AppSlice = createSlice({
  name: "App",
  initialState,
  reducers: {
    setUserToken: (state, action) => {
      state.userToken = action.payload;
    },
    removeUserToken: (state) => {
      state.userToken = null;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
  },
});

export const { setUserToken, removeUserToken, setProfile } = AppSlice.actions;

export default AppSlice.reducer;
