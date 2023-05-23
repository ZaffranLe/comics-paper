import { createSlice } from "@reduxjs/toolkit";
import { loadThemeFromLocalStorage } from "./utils/themeUtils";

const initialState = {
  theme: loadThemeFromLocalStorage(),
};

const AppSlice = createSlice({
  name: "App",
  initialState,
  reducers: {},
});

export const {} = AppSlice.actions;

export default AppSlice.reducer;
