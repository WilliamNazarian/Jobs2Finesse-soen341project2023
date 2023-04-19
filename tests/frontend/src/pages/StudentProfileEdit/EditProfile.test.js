import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../../store/auth";
import EditProfile from "./EditProfile";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("EditProfile", () => {
  const mockAuth = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    accountType: "user",
  };

  beforeEach(() => {
    useSelector.mockReturnValue(mockAuth);
    useDispatch.mockReturnValue(jest.fn());
    useNavigate.mockReturnValue(jest.fn());
  });

  it("renders edit profile form", () => {
    render(<EditProfile />);
    const firstNameInput = screen.getByLabelText("First Name");
    const lastNameInput = screen.getByLabelText("Last Name");
    const emailInput = screen.getByLabelText("Email");
    const oldPasswordInput = screen.getByLabelText("Old Password");
    const newPasswordInput = screen.getByLabelText("New Password (password can remain same)");
    const editProfileButton = screen.getByText("Edit Profile");

    expect(firstNameInput).toBeInTheDocument();
    expect(lastNameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(oldPasswordInput).toBeInTheDocument();
    expect(newPasswordInput).toBeInTheDocument();
    expect(editProfileButton).toBeInTheDocument();
  });

  it("submits form with correct values", async () => {
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);

    render(<EditProfile />);

    const firstNameInput = screen.getByLabelText("First Name");
    const lastNameInput = screen.getByLabelText("Last Name");
    const emailInput = screen.getByLabelText("Email");
    const oldPasswordInput = screen.getByLabelText("Old Password");
    const newPasswordInput = screen.getByLabelText("New Password (password can remain same)");
    const editProfileButton = screen.getByText("Edit Profile");

    fireEvent.change(firstNameInput, { target: { value: "Jane" } });
    fireEvent.change(lastNameInput, { target: { value: "Doe" } });
    fireEvent.change(emailInput, { target: { value: "jane.doe@example.com" } });
    fireEvent.change(oldPasswordInput, { target: { value: "oldPassword" } });
    fireEvent.change(newPasswordInput, { target: { value: "newPassword" } });

    fireEvent.click(editProfileButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith(
        authActions.setCredential({
          firstName: "Jane",
          lastName: "Doe",
          email: "jane.doe@example.com",
          accountType: "user",
        })
      );
    });
  });

  it("displays success message on successful form submission", async () => {
    render(<EditProfile />);

    const firstNameInput = screen.getByLabelText("First Name");
    const lastNameInput = screen.getByLabelText("Last Name");
    const emailInput = screen.getByLabelText("Email");
    const oldPasswordInput = screen.getByLabelText("Old Password");
    const newPasswordInput = screen.getByLabelText("New Password (password can remain same)");
    const editProfileButton = screen.getByText("Edit Profile");

    fireEvent.change(firstNameInput, { target: { value: "Jane" } });
    fireEvent.change(lastNameInput, { target: { value: "Doe" } });
    fireEvent.change(email
