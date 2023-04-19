
// defines a Mongoose schema and model for a job posting, 
// which can be used to create, retrieve, update, and delete job postings in a MongoDB database.

const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  companyName: String, // String is shorthand for {type: String}
  numberOfPositions: Number,
  position: String,
  country: String,
  address: String,
  description: String,
  jobType: [String],
  dateCreated: { type: Date, immutable: true, default: () => Date.now() },
  expiryDate: Date,
  postedBy: String
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
