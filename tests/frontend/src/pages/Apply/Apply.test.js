import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Apply from "./Apply";

// Mock dependencies
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
  })),
}));
global.localStorage = {
  getItem: jest.fn(),
};

describe("Apply component", () => {
  beforeEach(() => {
    // Clear mock function calls and reset component state before each test
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test("renders component correctly", () => {
    render(<Apply />);

    // Assert that relevant elements are rendered
    expect(screen.getByText("Upload CV")).toBeInTheDocument();
    expect(screen.getByLabelText("Cover Letter")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  test("handles file upload correctly", async () => {
    const file = new File([""], "cv.pdf", { type: "application/pdf" });
    const handleFileUploadMock = jest.fn();
    jest.spyOn(React, "useState").mockImplementation(() => [null, handleFileUploadMock]);

    render(<Apply />);

    const fileInput = screen.getByLabelText("Upload CV");

    fireEvent.change(fileInput, { target: { files: [file] } });

    // Assert that file is set in component state
    expect(handleFileUploadMock).toHaveBeenCalledTimes(1);
    expect(handleFileUploadMock).toHaveBeenCalledWith(file);
  });

  test("handles form submission correctly", async () => {
    const mockResponse = { ok: true, json: jest.fn() };
    jest.spyOn(global, "fetch").mockResolvedValue(mockResponse);
    jest.spyOn(console, "log").mockImplementation(() => {});

    const handleSubmitMock = jest.fn();
    jest.spyOn(React, "useState").mockImplementation(() => [null, jest.fn(), jest.fn(), handleSubmitMock]);

    render(<Apply />);

    const submitButton = screen.getByText("Submit");

    fireEvent.click(submitButton);

    // Assert that form submission is handled correctly
    expect(handleSubmitMock).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith();
    await waitFor(() => expect(screen.getByText("You successfully applied to this job")).toBeInTheDocument());
  });
});
