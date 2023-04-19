import { configureStore } from "@reduxjs/toolkit";
import store from "./store";
import authReducer from "./auth";
import submittedFormDataReducer from "./submittedFormData";

describe("store", () => {
  test("should have correct reducers in configuration", () => {
    const rootReducer = store.reducer;
    const expectedReducers = {
      auth: authReducer,
      submittedFormData: submittedFormDataReducer,
    };

    expect(rootReducer).toEqual(expectedReducers);
  });

  test("should be configured with correct store options", () => {
    const storeOptions = store.middleware;
    const expectedOptions = {
      reducer: {
        auth: authReducer,
        submittedFormData: submittedFormDataReducer,
      },
    };

    expect(storeOptions).toEqual(expectedOptions);
  });
});
