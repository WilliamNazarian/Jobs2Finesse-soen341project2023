// Setting up the necessary modules and middleware functions for defining routes and handling incoming HTTP requests in a Node.js application that works 
// with job listings and user data in a MongoDB database.
const express = require("express");
const router = express.Router();
const Job = require("../mongooseCollections/Jobs");
const User = require("../mongooseCollections/User");
const verifyJWT = require("../middleware/verifyJWT");
const upload = require("../middleware/multerUpload");
const deleteJobMiddleware = require("../middleware/deleteJob");

// Allows a client to retrieve a single job listing from the MongoDB database by making a GET request to the "/getAJob" endpoint
// with the ID of the job listing specified in the query string.
router.get("/getAJob", async (req, res) => {
  try {
    const jsonJobs = await Job.findById(req.query.postId);
    res.json(jsonJobs);
  } catch (err) {
    res.json({ message: err });
  }
});

router.get("/", async (req, res) => {
  try {
    const jsonJobs = await Job.find();
    res.json(jsonJobs);
  } catch (err) {
    res.json({ message: err });
  }
});

// Allows a company user to retrieve all job listings that they have posted by making a GET request to the "/getUsersPostedJobs" endpoint and including their email 
// address as a query parameter in the request URL. The JWT included in the request header is used to verify the user's identity and ensure that only company users can retrieve 
// their own job listings.
router.get("/getUsersPostedJobs", verifyJWT, async (req, res) => {
  if (req.user.accountType !== "company") return res.json({ message: "unauthorized User" });
  try {
    const email = req.query.email;
    const jobs = await Job.find({ postedBy: email });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Allows a company user to create a new job listing by making a POST request to the "/" endpoint and including the necessary job data in the request body.
// The JWT included in the request header is used to verify the user's identity and ensure that only company users can create job listings.
router.post("/", verifyJWT, async (req, res) => {
  if (req.user.accountType !== "company") return res.json({ message: "unauthorized User" });
  try {
    const createJob = new Job(req.body);
    await createJob.save();
    res.status(203).json({ success: true });
  } catch (err) {
    res.json({ message: "error" });
  }
});

// Delete a job listing that they have posted by making a DELETE request to the root endpoint ("/") and including the ID of the job listing in
// the id property of the request body. The JWT included in the request header is used to verify the user's identity and ensure that only company users 
// can delete their own job listings. The custom middleware function deleteJobMiddleware ensures that the job listing being deleted belongs to the authenticated user.
router.delete("/", verifyJWT, deleteJobMiddleware, async (req, res) => {
  if (req.user.accountType !== "company") return res.json({ message: "unauthorized User" });
  try {
    await Job.deleteOne({ _id: req.body.id });
    res.json({ message: "success" });
  } catch (err) {
    res.json({ message: err });
  }
});

router.put("/", verifyJWT, async (req, res) => {
  if (req.user.accountType !== "company") return res.json({ message: "unauthorized User" });
  try {
    const doc = await Job.findOne({ _id: req.body._id });
    const { companyName, numberOfPositions, position, country, address, jobType, description } = req.body;
    const update = { companyName, numberOfPositions, position, country, address, jobType, description };
    await doc.updateOne(update);
    return res.status(201).json({ success: true });
  } catch (err) {
    console.log(err);
  }
});

// This is an API endpoint for applying to a job. The endpoint expects a POST request with the following data in the request body (jobID and coverletter).
// The endpoint expects a file with the key "CV" in the request body, which is uploaded using the multer middleware. 
router.post("/applied", verifyJWT, upload.single("CV"), async (req, res) => {
  if (req.user.accountType !== "student") return res.json({ message: "unauthorized User" });

  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    const newAppliedJob = {
      job: req.body.jobId,
      CV: req.file.path,
      coverLetter: req.body.coverLetter,
    };
    user.appliedJobs.push(newAppliedJob);
    await user.save();
    res.json({ message: "Job applied successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
