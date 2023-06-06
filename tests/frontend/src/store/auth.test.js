import { authActions, default as authReducer } from "./auth";
import { configureStore } from "@reduxjs/toolkit";

//test file for auth.js using Jest

describe("authReducer", () => {
  let store;

  beforeEach(() => {
    store = configureStore({ reducer: { auth: authReducer } });
  });

  test("should set credentials correctly", () => {
    const credentials = {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
      accountType: "user",
    };

    store.dispatch(authActions.setCredential(credentials));

    const state = store.getState().auth;

    expect(state.firstName).toBe(credentials.firstName);
    expect(state.lastName).toBe(credentials.lastName);
    expect(state.email).toBe(credentials.email);
    expect(state.accountType).toBe(credentials.accountType);
  });

  test("should logout and reset state", () => {
    store.dispatch(authActions.logout());

    const state = store.getState().auth;

    expect(state.firstName).toBeNull();
    expect(state.lastName).toBeNull();
    expect(state.email).toBeNull();
    expect(state.accountType).toBe("guest");
  });
});
