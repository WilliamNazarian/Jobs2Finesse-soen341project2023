const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const User = require("../mongooseCollections/User");
const router = require("./jobApplicationRoutes");

// Create an instance of the express app
const app = express();

// Set up the middleware and routes
app.use(express.json());
app.use("/", router);

// Connect to the test database
const mongoURI = "mongodb://localhost/testDB";
beforeAll(async () => {
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Disconnect from the test database
afterAll(async () => {
  await mongoose.connection.close();
});

// Mock the User model to isolate the tests
jest.mock("../mongooseCollections/User", () => ({
  findById: jest.fn(),
  aggregate: jest.fn(),
}));

describe("Job Application Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /", () => {
    test("should return unauthorized message for non-student user", async () => {
      User.findById.mockResolvedValue({ accountType: "company" });

      const response = await request(app)
        .post("/")
        .set("Authorization", "Bearer token")
        .field("jobId", "jobId")
        .attach("CV", "path/to/file")
        .field("coverLetter", "Cover letter");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "unauthorized User" });
    });

    test("should apply for a job successfully", async () => {
      User.findById.mockResolvedValue({
        _id: "userId",
        accountType: "student",
        appliedJobs: [],
        save: jest.fn(),
      });

      const response = await request(app)
        .post("/")
        .set("Authorization", "Bearer token")
        .field("jobId", "jobId")
        .attach("CV", "path/to/file")
        .field("coverLetter", "Cover letter");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Job applied successfully" });
      expect(User.findById).toHaveBeenCalledWith("userId");
      expect(User.prototype.save).toHaveBeenCalled();
    });

    test("should handle server error", async () => {
      User.findById.mockRejectedValue(new Error("DB error"));

      const response = await request(app)
        .post("/")
        .set("Authorization", "Bearer token")
        .field("jobId", "jobId")
        .attach("CV", "path/to/file")
        .field("coverLetter", "Cover letter");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Server error" });
      expect(User.findById).toHaveBeenCalledWith(expect.anything());
    });
  });

  describe("GET /", () => {
    test("should return unauthorized message for non-company user", async () => {
      User.aggregate.mockResolvedValue([]);

      const response = await request(app)
        .get("/")
        .set("Authorization", "Bearer token")
        .query({ jobId: "jobId" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "unauthorized User" });
    });

    test("should return empty array if no applications are submitted", async () => {
      User.aggregate.mockResolvedValue([]);

      const response = await request(app)
        .get("/")
        .set("Authorization", "Bearer token")
        .query({ jobId: "jobId" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        students: [],
        message:
