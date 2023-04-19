import { render, screen, fireEvent } from "@testing-library/react";
import Applications from "./Applications";

//testing uses JEST
// Mock the necessary dependencies
jest.mock("react-router-dom", () => ({
  useSearchParams: jest.fn(() => [new URLSearchParams({ jobId: "123" }), jest.fn()]),
}));

describe("Applications component", () => {
  test("renders component with application data", async () => {
    // Mock the fetch response
    const mockApplications = [
      {
        _id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        appliedJobs: {
          job: {
            companyName: "Example Company",
            position: "Software Engineer",
          },
          coverLetter: "Sample cover letter",
          CV: "sample_cv.pdf",
        },
      },
    ];

    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ students: mockApplications }),
      })
    );

    // Render the Applications component
    render(<Applications />);

    // Wait for the fetch to complete
    await screen.findByText("John Doe");

    // Assert that the application data is rendered
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Cover Letter")).toBeInTheDocument();
    expect(screen.getByText("Download CV")).toBeInTheDocument();
    expect(screen.getByText("Select For interview")).toBeInTheDocument();
    expect(screen.getByText("Reject")).toBeInTheDocument();

    // Clean up the fetch mock
    global.fetch.mockRestore();
  });

  test("clicking on Download CV button calls downloadPdfHandler with correct application data", async () => {
    // Mock the fetch response
    const mockApplications = [
      {
        _id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        appliedJobs: {
          job: {
            companyName: "Example Company",
            position: "Software Engineer",
          },
          coverLetter: "Sample cover letter",
          CV: "sample_cv.pdf",
        },
      },
    ];

    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ students: mockApplications }),
      })
    );

    // Mock the downloadPdfHandler
    const downloadPdfHandler = jest.fn();

    // Render the Applications component
    render(<Applications />);

    // Wait for the fetch to complete
    await screen.findByText("John Doe");

    // Click on the Download CV button
    fireEvent.click(screen.getByText("Download CV"));

    // Assert that downloadPdfHandler is called with correct application data
    expect(downloadPdfHandler).toBeCalledWith(mockApplications[0]);

    // Clean up the fetch mock
    global.fetch.mockRestore();
  });

  test("clicking on Select For interview button calls interviewEmail with correct application data", async () => {
    // Mock the fetch response
    const mockApplications = [
      {
        _id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        appliedJobs: {
          job: {
            companyName: "Example Company",
            position: "Software Engineer",
          },
          coverLetter: "Sample cover letter",
          CV: "sample_cv.pdf",
        },
      },
    ];

    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ students: mockApplications }),
      })
    );

    //
