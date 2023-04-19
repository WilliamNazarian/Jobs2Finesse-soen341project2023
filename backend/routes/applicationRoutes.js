// Import required modules and middlewares
const express = require("express");
const router = express.Router();
const User = require("../mongooseCollections/User");
const verifyJWT = require("../middleware/verifyJWT");
const upload = require("../middleware/multerUpload");
const path = require("path");
const mongoose = require("mongoose");

// Route for applying to a job
router.post("/", verifyJWT, upload.single("CV"), async (req, res) => {
  if (req.user.accountType !== "student") return res.json({ message: "unauthorized User" });

  const userId = req.user._id;
  try {
    // Find the user by their ID
    const user = await User.findById(userId);
    // Create a new object with the job ID, CV path, and cover letter
    const newAppliedJob = {
      job: req.body.jobId,
      CV: req.file.path,
      coverLetter: req.body.coverLetter,
    };
    // Add the new job application to the user's array of applied jobs
    user.appliedJobs.push(newAppliedJob);
    await user.save(); // Save the updated user object to the database
    res.json({ message: "Job applied successfully" }); // Success message
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Server error" });
  }
});

// Route for getting a list of students who have applied to a specific job
router.get("/", verifyJWT, async (req, res) => {
  if (req.user.accountType !== "company") return res.json({ message: "unauthorized User" });

  const jobId = req.query.jobId;

  try {
    // Use the MongoDB pipeline to find all users who have applied to the specified job
    const students = await User.aggregate([
      { $match: { "appliedJobs.job": mongoose.Types.ObjectId(jobId) } },
      { $unwind: "$appliedJobs" },
      { $match: { "appliedJobs.job": mongoose.Types.ObjectId(jobId) } },
      {
        $lookup: {
          from: "jobs",
          localField: "appliedJobs.job",
          foreignField: "_id",
          as: "appliedJobs.job",
        },
      },
      { $unwind: "$appliedJobs.job" },
      {
        $project: {
          password: 0,
        },
      },
    ]);

    // If there are no applications for the specified job, send a response with an empty array and a message
    if (students.length === 0) return res.status(200).json({ students: [], message: "No Applications Are Submitted Yet" });
    return res.status(200).json({ students: students });// Send a response with the list of students who have applied
  } catch (error) {
    console.error(error); // send 500 error
    return res.status(500).json({ error: "Failed to fetch applied student" });
  }
});

// Route for downloading a CV file
router.get("/download/CVs/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "..", "CVs", filename);
  res.download(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to download the file" });
    }
  });
});

module.exports = router;
