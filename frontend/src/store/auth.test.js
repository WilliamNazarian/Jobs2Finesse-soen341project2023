import { configureStore } from "@reduxjs/toolkit";
import authReducer, { authActions } from "./authSlice";
//test file for auth.js

describe("authSlice", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
  });

  test("should set credential correctly", () => {
    const credential = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      accountType: "user",
    };

    store.dispatch(authActions.setCredential(credential));

    const { firstName, lastName, email, accountType } = store.getState().auth;

    expect(firstName).toEqual(credential.firstName);
    expect(lastName).toEqual(credential.lastName);
    expect(email).toEqual(credential.email);
    expect(accountType).toEqual(credential.accountType);
  });

  test("should logout and reset state", () => {
    const currentState = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      accountType: "user",
    };

    store = configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState: { auth: currentState },
    });

    store.dispatch(authActions.logout());

    const { firstName, lastName, email, accountType } = store.getState().auth;

    expect(firstName).toBeNull();
    expect(lastName).toBeNull();
    expect(email).toBeNull();
    expect(accountType).toEqual("guest");
  });
});
