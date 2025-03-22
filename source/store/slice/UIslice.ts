import { createSlice } from "@reduxjs/toolkit";

const initialState: UIStateType = {
  modal: {
    active: false,
  },
  changeTheme: 0,
  hasReviewed: "",
};

const UISlice = createSlice({
  name: "UI",
  initialState,
  reducers: {
    setModal: (state, { payload }: { payload: UIStateType["modal"] }) => {
      state.modal = payload;
    },
    changeTheme: (state) => {
      state.changeTheme += 1;
    },
    setHasReviewed: (state, { payload }: { payload: string }) => {
      state.hasReviewed = payload;
    }
  },
});
export default UISlice.reducer;
export const { setModal, changeTheme, setHasReviewed } = UISlice.actions;
