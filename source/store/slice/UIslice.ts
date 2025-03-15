import { createSlice } from "@reduxjs/toolkit";

const initialState: UIStateType = {
  modal: {
    active: false,
  },
};

const UISlice = createSlice({
  name: "UI",
  initialState,
  reducers: {
    setModal: (state, { payload }: { payload: UIStateType["modal"] }) => {
      state.modal = payload;
    },
  },
});
export default UISlice.reducer;
export const { setModal } = UISlice.actions;
