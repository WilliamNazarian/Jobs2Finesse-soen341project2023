import React from "react";
import { useSelector } from "react-redux";
import { render, screen } from "@testing-library/react";
import UserProfile from "./UserProfile";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

describe("UserProfile component", () => {
  beforeEach(() => {
    useSelector.mockClear();
  });

  test("renders user profile information correctly", () => {
    const auth = {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
      accountType: "student",
    };
    useSelector.mockReturnValue(auth);

    render(<UserProfile />);

    expect(screen.getByText("User Profile")).toBeInTheDocument();
    expect(screen.getByText(`First Name: ${auth.firstName}`)).toBeInTheDocument();
    expect(screen.getByText(`Last Name: ${auth.lastName}`)).toBeInTheDocument();
    expect(screen.getByText(`Email: ${auth.email}`)).toBeInTheDocument();
    expect(screen.getByText(`Account Type: ${auth.accountType}`)).toBeInTheDocument();
  });

  test("calls navigate function when edit button is clicked", () => {
    const auth = {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
      accountType: "student",
    };
    useSelector.mockReturnValue(auth);
    const navigateMock = jest.fn();
    const useNavigateMock = jest.fn().mockReturnValue(navigateMock);
    jest.spyOn(React, "useNavigate").mockImplementation(useNavigateMock);

    render(<UserProfile />);

    const editButton = screen.getByLabelText("edit profile");
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);

    expect(navigateMock).toHaveBeenCalledWith("/student-profile/edit");
  });
});
