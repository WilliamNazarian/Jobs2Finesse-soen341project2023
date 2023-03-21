import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
  name: "auth",
  initialState: {firstName: null, lastName: null, email: null, accountType: "guest", token: null},
  reducers: {
    setCredential: (state,action)=>{
      const {firstName, lastName, email, accountType, token} = action.payload
      state.firstName = firstName
      state.lastName = lastName
      state.email = email
      state.accountType = accountType
      state.token = token
    },
    logout: (state, action)=>{
      state.firstName = null
      state.lastName = null
      state.email = null
      state.accountType = "guest"
      state.token = null
    }
  },
});
//like writing login: (state)=>{ ... }


export const authActions = authSlice.actions

export default authSlice.reducer;