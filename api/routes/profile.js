const express = require("express");
const router = express.Router();
const User = require("../models/User");
const upload = require("../middleware/upload");
const { protect } = require("../middleware/auth");

// GET MY PROFILE
router.get("/", protect, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

// UPLOAD PROFILE IMAGE
router.put("/upload", protect, upload.single("profilePic"), async (req, res) => {
  const user = await User.findById(req.user.id);

  user.profilePic = req.file.filename;
  await user.save();

  res.json({ msg: "Profile picture updated", profilePic: user.profilePic });
});

module.exports = router;