import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./types";

export const initialState = {
  user: null,
  showPassword: false,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      // @ts-expect-error "no error"
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    setShowPassword: (state) => {
      state.showPassword = !state.showPassword;
    },
  },
});

export const { setUser, clearUser, setShowPassword } = globalSlice.actions;

export default globalSlice.reducer;
