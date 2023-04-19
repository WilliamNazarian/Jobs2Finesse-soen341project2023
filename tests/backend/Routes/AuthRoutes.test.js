const request = require("supertest");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../mongooseCollections/User");
const router = require("../routes/auth"); // Import the router to be tested

jest.mock("jsonwebtoken"); // Mock the jsonwebtoken module

describe("Auth Routes", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/", router);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("POST /signup", () => {
    it("should return emailExists true if user email already exists", async () => {
      jest.spyOn(User, "findOne").mockResolvedValueOnce({ email: "test@example.com" });

      const response = await request(app)
        .post("/signup")
        .send({ email: "test@example.com", password: "testpassword", firstName: "Test", lastName: "User", accountType: "user" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ emailExists: true });
    });

    it("should create a new user and return emailExists false if user email does not exist", async () => {
      jest.spyOn(User, "findOne").mockResolvedValueOnce(null);
      jest.spyOn(User.prototype, "save").mockResolvedValueOnce();

      const response = await request(app)
        .post("/signup")
        .send({ email: "test@example.com", password: "testpassword", firstName: "Test", lastName: "User", accountType: "user" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ emailExists: false });
    });

    it("should return an error if there is an error during user save operation", async () => {
      jest.spyOn(User, "findOne").mockResolvedValueOnce(null);
      jest.spyOn(User.prototype, "save").mockRejectedValueOnce(new Error("Error saving user"));

      const response = await request(app)
        .post("/signup")
        .send({ email: "test@example.com", password: "testpassword", firstName: "Test", lastName: "User", accountType: "user" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Error saving user" });
    });
  });

  describe("POST /login", () => {
    it("should return an error if user does not exist", async () => {
      jest.spyOn(User, "findOne").mockResolvedValueOnce(null);

      const response = await request(app)
        .post("/login")
        .send({ email: "test@example.com", password: "testpassword" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "User does not exist" });
    });

    it("should return success message and JWT token if login is successful", async () => {
      const user = {
        _id: "12345",
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        accountType: "user",
        password: await bcrypt.hash("testpassword", 10)
      };

      jest.spyOn(User, "findOne").mockResolvedValueOnce(user);
      jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(true);
      jest.spyOn(jwt, "sign").mockReturnValueOnce("testtoken");

      const response = await request(app)
        .post("/login")
        .send({ email: "test@example.com", password: "testpassword" });

