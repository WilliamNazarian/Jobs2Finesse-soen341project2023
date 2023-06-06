import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Apply from "./Apply";

// Mock dependencies
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
  })),
}));
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("Apply component", () => {
  beforeEach(() => {
    // Reset mock functions and render component
    jest.clearAllMocks();
    render(<Apply />);
  });

  it("renders the component", () => {
    expect(screen.getByText("Upload CV")).toBeInTheDocument();
    expect(screen.getByLabelText("Cover Letter")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("uploads a file when CV is selected", async () => {
    // Mock file and handleFileUpload function
    const file = new File(["test file"], "test.pdf", { type: "application/pdf" });
    const handleFileUpload = jest.fn();
    const inputElement = screen.getByLabelText("Upload CV");

    // Upload file
    fireEvent.change(inputElement, { target: { files: [file] } });

    // Assert file is uploaded and handleFileUpload is called
    expect(screen.getByText(file.name)).toBeInTheDocument();
    expect(handleFileUpload).toHaveBeenCalledWith(expect.objectContaining({ target: { files: [file] } }));
  });

  it("submits form with correct data", async () => {
    // Mock form data and fetch response
    const file = new File(["test file"], "test.pdf", { type: "application/pdf" });
    const coverLetter = "This is a cover letter";
    const jobId = "jobId123";
    const formData = new FormData();
    formData.append("CV", file);
    formData.append("coverLetter", coverLetter);
    formData.append("jobId", jobId);
    const mockResponse = { ok: true, json: jest.fn() };
    mockFetch.mockResolvedValue(mockResponse);

    // Fill and submit form
    userEvent.upload(screen.getByLabelText("Upload CV"), file);
    fireEvent.change(screen.getByLabelText("Cover Letter"), { target: { value: coverLetter } });
    fireEvent.click(screen.getByText("Submit"));

    // Assert fetch is called with correct data
    expect(mockFetch).toHaveBeenCalledWith("/application", expect.objectContaining({ body: formData }));
    await screen.findByText("You successfully applied to this job");
  });

  it("handles form submission error", async () => {
    // Mock fetch response with error
    const mockResponse = { ok: false, status: 500 };
    mockFetch.mockResolvedValue(mockResponse);

    // Submit form
    fireEvent.click(screen.getByText("Submit"));

    // Assert error is logged
    expect(console.log).toHaveBeenCalledWith(expect.any(Error));
  });
});
