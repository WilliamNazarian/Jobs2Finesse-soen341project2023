import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import BrowseJobs from "./BrowseJobs";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

//Written using Jest framework

// Mocking the useSelector, useDispatch, and useNavigate hooks
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("BrowseJobs", () => {
  beforeEach(() => {
    // Reset the mock function calls before each test
    useSelector.mockClear();
    useDispatch.mockClear();
    useNavigate.mockClear();
  });

  test("renders BrowseJobs component correctly", () => {
    // Mock the useSelector hook
    useSelector.mockReturnValueOnce("student"); // Mock the accountType
    useSelector.mockReturnValueOnce("test@example.com"); // Mock the email
    useSelector.mockReturnValueOnce(null); // Mock the formSubmitted
    useSelector.mockReturnValueOnce(null); // Mock the jobs

    // Mock the useDispatch hook
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValueOnce(mockDispatch);

    // Mock the useNavigate hook
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValueOnce(mockNavigate);

    // Render the BrowseJobs component
    const { getByText } = render(<BrowseJobs />);

    // Assert that the component renders correctly
    expect(getByText("No Description")).toBeInTheDocument();
  });

  test("jobClickHandler function fetches job details correctly", async () => {
    // Mock the fetch function
    const mockFetch = jest.fn(() => {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            companyName: "Test Company",
            numberOfPositions: 5,
            position: "Test Position",
            country: "Test Country",
            address: "Test Address",
            description: "Test Description",
          }),
      });
    });
    global.fetch = mockFetch;

    // Mock the useState and useEffect hooks
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, "useState");
    useStateSpy.mockImplementationOnce(() => [null, setState]);
    useStateSpy.mockImplementationOnce(() => [null, setState]);

    // Render the BrowseJobs component
    const { getByText } = render(<BrowseJobs />);

    // Call the jobClickHandler function
    fireEvent.click(getByText("Edit"));
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));

    // Assert that the job details are fetched correctly
    expect(getByText("Test Company")).toBeInTheDocument();
    expect(getByText("5")).toBeInTheDocument();
    expect(getByText("Test Position")).toBeInTheDocument();
    expect(getByText("Test Country")).toBeInTheDocument();
    expect(getByText("Test Address")).toBeInTheDocument();
    expect(getByText("Test Description")).toBeInTheDocument();
  });

  // Write more test cases for other functions in the BrowseJobs component
});
