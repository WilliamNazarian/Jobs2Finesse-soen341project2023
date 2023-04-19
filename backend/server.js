// Importing and initializing the required modules
const express = require("express");
const mongoose = require("mongoose");


// Importing and initializing the required routes
const jobsRoutes = require("./routes/jobsRoutes")
const authRoutes = require("./routes/authRoutes")
const applicationRoutes = require("./routes/applicationRoutes")

const app = express(); // Instance of Express app

// Middleware to parse incoming request bodies 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to MongoDB database
main().catch((err) => console.log(err));
async function main() {
  // Set the strict mode for the queries, that only allows  keys defined to be saved in the db
  await mongoose.set("strictQuery", true);
  await mongoose.connect("mongodb://127.0.0.1:27017/JobsToFinesse");
}
//basically with strictQuery = true you can only put whatever is in your schema in the Database, if you try to add something extra it doesn't work

// Using the routes
app.use("/jobs", jobsRoutes)
app.use("/auth", authRoutes)
app.use("/application", applicationRoutes)


// Starting the server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
