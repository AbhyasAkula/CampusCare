const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Complaint = require("../models/Complaint"); // ⭐ NEW
const upload = require("../middleware/upload");
const { protect } = require("../middleware/auth.js");

// GET MY PROFILE + STATS
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    // 🔢 complaint statistics
    const totalComplaints = await Complaint.countDocuments({
      student: req.user.id,
    });

    const resolvedComplaints = await Complaint.countDocuments({
      student: req.user.id,
      status: "Resolved",
    });

    const pendingComplaints = await Complaint.countDocuments({
      student: req.user.id,
      status: { $ne: "Resolved" },
    });

    res.json({
      ...user._doc,
      totalComplaints,
      resolvedComplaints,
      pendingComplaints,
    });
  } catch (err) {
    res.status(500).json({ msg: "Profile load error" });
  }
});

// UPLOAD PROFILE IMAGE
router.put(
  "/upload",
  protect,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      user.profilePic = req.file.filename;
      await user.save();

      res.json({ msg: "Profile picture updated", profilePic: user.profilePic });
    } catch (err) {
      res.status(500).json({ msg: "Upload failed" });
    }
  }
);

module.exports = router;