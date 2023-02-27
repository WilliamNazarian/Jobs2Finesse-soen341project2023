/* eslint-disable no-unused-vars */
const express = require("express");
const mongoose = require("mongoose");
const Job = require("./mongooseCollections/Jobs");
const User = require("./mongooseCollections/User")

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

main().catch((err) => console.log(err));
async function main() {
  await mongoose.set("strictQuery", true);
  await mongoose.connect("mongodb://127.0.0.1:27017/JobsToFinesse");
}
//basically with strictQuery = true you can only put whatever is in your schema in the Database, if you try to add something extra it doesn't work

app.get("/getJobs", async(req,res)=>{
  try{
    const jsonJobs = await Job.find();
    res.json(JSON.stringify(jsonJobs));
  }catch(err){
    res.json({message: err})
  }
});

app.get("/getOneJob", async(req,res)=>{
  try{
    const jsonJobs = await Job.findById(req.query.postId);
    res.json(JSON.stringify(jsonJobs));
  }catch(err){
    res.json({message: err})
  }
})

app.post("/postJob", async (req, res) => {
  try {
    const createJob = new Job(req.body);
    await createJob.save();
  } catch (err) {
    console.log(err);
  }
});

app.post("/postuser", async(req,res)=>{ 
  try {
    const createUser = new User(req.body);
    await createUser.save();
  } catch (err) {
    console.log(err);
  }
})

app.delete("/deleteJob", async(req,res)=>{
  try{
    const jsonJobs = await Job.deleteOne({_id: req.body.id});
  }catch(err){
    res.json({message: err})
  }
})

app.post("/updateJob", async(req,res)=>{
  console.log(req.body)
  try{
    const doc = await Job.findOne({ _id: req.body._id });
    const update = req.body ;
    
    await doc.updateOne(update);
  }catch(err){
    console.log(err)
  }
  
})




app.listen(5000, () => {
  console.log("Server running on port 5000");
});
