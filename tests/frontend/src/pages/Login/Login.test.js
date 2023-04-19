import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../store/auth";
import Login from "./Login";

// Mock fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        message: "success",
        token: "mockToken",
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        accountType: "user",
      }),
  })
);

// Mock localStorage
global.localStorage = {
  setItem: jest.fn(),
};

// Mock useDispatch hook
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));

describe("Login component", () => {
  let store;
  let dispatchMock;

  beforeEach(() => {
    // Create Redux store with authReducer
    store = configureStore({ reducer: { auth: authReducer } });

    // Mock useDispatch hook
    dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);

    // Render Login component wrapped in BrowserRouter and Provider
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Login />
        </Provider>
      </BrowserRouter>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders login form correctly", () => {
    // Check if email input field is rendered
    const emailInput = screen.getByLabelText("Email Address");
    expect(emailInput).toBeInTheDocument();

    // Check if password input field is rendered
    const passwordInput = screen.getByLabelText("Password");
    expect(passwordInput).toBeInTheDocument();

    // Check if login button is rendered
    const loginButton = screen.getByRole("button", { name: "Login" });
    expect(loginButton).toBeInTheDocument();

    // Check if "Don't have an account? Sign up" link is rendered
    const signUpLink = screen.getByRole("link", { name: "Don't have an account? Sign up" });
    expect(signUpLink).toBeInTheDocument();
  });

  it("submits login form with correct data and dispatches actions", async () => {
    // Enter email and password
    const emailInput = screen.getByLabelText("Email Address");
    const passwordInput = screen.getByLabelText("Password");
    fireEvent.change(emailInput, { target: { value: "johndoe@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Submit form
    const loginButton = screen.getByRole("button", { name: "Login" });
    fireEvent.click(loginButton);

    // Wait for fetch and dispatch to be called
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    await waitFor(() => expect(dispatchMock).toHaveBeenCalled());

    // Check if localStorage.setItem is called with correct data
    expect(global.localStorage.setItem).toHaveBeenCalledWith("token", "mockToken");

    // Check if authActions.setCredential is dispatched with correct data
    expect(dispatchMock).toHaveBeenCalledWith(
      authActions.setCredential({
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        accountType: "user",
      })
    );

    // Check if navigate function is called with correct path
    expect(screen.history.push).toHaveBeenCalledWith("/");
  });

  it("displays error message when login fails", async () => {
    // Set loginError to an error message
