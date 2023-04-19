const request = require("supertest");
const express = require("express");
const router = require("../router"); // Assuming the router is exported from a file named "router.js"
const Job = require("../mongooseCollections/Jobs"); // Assuming the Job model is exported from a file named "Jobs.js"
const User = require("../mongooseCollections/User"); // Assuming the User model is exported from a file named "User.js"
const verifyJWT = require("../middleware/verifyJWT"); // Assuming the verifyJWT middleware is exported from a file named "verifyJWT.js"
const upload = require("../middleware/multerUpload"); // Assuming the multerUpload middleware is exported from a file named "multerUpload.js"
const deleteJobMiddleware = require("../middleware/deleteJob"); // Assuming the deleteJobMiddleware is exported from a file named "deleteJob.js"

// Create an instance of express app to use for testing
const app = express();
app.use(express.json());
app.use("/", router);

describe("Job Listing Routes", () => {
  // Mock Job model
  jest.mock("../mongooseCollections/Jobs");
  const MockJob = {
    findById: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    deleteOne: jest.fn(),
    updateOne: jest.fn(),
  };
  Job.mockImplementation(() => MockJob);

  // Mock User model
  jest.mock("../mongooseCollections/User");
  const MockUser = {
    findById: jest.fn(),
    save: jest.fn(),
  };
  User.mockImplementation(() => MockUser);

  // Mock middleware
  jest.mock("../middleware/verifyJWT");
  const MockVerifyJWT = jest.fn();
  verifyJWT.mockImplementation(MockVerifyJWT);

  jest.mock("../middleware/multerUpload");
  const MockMulterUpload = jest.fn();
  upload.single.mockImplementation(MockMulterUpload);

  jest.mock("../middleware/deleteJob");
  const MockDeleteJobMiddleware = jest.fn();
  deleteJobMiddleware.mockImplementation(MockDeleteJobMiddleware);

  // Test GET /getAJob
  describe("GET /getAJob", () => {
    test("should retrieve a single job listing from the database", async () => {
      const mockJob = { _id: "123", title: "Job Title" };
      MockJob.findById.mockResolvedValue(mockJob);

      const response = await request(app).get("/getAJob").query({ postId: "123" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockJob);
    });

    test("should return an error message when job not found", async () => {
      MockJob.findById.mockRejectedValue(new Error("Job not found"));

      const response = await request(app).get("/getAJob").query({ postId: "123" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Job not found" });
    });

    test("should return an error message on server error", async () => {
      MockJob.findById.mockRejectedValue(new Error("Server error"));

      const response = await request(app).get("/getAJob").query({ postId: "123" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Server error" });
    });
  });

  // Test GET /
  describe("GET /", () => {
    test("should retrieve all job listings from the database", async () => {
      const mockJobs = [{ _id: "123", title: "Job Title 1" }, { _id: "456", title:
