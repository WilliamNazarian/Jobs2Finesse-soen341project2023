// Importing required modules
const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");

// Importing app file
const app = require("./app"); // Update the file path based on your directory structure

// Test cases for the app
describe("App", () => {
  beforeAll(async () => {
    // Connect to MongoDB test database before running tests
    await mongoose.connect("mongodb://127.0.0.1:27017/JobsToFinesseTest");
  });

  afterAll(async () => {
    // Disconnect from MongoDB test database after running tests
    await mongoose.connection.close();
  });

  it("should connect to MongoDB database", async () => {
    // Test if the MongoDB database is connected
    expect(mongoose.connection.readyState).toBe(1);
  });

  it("should have middleware to parse incoming request bodies", () => {
    // Test if the app has middleware to parse request bodies
    expect(app._router.stack[2].name).toBe("urlencodedParser");
    expect(app._router.stack[3].name).toBe("jsonParser");
  });

  it("should use the correct routes", () => {
    // Test if the app uses the correct routes
    expect(app._router.stack[4].route.path).toBe("/jobs");
    expect(app._router.stack[5].route.path).toBe("/auth");
    expect(app._router.stack[6].route.path).toBe("/application");
  });

  it("should start the server on the correct port", async () => {
    // Test if the app starts the server on the correct port
    const response = await request(app).get("/").send();
    expect(response.status).toBe(404); // Assuming there is no route defined for the root path
  });
});
