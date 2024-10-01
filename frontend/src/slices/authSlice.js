import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
};

// Helper function to check if expirationTime has passed
const checkExpiration = () => {
  const expirationTime = localStorage.getItem("expirationTime");
  if (expirationTime && new Date().getTime() > expirationTime) {
    return true; // Expired
  }
  return false; // Not expired
};

const authSlice = createSlice({
  name: "login",
  initialState: {
    ...initialState,
    userInfo: checkExpiration() ? null : initialState.userInfo, // Set userInfo to null if expired
  },
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));

      const expirationTime = new Date().getTime() + 1 * 24 * 60 * 60 * 1000; // 1 day expiration
      localStorage.setItem("expirationTime", expirationTime);
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("expirationTime");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
