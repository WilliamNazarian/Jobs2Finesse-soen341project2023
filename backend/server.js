const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Job = require("./mongooseCollections/Jobs");
const User = require("./mongooseCollections/User");
var jwt = require('jsonwebtoken');
require('dotenv').config()

const jobsRoutes = require("./routes/jobsRoutes")

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

main().catch((err) => console.log(err));
async function main() {
  await mongoose.set("strictQuery", true);
  await mongoose.connect("mongodb://127.0.0.1:27017/JobsToFinesse");
}
//basically with strictQuery = true you can only put whatever is in your schema in the Database, if you try to add something extra it doesn't work


app.use("/jobs", jobsRoutes)










// app.get("/getJobs", async (req, res) => {
//   try {
//     const jsonJobs = await Job.find();
//     res.json(JSON.stringify(jsonJobs));
//   } catch (err) {
//     res.json({ message: err });
//   }
// });

// app.get("/getOneJob", async (req, res) => {
//   try {
//     const jsonJobs = await Job.findById(req.query.postId);
//     res.json(JSON.stringify(jsonJobs));
//   } catch (err) {
//     res.json({ message: err });
//   }
// });

// app.post("/postJob", async (req, res) => {
//   try {
//     const createJob = new Job(req.body);
//     await createJob.save();
//   } catch (err) {
//     console.log(err);
//   }
// });

app.post("/postuser", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  const userWithSameEmail = await User.findOne({ email: email });
  if (userWithSameEmail !== null) {
    return res.json({ emailExists: true });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const createUser = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
    });
    await createUser.save();
    return res.json({ emailExists: false });
  } catch (err) {
    console.log(err);
  }
});

app.post("/postlogin", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (user === null) return res.json({ message: "User does not exist" });
  if (await bcrypt.compare(password, user.password)){
    // const payload = {
    //   firstName: user.firstName,
    //   email: user.email,
    //   accountType: "general"
    // }
    //const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2 days' });
    return res.json({message: "success", firstName: user.firstName, lastName: user.lastName, email: user.email });
  } 
  else return res.json({message: "Incorrect Password"})
});

// app.delete("/deleteJob", async (req, res) => {
//   try {
//     const jsonJobs = await Job.deleteOne({ _id: req.body.id });
//   } catch (err) {
//     res.json({ message: err });
//   }
// });

// app.post("/updateJob", async (req, res) => {
//   try {
//     const doc = await Job.findOne({ _id: req.body._id });
//     const update = req.body;

//     await doc.updateOne(update);
//   } catch (err) {
//     console.log(err);
//   }
// });

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
