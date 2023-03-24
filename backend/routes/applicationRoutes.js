const express = require("express");
const router = express.Router();
const User = require("../mongooseCollections/User");
const verifyJWT = require("../middleware/verifyJWT");
const upload = require("../middleware/multerUpload");
const path = require('path');

router.post("/", verifyJWT, upload.single("CV"), async (req, res) => {
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

router.get("/", verifyJWT, async (req, res) => {
  if (req.user.accountType !== "company") return res.json({ message: "unauthorized User" });

  const jobId = req.query.jobId;

  try {
    const studentsWithAllJobs = await User.find( { "appliedJobs.job": jobId } );
    
    const students = studentsWithAllJobs.map((student) => {
      
      const job = student.appliedJobs.find((appliedJob)=> appliedJob.job.toString()===jobId.toString())
      student.appliedJobs = job
      return student
    });
    
    if (students.length === 0) return res.status(200).json({ students: [], message: "No Applications Are Submitted Yet" });
    return res.status(200).json({ students:students });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch applied student" });
  }
});


router.get('/download/CVs/:filename', (req, res) => {
  console.log("here")
  const filename = req.params.filename;
  const filePath = path.join(__dirname,"..", 'CVs', filename);
  console.log(filePath)
  res.download(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to download the file' });
    }
  });
});

module.exports = router;
