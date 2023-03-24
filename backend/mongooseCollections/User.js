const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    default: "student"
  },
  appliedJobs: [{
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
    CV: {
      type: String,
      required: true,
    },
    coverLetter: {
      type: String,
      required: true,
    },
  }],
});

userSchema.pre("save", function(next) {
  if (this.accountType === "company") {
    this.appliedJobs = undefined;
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
