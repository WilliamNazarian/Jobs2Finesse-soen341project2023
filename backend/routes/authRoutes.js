const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../mongooseCollections/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = require("../middleware/verifyJWT");
//This code is a route handler for the POST request to /signup which is responsible for checking if 
//a user with the same email address already exists in the database.
router.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName, accountType } = req.body;
  const userWithSameEmail = await User.findOne({ email: email });
  if (userWithSameEmail !== null) {
    return res.json({ emailExists: true });
  }
//creates a new user in the database with hashed password using bcrypt and handles any errors that may occur during the save operation
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const createUser = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      accountType: accountType,
    });
    await createUser.save();
    return res.json({ emailExists: false });
  } catch (err) {
    console.log(err);
  }
});

// This code defines a route for handling login requests via HTTP POST method.
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (user === null) return res.json({ message: "User does not exist" });
  if (await bcrypt.compare(password, user.password)) {
    const payload = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      accountType: user.accountType,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return res.json({ message: "success", firstName: user.firstName, lastName: user.lastName, email: user.email, accountType: user.accountType, token: token });
  } else return res.json({ message: "Incorrect Password" });
});
//a route that checks if the user making the request is a company or not.
router.get("/checkIfCompany", verifyJWT, (req, res) => {
  const user = req.user;
  if (user.accountType === "company") res.json({ message: "success" });
  else res.json({ message: "error" });
});
// This code defines a PUT route handler for /editUserInfo that is protected by the verifyJWT middleware. 
//The route is used to update the user's account information, including their first name, last name, email, and password
router.put("/editUserInfo", verifyJWT, async (req, res) => {
  try {
    const account = await User.findById(req.user._id);
    const { firstName, lastName, email, oldPassword, newPassword } = req.body;
    if (!(await bcrypt.compare(oldPassword, account.password))) return res.json({ message: "Incorrect" });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await account?.updateOne({ firstName: firstName, lastName: lastName, email: email, password: hashedPassword });
    return res.json({ message: "success" });
  } catch (e) {
    console.log(e);
    return res.json({ message: e });
  }
});
// export
module.exports = router;
