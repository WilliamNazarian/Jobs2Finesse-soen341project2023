import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SignUp from "../SignUp";

describe("SignUp component", () => {
  test("renders sign up form with required fields", () => {
    render(<SignUp />);
    // Check for First Name field
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeRequired();
    // Check for Last Name field
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeRequired();
    // Check for Email Address field
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeRequired();
    // Check for Password field
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeRequired();
    // Check for Account Type field
    expect(screen.getByLabelText(/Account Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Account Type/i)).toBeRequired();
  });

  test("submits form with valid data", () => {
    render(<SignUp />);
    // Fill in form data
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "John" } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: "john.doe@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "Password1@" } });
    fireEvent.click(screen.getByLabelText(/Account Type/i));
    fireEvent.click(screen.getByText(/Sign up/i));
    // Check that form is submitted
    expect(screen.getByText(/Sign up/i)).toBeDisabled();
  });

});
