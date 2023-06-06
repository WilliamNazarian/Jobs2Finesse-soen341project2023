const mongoose = require("mongoose");

//a Mongoose schema and model for a user, which can be used to create, retrieve, update, and delete user data in a MongoDB database.

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
// modeling
const User = mongoose.model("User", userSchema);
// export
module.exports = User;
