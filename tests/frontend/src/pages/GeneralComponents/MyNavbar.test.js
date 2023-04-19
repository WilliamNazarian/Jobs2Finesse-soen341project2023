import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import MyNavbar from "./MyNavbar";

// Mock the dependencies
jest.mock("@mui/material/styles", () => ({
  styled: jest.fn(),
  useTheme: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  Link: jest.fn().mockReturnValue("a"),
  useNavigate: jest.fn(),
}));
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));
jest.mock("../../store/auth", () => ({
  authActions: {
    logout: jest.fn(),
  },
}));

describe("MyNavbar", () => {
  const mockStore = configureStore();
  let store;
  let component;

  beforeEach(() => {
    store = mockStore({
      auth: {
        accountType: "guest",
        firstName: "John",
        lastName: "Doe",
      },
    });

    component = render(
      <Provider store={store}>
        <MyNavbar />
      </Provider>
    );
  });

  test("renders logo", () => {
    const logoElement = component.getByAltText("Logo");
    expect(logoElement).toBeInTheDocument();
  });

  test("opens user menu on click", () => {
    const userMenuButton = component.getByLabelText("user-menu");
    fireEvent.click(userMenuButton);
    const menuItemElement = component.getByText("Logout");
    expect(menuItemElement).toBeInTheDocument();
  });

  test("logs out on click logout", () => {
    const dispatchMock = jest.fn();
    const authActionsMock = require("../../store/auth").authActions;
    authActionsMock.logout.mockImplementation(() => ({
      type: "AUTH/LOGOUT",
    }));
    const useDispatchMock = require("react-redux").useDispatch;
    useDispatchMock.mockReturnValue(dispatchMock);

    const userMenuButton = component.getByLabelText("user-menu");
    fireEvent.click(userMenuButton);
    const logoutMenuItem = component.getByText("Logout");
    fireEvent.click(logoutMenuItem);

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith({ type: "AUTH/LOGOUT" });
  });

  // Add more tests here for other functionalities in the component
});
