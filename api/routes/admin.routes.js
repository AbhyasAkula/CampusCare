const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Complaint = require("../models/Complaint");
const { protect, role } = require("../middleware/auth");


// GET ALL USERS
router.get("/users", protect, role("admin"), async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});


// BLOCK USER
router.put("/block/:id", protect, role("admin"), async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).json({ msg: "User not found" });

  user.isBlocked = true;
  await user.save();

  res.json({ msg: "User blocked" });
});


// VIEW ALL COMPLAINTS
router.get("/complaints", protect, role("admin"), async (req, res) => {
  const complaints = await Complaint.find().populate("student", "name email");
  res.json(complaints);
});

module.exports = router;

