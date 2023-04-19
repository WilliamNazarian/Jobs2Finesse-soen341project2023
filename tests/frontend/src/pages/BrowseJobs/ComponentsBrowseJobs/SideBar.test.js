import { render, screen, fireEvent } from "@testing-library/react";
import SideBar from "./SideBar";

describe("SideBar", () => {
  const jobs = [
    {
      _id: "1",
      companyName: "ABC Inc.",
      position: "Software Engineer",
      dateCreated: "2022-04-19",
    },
    {
      _id: "2",
      companyName: "XYZ Ltd.",
      position: "Data Analyst",
      dateCreated: "2022-04-20",
    },
  ];

  test("renders job list", () => {
    render(<SideBar jobs={jobs} />);
    const job1 = screen.getByText("ABC Inc.: Software Engineer");
    const job2 = screen.getByText("XYZ Ltd.: Data Analyst");
    expect(job1).toBeInTheDocument();
    expect(job2).toBeInTheDocument();
  });

  test("calls OnJobClick when job is clicked", () => {
    const onJobClick = jest.fn();
    render(<SideBar jobs={jobs} OnJobClick={onJobClick} />);
    const job1 = screen.getByTitle("1");
    fireEvent.click(job1);
    expect(onJobClick).toHaveBeenCalledTimes(1);
  });
});
