import { createSlice } from "@reduxjs/toolkit";

const submittedFormDataSlice = createSlice({
  name: "submittedFormData",
  initialState: { submittedFormData: false },
  reducers: {
    setSubmittedFormData: (state, action) => {
      state.submittedFormData = action.payload
    },
  },
});

export const submittedFormDataActions = submittedFormDataSlice.actions;

export default submittedFormDataSlice.reducer;
