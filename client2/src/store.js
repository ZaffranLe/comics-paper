/**
 * The configuration store for the Redux-toolkit
 */

import { configureStore } from "@reduxjs/toolkit";
import AppSlice from "./AppSlice";

export const store = configureStore({
  reducer: {
    /**
     * Add your slice here
     */

    App: AppSlice,
  },
});
