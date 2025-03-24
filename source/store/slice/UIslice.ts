import { createSlice } from "@reduxjs/toolkit";

const initialState: UIStateType = {
  modal: {
    active: false,
  },
  changeTheme: 0,
  updateMyBooks: 0,
  hasReviewed: "",
};

const UISlice = createSlice({
  name: "UI",
  initialState,
  reducers: {
    setModal: (state, { payload }: { payload: UIStateType["modal"] }) => {
      state.modal = payload;
    },
    updateMyBooks: (state) => {
      state.updateMyBooks += 1;
    },
    changeTheme: (state) => {
      state.changeTheme += 1;
    },
    setHasReviewed: (state, { payload }: { payload: string }) => {
      state.hasReviewed = payload;
    },
  },
});
export default UISlice.reducer;
export const { setModal, changeTheme, setHasReviewed, updateMyBooks } =
  UISlice.actions;
