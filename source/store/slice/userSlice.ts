import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  available: boolean;
  data?: userDataType;
  tested: boolean;
  loading: boolean;
}

const initialState: UserState = {
  available: false,
  data: undefined,
  tested: false,
  loading: false,
};

const UserSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    setUserData: (state, { payload }: { payload: userDataType }) => {
      state.data = payload;
      state.tested = true;
      state.available = true;
      state.loading = false;
    },

    setUserTest: (state, { payload }: { payload: boolean }) => {
      state.tested = payload;
      state.loading = false;
    },

    setUserLoading: (state, { payload }: { payload: boolean }) => {
      state.loading = payload;
    },

    removeUserData: (state) => {
      state.data = undefined;
      state.available = false;
      state.loading = false;
      state.tested = true;
    },

    setUserName: (state, { payload }: { payload: string }) => {
      if (!state.data) return;
      state.data.name = payload;
    },

    setUserBio: (state, { payload }: { payload: string }) => {
      if (!state.data) return;
      state.data.bio = payload;
    },

    setUserAvatar: (state, { payload }: { payload: string }) => {
      if (!state.data) return;
      state.data.avatar = payload;
    },

    setUserMail: (state, { payload }: { payload: userDataType["mail"] }) => {
      if (!state.data) return;
      state.data.mail = payload;
    },

    setUserDiscord: (
      state,
      { payload }: { payload: userDataType["discord"] }
    ) => {
      if (!state.data) return;
      state.data.discord = payload;
    },

    setUserTwitter: (
      state,
      { payload }: { payload: userDataType["twitter"] }
    ) => {
      if (!state.data) return;
      state.data.twitter = payload;
    },

    setUserBorrowLockdown: (state, { payload }: { payload: string }) => {
      if (!state.data) return;
      state.data.borrowLockdownEndsAt = payload;
    },
  },
});
export default UserSlice.reducer;
export const {
  setUserData,
  setUserTest,
  removeUserData,
  setUserLoading,
  setUserName,
  setUserBio,
  setUserAvatar,
  setUserBorrowLockdown,
  setUserDiscord,
  setUserMail,
  setUserTwitter,
} = UserSlice.actions;
