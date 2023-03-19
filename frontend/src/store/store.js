import { configureStore } from "@reduxjs/toolkit";


import authReducer from './auth'
import submittedFormDataReducer from "./submittedFormData";

const store = configureStore({
  reducer: {auth: authReducer, submittedFormData: submittedFormDataReducer}
});


export default store;