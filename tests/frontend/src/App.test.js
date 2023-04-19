import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
//Simple test file for simple app file
describe("App", () => {
  it("renders home page correctly", () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(getByText("Home")).toBeInTheDocument();
  });

  it("renders login page correctly", () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>
    );

    expect(getByText("Login")).toBeInTheDocument();
  });

  it("renders signup page correctly", () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={["/signup"]}>
        <App />
      </MemoryRouter>
    );

    expect(getByText("Sign Up")).toBeInTheDocument();
  });

});
