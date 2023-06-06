import { render, screen, fireEvent } from "@testing-library/react";
import EditJob from "./EditJob";

describe("EditJob", () => {
  test("renders form with correct initial values", () => {
    // Mocking localStorage.getItem
    const localStorageMock = {
      getItem: jest.fn(() => "token"),
    };
    Object.defineProperty(window, "localStorage", { value: localStorageMock });

    // Mocking fetch for getJob request
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            _id: "1",
            companyName: "Test Company",
            numberOfPositions: 5,
            position: "Software Developer",
            country: "USA",
            address: "123 Main St",
            jobType: ["fullTime", "internship"],
            description: "Job description",
          }),
      })
    );

    render(<EditJob />);

    // Asserting form fields have correct initial values
    expect(screen.getByLabelText(/company name/i)).toHaveValue("Test Company");
    expect(screen.getByLabelText(/number of positions/i)).toHaveValue("5");
    expect(screen.getByLabelText(/position offered/i)).toHaveValue("Software Developer");
    expect(screen.getByLabelText(/country/i)).toHaveValue("USA");
    expect(screen.getByLabelText(/address/i)).toHaveValue("123 Main St");
    expect(screen.getByLabelText(/job descripton/i)).toHaveValue("Job description");
    expect(screen.getByLabelText(/full time/i)).toBeChecked();
    expect(screen.getByLabelText(/part time/i)).not.toBeChecked();
    expect(screen.getByLabelText(/internship/i)).toBeChecked();
  });

  test("form submission", async () => {
    // Mocking localStorage.getItem
    const localStorageMock = {
      getItem: jest.fn(() => "token"),
    };
    Object.defineProperty(window, "localStorage", { value: localStorageMock });

    // Mocking fetch for getJob request
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            _id: "1",
            companyName: "Test Company",
            numberOfPositions: 5,
            position: "Software Developer",
            country: "USA",
            address: "123 Main St",
            jobType: ["fullTime", "internship"],
            description: "Job description",
          }),
      })
    );

    // Mocking fetch for submitEditHandler request
    global.fetch = jest.fn(() =>
      Promise.resolve({
        then: () => ({ navigate: jest.fn() }),
      })
    );

    render(<EditJob />);

    // Submitting form
    fireEvent.submit(screen.getByTestId("edit-job-form"));

    // Asserting that fetch was called with correct arguments
    expect(global.fetch).toHaveBeenCalledWith("/jobs", {
      method: "PUT",
      body: expect.anything(),
      headers: { "Content-Type": "application/json", Authorization: "Bearer token" },
    });
  });
});
