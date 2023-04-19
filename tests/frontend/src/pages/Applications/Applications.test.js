import React from "react";
import { render, screen } from "@testing-library/react";
import Applications from "./Applications";

// Mock the dependencies for the Applications component
jest.mock("react-router-dom", () => ({
  useSearchParams: jest.fn(() => [new URLSearchParams({ jobId: "123" })]),
}));

describe("Applications Component", () => {
  // Mock the fetch API for fetching applications data
  beforeAll(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ students: [] }),
      })
    );
  });

  it("renders job applications correctly", async () => {
    render(<Applications />);

    // Verify that the component renders the expected UI elements
    expect(screen.getByText("Job Applications")).toBeInTheDocument();
    expect(screen.queryAllByRole("button")).toHaveLength(0);

    // Wait for fetch to resolve and component to re-render
    await screen.findByRole("button");

    // Verify that the expected API endpoint is called with the correct headers
    expect(global.fetch).toHaveBeenCalledWith(
      "/application?jobId=123",
      expect.objectContaining({
        headers: {
          Authorization: expect.stringContaining("Bearer"),
        },
      })
    );

    // Verify that the component renders the expected UI elements after fetching data
    expect(screen.queryByText("No applications found")).toBeInTheDocument();
  });
});
