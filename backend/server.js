const express = require("express");
const mongoose = require("mongoose");



const jobsRoutes = require("./routes/jobsRoutes")
const authRoutes = require("./routes/authRoutes")

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
app.use("/auth", authRoutes)



app.listen(5000, () => {
  console.log("Server running on port 5000");
});
