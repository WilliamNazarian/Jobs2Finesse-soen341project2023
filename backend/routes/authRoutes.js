const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../mongooseCollections/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = require("../middleware/verifyJWT");

router.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName, accountType } = req.body;
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
      accountType: accountType,
    });
    await createUser.save();
    return res.json({ emailExists: false });
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (user === null) return res.json({ message: "User does not exist" });
  if (await bcrypt.compare(password, user.password)) {
    const payload = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      accountType: user.accountType,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });
    return res.json({ message: "success", firstName: user.firstName, lastName: user.lastName, email: user.email, accountType: user.accountType, token: token });
  } else return res.json({ message: "Incorrect Password" });
});

router.get("/checkAccountType", verifyJWT, (req, res) => {
  const user = req.user;
  res.json({ accountType: user.accountType });
});

module.exports = router;