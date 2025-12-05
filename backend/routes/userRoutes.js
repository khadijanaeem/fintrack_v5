const express = require("express");
const router = express.Router();
const User = require("../models/User");
// SIGNUP
router.post("/signup", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.send({ message: "Signup successful" });
});

// LOGIN
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.send({ message: "User not found" });

  if (req.body.password !== user.password)
    return res.send({ message: "Wrong password" });

  res.send({ message: "Login successful", role: user.role });
});

// ADMIN - COUNT USERS
router.get("/admin/users", async (req, res) => {
  const count = await User.countDocuments();
  res.send({ totalUsers: count });
});

module.exports = router;