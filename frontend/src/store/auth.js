import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { firstName: null, lastName: null, email: null, accountType: "guest" },
  reducers: {
    setCredential: (state, action) => {
      const { firstName, lastName, email, accountType } = action.payload;
      state.firstName = firstName;
      state.lastName = lastName;
      state.email = email;
      state.accountType = accountType;
    },
    logout: (state, action) => {
      state.firstName = null;
      state.lastName = null;
      state.email = null;
      state.accountType = "guest";
    },
  },
});
//like writing login: (state)=>{ ... }

export const authActions = authSlice.actions;

export default authSlice.reducer;
