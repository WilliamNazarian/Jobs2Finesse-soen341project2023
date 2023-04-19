import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import FormInsideModal from "./FormInsideModal";
import { submittedFormDataActions } from "../../store/submittedFormData";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

// Mock Redux store
const store = createStore(() => ({}));

// Mock useDispatch hook
jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Mock useLocation hook
jest.mock("react-router-dom", () => ({
  useLocation: jest.fn(),
}));

describe("FormInsideModal", () => {
  beforeEach(() => {
    useDispatch.mockReturnValue(jest.fn());
    useSelector.mockReturnValue("");
    useLocation.mockReturnValue({ pathname: "/jobs" });
  });

  test("renders form with input fields and submit button", () => {
    render(
      <Provider store={store}>
        <FormInsideModal onSubmitForm={() => {}} />
      </Provider>
    );

    // Check if form fields are rendered
    expect(screen.getByLabelText("Company Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Number Of Positions")).toBeInTheDocument();
    expect(screen.getByLabelText("Postion Offered")).toBeInTheDocument();
    expect(screen.getByLabelText("Country")).toBeInTheDocument();
    expect(screen.getByLabelText("Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Job Descripton")).toBeInTheDocument();

    // Check if checkboxes are rendered
    expect(screen.getByLabelText("Full Time:")).toBeInTheDocument();
    expect(screen.getByLabelText("Part Time:")).toBeInTheDocument();
    expect(screen.getByLabelText("Internship:")).toBeInTheDocument();

    // Check if submit button is rendered
    expect(screen.getByRole("button", { name: "Enter Job Post" })).toBeInTheDocument();
  });

  test("submit form with valid data", () => {
    const onSubmitFormMock = jest.fn();
    const setSubmittedFormDataMock = jest.fn();
    useDispatch.mockReturnValueOnce(jest.fn());
    useDispatch.mockReturnValueOnce(onSubmitFormMock);
    useSelector.mockReturnValueOnce("test@example.com");
    useSelector.mockReturnValueOnce(setSubmittedFormDataMock);

    render(
      <Provider store={store}>
        <FormInsideModal onSubmitForm={onSubmitFormMock} />
      </Provider>
    );

    // Fill in form fields
    fireEvent.change(screen.getByLabelText("Company Name"), { target: { value: "Test Company" } });
    fireEvent.change(screen.getByLabelText("Number Of Positions"), { target: { value: "5" } });
    fireEvent.change(screen.getByLabelText("Postion Offered"), { target: { value: "Test Position" } });
    fireEvent.change(screen.getByLabelText("Country"), { target: { value: "Test Country" } });
    fireEvent.change(screen.getByLabelText("Address"), { target: { value: "Test Address" } });
    fireEvent.change(screen.getByLabelText("Job Descripton"), { target: { value: "Test Description" } });
    fireEvent.click(screen.getByLabelText("Full Time:"));
    fireEvent.click(screen.getByLabelText("Part Time:"));
    fireEvent.click(screen.getByLabelText("Internship:"));

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: "Enter Job Post" }));

    // Check if form is submitted
    expect(onSubmitFormMock).toHaveBeenCalled();
    expect(setSubmittedFormDataMock).toHaveBeenCalledWith(true);
  });
});
