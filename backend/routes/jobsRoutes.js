const express = require("express");
const router = express.Router();
const Job = require("../mongooseCollections/Jobs");
const verifyJWT = require("../middleware/verifyJWT");

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

router.get('/getUsersPostedJobs',verifyJWT , async (req, res) => {
  if (req.user.accountType !== "company") res.json({message: "unauthorized User"})
  try {
    const email = req.query.email;
    const jobs = await Job.find({ postedBy: email });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post("/", verifyJWT ,async (req, res) => {
  if (req.user.accountType !== "company") res.json({message: "unauthorized User"})
  try {
    const createJob = new Job(req.body);
    await createJob.save();
    res.status(203).json({ success: true });
  } catch (err) {
    res.json({message: "error"})
  }
});

router.delete("/", verifyJWT , async (req, res) => {
  if (req.user.accountType !== "company") res.json({message: "unauthorized User"})
  try {
    await Job.deleteOne({ _id: req.body.id });
    res.json({ message: "success" });
  } catch (err) {
    res.json({ message: err });
  }
});

router.put("/", verifyJWT, async (req, res) => {
  if (req.user.accountType !== "company") res.json({message: "unauthorized User"})
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

module.exports = router;
