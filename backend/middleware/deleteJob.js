const fs = require("fs");
const User = require("../mongooseCollections/User");

const deleteJobMiddleware = async (req, res, next) => {
  const jobId = req.body.id;

  // Find all users who have applied for the job
  const users = await User.find({ "appliedJobs.job": jobId });

  for (const user of users) {
    // Remove the applied job from the user's appliedJobs
    const appliedJob = user.appliedJobs.find((job) => job.job.toString() === jobId);
    if (appliedJob) {
      const cvPath = appliedJob.CV;

      // Delete the CV file
      fs.unlink(cvPath, (err) => {
        if (err) {
          console.error("Failed to delete the CV file:", err);
        }
      });

      // Remove the applied job from the user's appliedJobs array
      user.appliedJobs = user.appliedJobs.filter((job) => job.job.toString() !== jobId);
      await user.save();
    }
  }

  next();
};

module.exports = deleteJobMiddleware;