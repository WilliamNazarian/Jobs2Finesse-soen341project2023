const express = require("express");
const router = express.Router();
const Job = require("../mongooseCollections/Jobs");

router.get("/getAJob", async (req, res) => {
  try {
    const jsonJobs = await Job.findById(req.query.postId);
    res.json(JSON.stringify(jsonJobs));
  } catch (err) {
    res.json({ message: err });
  }
});

router.get("/", async (req, res) => {
  console.log("getting jobs");
  try {
    const jsonJobs = await Job.find();
    res.json(JSON.stringify(jsonJobs));
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("posting job")
    const createJob = new Job(req.body);
    await createJob.save();
  } catch (err) {
    console.log(err);
  }
});

router.delete("/", async (req, res) => {
  try {
    console.log("deleting a job")
    await Job.deleteOne({ _id: req.body.id });
    res.json({ message: "success" });
  } catch (err) {
    res.json({ message: err });
  }
});

router.put("/", async (req, res) => {
  try {
    console.log("updating a job")
    const doc = await Job.findOne({ _id: req.body._id });
    const update = req.body;
    await doc.updateOne(update);
    console.log("edit done")
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
