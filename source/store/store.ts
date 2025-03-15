import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/userSlice";
import uiSlice from "./slice/UIslice";

const store = configureStore({
  reducer: {
    user: userSlice,
    ui: uiSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
